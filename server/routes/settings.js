import express from 'express';
import { db } from '../config/db.js';
import { protectStrict } from '../middleware/authMiddleware.js'

const router = express.Router();

// Получить текущие настройки
router.get('/', protectStrict, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM settings LIMIT 1');
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Настройки не найдены' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Ошибка при получении настроек:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновить настройки
router.put('/', async (req, res) => {
    const { title, cdn_url, pubt, privt, username, password } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE settings SET 
                title = ?, 
                cdn_url = ?, 
                pubt = ?, 
                privt = ?, 
                username = ?, 
                password = ?
             LIMIT 1`,
            [title, cdn_url, pubt, privt, username, password]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Настройки не обновлены (возможно, строка отсутствует)' });
        }

        res.json({ message: 'Настройки успешно обновлены' });
    } catch (error) {
        console.error('Ошибка при обновлении настроек:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

export default router;
