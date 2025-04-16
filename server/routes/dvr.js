import express from 'express';
import { db } from '../config/db.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const router = express.Router();
const execAsync = promisify(exec);

// Получить все DVR
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM dvr ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error('Ошибка при получении DVR:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Добавить новый DVR
router.post('/', async (req, res) => {
    const { name, path } = req.body;
    if (!name || !path) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO dvr (name, path) VALUES (?, ?)',
            [name, path]
        );
        res.status(201).json({ id: result.insertId, name, path });
    } catch (error) {
        console.error('Ошибка при добавлении DVR:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновить DVR
router.put('/:id', async (req, res) => {
    const { name, path } = req.body;

    if (!name || !path) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
        const [result] = await db.query(
            'UPDATE dvr SET name = ?, path = ? WHERE id = ?',
            [name, path, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'DVR не найден' });
        }

        res.json({ message: 'DVR обновлён', id: req.params.id, name, path });
    } catch (error) {
        console.error('Ошибка при обновлении DVR:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});


// Удалить DVR
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM dvr WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'DVR не найден' });
        }
        res.json({ message: 'DVR удалён' });
    } catch (error) {
        console.error('Ошибка при удалении DVR:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить статистику: размер и доступное место
router.get('/stats', async (req, res) => {
    const dvrPath = req.query.path;
    if (!dvrPath) return res.status(400).json({ error: 'Параметр path обязателен' });

    try {
        await fs.access(dvrPath); // Проверка существования

        const { stdout } = await execAsync(`du -sb "${dvrPath}" && df -B1 "${dvrPath}"`);
        const [duLine, ...dfLines] = stdout.trim().split('\n');

        const used = parseInt(duLine.split('\t')[0]);
        const dfStats = dfLines[dfLines.length - 1].split(/\s+/);
        const total = parseInt(dfStats[1]);
        const available = parseInt(dfStats[3]);

        res.json({
            used,
            total,
            available,
            usagePercent: Math.round((used / total) * 100)
        });
    } catch (error) {
        console.error('Ошибка при получении статистики DVR:', error.message);
        res.status(500).json({ error: 'Ошибка при получении данных диска' });
    }
});

export default router;
