import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../config/db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE name = ?', [name]);
        const user = users[0];
        if (!user) return res.status(401).json({ message: 'Пользователь не найден' });

        const isMatch = password === user.password;
        if (!isMatch) return res.status(401).json({ message: 'Не верный пароль' });

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                role: user.role,
                origin: 'perm' // ✅ добавляем тип
            },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '1h' }
        )


        await db.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.post('/tmp-login', async (req, res) => {
    const { phone, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM clients_tmp WHERE phone = ?', [phone]);
        const user = users[0];
        if (!user) return res.status(401).json({ message: 'Пользователь не найден' });

        if (user.role !== 'user') {
            return res.status(403).json({ message: 'Доступ только для временных пользователей' });
        }

        const isMatch = password === user.password;
        if (!isMatch) return res.status(401).json({ message: 'Неверный пароль' });

        const token = jwt.sign(
            {
                id: user.id,
                phone: user.phone,
                role: user.role,
                origin: 'temp' // ✅ временный пользователь
            },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '1h' }
        )


        await db.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.post('/tmp-register', async (req, res) => {
    const { fio, phone, address_ids, access_days } = req.body;

    // Проверка на обязательные поля
    if (!fio || !phone || !Array.isArray(address_ids) || address_ids.length === 0) {
        return res.status(400).json({ message: 'Отсутствуют обязательные поля' });
    }

    try {
        // Проверяем, существует ли пользователь с таким телефоном
        const [existingUsers] = await db.query(
            'SELECT * FROM clients_tmp WHERE phone = ?',
            [phone]
        );

        const password = Math.random().toString().slice(2, 10);
        const token = Math.random().toString(36).substring(2, 22);
        const msInDay = 86400000;
        const now = new Date();
        const accessUntil = new Date(now.getTime() + Math.min(access_days || 1, 7) * msInDay);
        const accessUntilStr = accessUntil.toISOString().slice(0, 19).replace('T', ' ');

        let clientId;

        if (existingUsers.length > 0) {
            const user = existingUsers[0];

            // Проверка, совпадает ли ФИО
            if (user.fio !== fio) {
                return res.status(409).json({ message: 'Пользователь с таким телефоном уже существует, но ФИО не совпадает' });
            }

            const oldAccessUntil = new Date(user.access_until);
            const diffDays = Math.floor((now - oldAccessUntil) / msInDay);

            // Если access_until ещё актуальна
            if (oldAccessUntil > now) {
                // Обновление пароля и проверка адресов
                await db.query(
                    'UPDATE clients_tmp SET password = ?, token = ?, access_until = ?, created = NOW() WHERE id = ?',
                    [password, token, accessUntilStr, user.id]
                );

                // Проверяем и добавляем новые адреса, если их нет в clients_tmp_addresses
                for (const addrId of address_ids) {
                    const [existingAddresses] = await db.query(
                        'SELECT * FROM clients_tmp_addresses WHERE client_id = ? AND address_id = ?',
                        [user.id, addrId]
                    );
                    if (existingAddresses.length === 0) {
                        await db.query(
                            'INSERT INTO clients_tmp_addresses (client_id, address_id) VALUES (?, ?)',
                            [user.id, addrId]
                        );
                    }
                }

                clientId = user.id;

            } else if (diffDays < 7) {
                // Если access_until устарела менее чем на 7 дней
                return res.status(400).json({ message: 'Повторная регистрация возможна через 7 дней после окончания доступа' });

            } else {
                // Если access_until устарела более чем на 7 дней — обновляем
                await db.query(
                    'UPDATE clients_tmp SET password = ?, token = ?, access_until = ?, created = NOW() WHERE id = ?',
                    [password, token, accessUntilStr, user.id]
                );

                // Удаляем старые адреса
                await db.query('DELETE FROM clients_tmp_addresses WHERE client_id = ?', [user.id]);

                // Добавляем новые адреса
                for (const addrId of address_ids) {
                    await db.query(
                        'INSERT INTO clients_tmp_addresses (client_id, address_id) VALUES (?, ?)',
                        [user.id, addrId]
                    );
                }

                clientId = user.id;
            }

        } else {
            // Новый пользователь
            const [result] = await db.query(
                'INSERT INTO clients_tmp (fio, phone, password, token, access_until) VALUES (?, ?, ?, ?, ?)',
                [fio, phone, password, token, accessUntilStr]
            );

            clientId = result.insertId;

            // Добавление адресов
            for (const addrId of address_ids) {
                await db.query(
                    'INSERT INTO clients_tmp_addresses (client_id, address_id) VALUES (?, ?)',
                    [clientId, addrId]
                );
            }
        }

        console.log(`Пользователь обработан. Новый пароль: ${password}`);

        res.status(201).json({
            message: 'Временный доступ успешно выдан',
            token,
            password
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера при регистрации' });
    }
});

export default router;
