import express from 'express';
import bcrypt from 'bcrypt';
import { db } from '../config/db.js';
import { nanoid } from 'nanoid';
import { protectStrict } from '../middleware/authMiddleware.js';

const router = express.Router();
const SALT_ROUNDS = 10;

// Получить всех временных клиентов
router.get('/', protectStrict, async (req, res) => {
    try {
        const [clients] = await db.query('SELECT * FROM clients_tmp ORDER BY id DESC');
        for (const client of clients) {
            const [addresses] = await db.query(
                'SELECT address_id FROM clients_tmp_addresses WHERE client_id = ?',
                [client.id]
            );
            client.addresses = addresses;
        }
        res.json(clients);
    } catch (err) {
        console.error('Ошибка при получении временных клиентов:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Добавить нового клиента
router.post('/', async (req, res) => {
    const { fio, phone, password, access_until, addresses = [] } = req.body;
    const token = nanoid(20);

    if (!fio || !phone || !password || !access_until) {
        return res.status(400).json({ error: 'Необходимы fio, phone, password и access_until' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const [result] = await db.query(
            'INSERT INTO clients_tmp (fio, phone, password, token, access_until) VALUES (?, ?, ?, ?, ?)',
            [fio, phone, hashedPassword, token, access_until]
        );

        const clientId = result.insertId;

        for (const addr of addresses) {
            await db.query(
                'INSERT INTO clients_tmp_addresses (client_id, address_id) VALUES (?, ?)',
                [clientId, addr.address_id]
            );
        }

        res.status(201).json({ id: clientId });
    } catch (err) {
        console.error('Ошибка при создании временного клиента:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновить клиента
router.put('/:id', async (req, res) => {
    let { fio, phone, password, access_until, addresses = [] } = req.body;
    const clientId = req.params.id;

    try {
        let hashedPassword;

        // Если передан новый пароль — хэшируем
        if (password) {
            hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        } else {
            // Пароль не передан — используем старый
            const [rows] = await db.query('SELECT password FROM clients_tmp WHERE id = ?', [clientId]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Клиент не найден' });
            }
            hashedPassword = rows[0].password;
        }

        await db.query(
            'UPDATE clients_tmp SET fio = ?, phone = ?, password = ?, access_until = ? WHERE id = ?',
            [fio, phone, hashedPassword, access_until, clientId]
        );

        await db.query('DELETE FROM clients_tmp_addresses WHERE client_id = ?', [clientId]);

        for (const addr of addresses) {
            await db.query(
                'INSERT INTO clients_tmp_addresses (client_id, address_id) VALUES (?, ?)',
                [clientId, addr.address_id]
            );
        }

        res.json({ message: 'Обновлено' });
    } catch (err) {
        console.error('Ошибка при обновлении клиента:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Удалить клиента
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM clients_tmp WHERE id = ?', [req.params.id]);
        res.json({ message: 'Удалён' });
    } catch (err) {
        console.error('Ошибка при удалении временного клиента:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

export default router;
