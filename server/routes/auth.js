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
    const {fio, phone, address_ids, access_days} = req.body;

    if (!fio || !phone || !Array.isArray(address_ids) || address_ids.length === 0) {
        return res.status(400).json({message: 'Отсутствуют обязательные поля'});
    }

    try {
        const [existingUsers] = await db.query(
            'SELECT * FROM clients_tmp WHERE phone = ?',
            [phone]
        );

        const tmpCode = generateTmpCode();
        const msInDay = 86400000;
        const now = new Date();
        const accessUntil = new Date(now.getTime() + Math.min(access_days || 1, 7) * msInDay);
        const accessUntilStr = accessUntil.toISOString().slice(0, 19).replace('T', ' ');

        let clientId;

        if (existingUsers.length > 0) {
            const user = existingUsers[0];

            if (user.fio !== fio) {
                return res.status(409).json({message: 'Пользователь с таким телефоном уже существует, но ФИО не совпадает'});
            }

            await db.query(
                'UPDATE clients_tmp SET verification_code = ?, access_until = ?, created = NOW() WHERE id = ?',
                [tmpCode, accessUntilStr, user.id]
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
                'INSERT INTO clients_tmp (fio, phone, verification_code, access_until) VALUES (?, ?, ?, ?)',
                [fio, phone, tmpCode, accessUntilStr]
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
        try {
            await axios.post('http://192.168.88.192:5000/call', {
                code: tmpCode,
                phone: phone
            });
        } catch (ttsErr) {
            console.error('Ошибка TTS:', ttsErr);
            return res.status(500).json({message: 'Ошибка при отправке TTS вызова'});
        }

        res.status(200).json({message: 'Код отправлен, ожидается подтверждение'});

    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Ошибка сервера при регистрации'});
    }
});

router.post('/tmp-verify', async (req, res) => {
    const {phone, code} = req.body;
    console.log(`Phone: ${phone}\nCode: ${code} `)
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

        const plainPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const token = generateToken();

        await db.query(
            'UPDATE clients_tmp SET password = ?, token = ?, verification_code = NULL WHERE id = ?',
            [hashedPassword, token, user.id]
        );

        return res.status(200).json({
            message: 'Код подтверждён. Пароль создан',
            password: plainPassword,
            token
        });

    } catch (err) {
        console.error('Ошибка при подтверждении кода:', err);
        res.status(500).json({message: 'Ошибка сервера при подтверждении'});
    }
});

export default router;
