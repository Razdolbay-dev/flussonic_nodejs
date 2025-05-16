import express from 'express';
import bcrypt from 'bcrypt';
import { db } from '../config/db.js';
import { protectStrict } from '../middleware/authMiddleware.js';

const router = express.Router();
const SALT_ROUNDS = 10;

// Получить всех пользователей
router.get('/', protectStrict, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT users.*,
                   CONCAT(addresses.city, ', ', addresses.street, ' ', addresses.house_number) AS address_name
            FROM users
                     LEFT JOIN addresses ON users.address_id = addresses.id
            ORDER BY users.id DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Добавить нового пользователя
router.post('/', async (req, res) => {
    const { name, password, ip, address_id, token, role } = req.body;

    if (!name || !password || !ip || !address_id || !token || !role) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
        const [existing] = await db.query(
            'SELECT * FROM users WHERE name = ? OR token = ?',
            [name, token]
        );

        if (existing.length > 0) {
            return res.status(409).json({ error: 'Пользователь с таким именем или токеном уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const [result] = await db.query(
            'INSERT INTO users (name, password, ip, address_id, token, role) VALUES (?, ?, ?, ?, ?, ?)',
            [name, hashedPassword, ip, address_id, token, role]
        );

        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновить пользователя
router.put('/:id', async (req, res) => {
    const { name, password, ip, address_id, token, role } = req.body;

    if (!name || !password || !ip || !address_id || !token || !role) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const [result] = await db.query(
            'UPDATE users SET name = ?, password = ?, ip = ?, address_id = ?, token = ?, role = ? WHERE id = ?',
            [name, hashedPassword, ip, address_id, token, role, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.json({ message: 'Пользователь обновлён' });
    } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Удалить пользователя
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.json({ message: 'Пользователь удалён' });
    } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

export default router;
