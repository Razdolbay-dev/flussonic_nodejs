import express from 'express';
import { db } from '../config/db.js';
import { protectStrict } from '../middleware/authMiddleware.js';

const router = express.Router();

// Получить все адреса
router.get('/', protectStrict, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM addresses');
        res.json(rows);
    } catch (error) {
        console.error('Ошибка при получении адресов:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить один адрес по ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM addresses WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Адрес не найден' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Ошибка при получении адреса:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Добавить новый адрес
router.post('/', async (req, res) => {
    const { city, street, house_number, address_ip } = req.body;
    if (!city || !street || !house_number) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO addresses (city, street, house_number, address_ip) VALUES (?, ?, ?, ?)',
            [city, street, house_number, address_ip || null]
        );
        res.status(201).json({ id: result.insertId, city, street, house_number, address_ip });
    } catch (error) {
        console.error('Ошибка при добавлении адреса:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновить адрес
router.put('/:id', async (req, res) => {
    const { city, street, house_number, address_ip } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE addresses SET city = ?, street = ?, house_number = ?, address_ip = ? WHERE id = ?',
            [city, street, house_number, address_ip || null, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Адрес не найден' });
        }
        res.json({ message: 'Адрес обновлён' });
    } catch (error) {
        console.error('Ошибка при обновлении адреса:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Удалить адрес
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM addresses WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Адрес не найден' });
        }
        res.json({ message: 'Адрес удалён' });
    } catch (error) {
        console.error('Ошибка при удалении адреса:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

export default router;
