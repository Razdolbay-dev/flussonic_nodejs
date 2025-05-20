import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../config/db.js';
import axios from 'axios';
import crypto from 'crypto';

const router = express.Router();

function generateTmpCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-значный код
}

function generatePassword() {
    return Math.random().toString(36).slice(-8); // Пример простой генерации
}

function generateToken() {
    return crypto.randomBytes(16).toString('hex'); // 32 символа
}

router.get('/auto-login', async (req, res) => {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(clientIP);

    try {
        const [users] = await db.query('SELECT * FROM users WHERE ip = ?', [clientIP]);
        const user = users[0];

        if (!user) {
            return res.status(401).json({message: 'IP не найден в базе'});
        }

        const token = jwt.sign(
            {id: user.id, name: user.name, role: user.role, origin: 'perm'},
            process.env.TOKEN_SECRET_KEY,
            {expiresIn: '1h'}
        );

        await db.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

        res.json({token, role: user.role});
    } catch (err) {
        console.error('Ошибка автоавторизации:', err);
        res.status(500).json({message: 'Ошибка сервера'});
    }
});

router.post('/login', async (req, res) => {
    const {name, password} = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE name = ?', [name]);
        const user = users[0];
        if (!user) return res.status(401).json({message: 'Пользователь не найден'});

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({message: 'Не верный пароль'});

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                role: user.role,
                origin: 'perm' // ✅ добавляем тип
            },
            process.env.TOKEN_SECRET_KEY,
            {expiresIn: '1h'}
        )


        await db.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

        res.json({token, role: user.role});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Ошибка сервера'});
    }
});

router.post('/tmp-login', async (req, res) => {
    const {phone, password} = req.body;

    try {
        const [users] = await db.query('SELECT * FROM clients_tmp WHERE phone = ?', [phone]);
        const user = users[0];
        if (!user) return res.status(401).json({message: 'Пользователь не найден'});
        if (!user.is_verified) {
            return res.status(403).json({message: 'Номер телефона не подтверждён'});
        }
        if (user.role !== 'user') {
            return res.status(403).json({message: 'Доступ только для временных пользователей'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({message: 'Неверный пароль'});

        const token = jwt.sign(
            {
                id: user.id,
                phone: user.phone,
                role: user.role,
                origin: 'temp' // ✅ временный пользователь
            },
            process.env.TOKEN_SECRET_KEY,
            {expiresIn: '1h'}
        )


        await db.query('UPDATE clients_tmp SET token = ? WHERE id = ?', [token, user.id]);

        res.json({token});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Ошибка сервера'});
    }
});

router.post('/tmp-register', async (req, res) => {
    const {fio, phone, address_ids, access_days, password} = req.body;

    if (!fio || !phone || !Array.isArray(address_ids) || address_ids.length === 0 || !password) {
        return res.status(400).json({message: 'Отсутствуют обязательные поля'});
    }

    try {
        const [existingUsers] = await db.query(
            'SELECT * FROM clients_tmp WHERE phone = ?',
            [phone]
        );

        const tmpCode = generateTmpCode();
        const accessUntil = new Date(Date.now() + Math.min(access_days || 1, 7) * 86400000)
            .toISOString().slice(0, 19).replace('T', ' ');
        const hashedPassword = await bcrypt.hash(password, 10);

        let clientId;

        if (existingUsers.length > 0) {
            const user = existingUsers[0];

            if (user.fio !== fio) {
                return res.status(409).json({message: 'ФИО не совпадает с существующим номером'});
            }

            await db.query(
                `UPDATE clients_tmp SET verification_code = ?, password = ?, access_until = ?, created = NOW(), is_verified = 0
         WHERE id = ?`,
                [tmpCode, hashedPassword, accessUntil, user.id]
            );

            await db.query('DELETE FROM clients_tmp_addresses WHERE client_id = ?', [user.id]);

            for (const addrId of address_ids) {
                await db.query(
                    'INSERT INTO clients_tmp_addresses (client_id, address_id) VALUES (?, ?)',
                    [user.id, addrId]
                );
            }

            clientId = user.id;

        } else {
            const [result] = await db.query(
                `INSERT INTO clients_tmp (fio, phone, password, verification_code, access_until)
         VALUES (?, ?, ?, ?, ?)`,
                [fio, phone, hashedPassword, tmpCode, accessUntil]
            );

            clientId = result.insertId;

            for (const addrId of address_ids) {
                await db.query(
                    'INSERT INTO clients_tmp_addresses (client_id, address_id) VALUES (?, ?)',
                    [clientId, addrId]
                );
            }
        }

        // Отправка TTS-кода
        await axios.post('http://192.168.88.192:5000/call', {
            code: tmpCode,
            phone: phone
        });

        res.status(200).json({message: 'Код отправлен, ожидается подтверждение'});

    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Ошибка сервера при регистрации'});
    }
});

router.post('/tmp-verify', async (req, res) => {
    const {phone, code} = req.body;

    if (!phone || !code) {
        return res.status(400).json({message: 'Телефон и код обязательны'});
    }

    try {
        const [users] = await db.query(
            'SELECT * FROM clients_tmp WHERE phone = ? AND verification_code = ?',
            [phone, code]
        );

        if (users.length === 0) {
            return res.status(401).json({message: 'Неверный код или телефон'});
        }

        const user = users[0];

        await db.query(
            'UPDATE clients_tmp SET verification_code = NULL, is_verified = 1 WHERE id = ?',
            [user.id]
        );

        res.status(200).json({
            message: 'Код подтверждён. Пользователь активирован',
            password: '[скрыт]' // можно не отправлять вообще
        });

    } catch (err) {
        console.error('Ошибка при подтверждении кода:', err);
        res.status(500).json({message: 'Ошибка сервера при подтверждении'});
    }
});

export default router;
