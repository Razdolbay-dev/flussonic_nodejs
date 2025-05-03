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
            { id: user.id, name: user.name, role: user.role },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '1h' }
        );

        await db.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
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
            { id: user.id, name: user.name, role: user.role },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '1h' }
        );

        await db.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

export default router;
