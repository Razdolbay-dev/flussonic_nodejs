import express from 'express'
import { db } from '../config/db.js'
import { nanoid } from 'nanoid'

const router = express.Router()

// Получить всех временных клиентов
router.get('/', async (req, res) => {
    try {
        const [clients] = await db.query('SELECT * FROM clients_tmp ORDER BY id DESC')
        for (const client of clients) {
            const [addresses] = await db.query(
                'SELECT address_id FROM clients_tmp_addresses WHERE client_id = ?',
                [client.id]
            )
            client.addresses = addresses
        }
        res.json(clients)
    } catch (err) {
        console.error('Ошибка при получении временных клиентов:', err)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

// Добавить нового клиента
router.post('/', async (req, res) => {
    const { fio, phone, password, addresses = [] } = req.body
    const token = nanoid(20)

    try {
        const [result] = await db.query(
            'INSERT INTO clients_tmp (fio, phone, password, token) VALUES (?, ?, ?, ?)',
            [fio, phone, password, token]
        )

        const clientId = result.insertId

        for (const addr of addresses) {
            await db.query(
                'INSERT INTO clients_tmp_addresses (client_id, address_id, access_until) VALUES (?, ?, ?)',
                [clientId, addr.address_id, addr.access_until]
            )
        }

        res.status(201).json({ id: clientId })
    } catch (err) {
        console.error('Ошибка при создании временного клиента:', err)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

// Обновить клиента
router.put('/:id', async (req, res) => {
    const { fio, phone, password, addresses = [] } = req.body
    const clientId = req.params.id

    try {
        await db.query(
            'UPDATE clients_tmp SET fio = ?, phone = ?, password = ? WHERE id = ?',
            [fio, phone, password, clientId]
        )

        // Удалить старые адреса
        await db.query('DELETE FROM clients_tmp_addresses WHERE client_id = ?', [clientId])

        for (const addr of addresses) {
            await db.query(
                'INSERT INTO clients_tmp_addresses (client_id, address_id) VALUES (?, ?)',
                [clientId, addr.address_id]
            )
        }

        res.json({ message: 'Обновлено' })
    } catch (err) {
        console.error('Ошибка при обновлении клиента:', err)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

// Удалить клиента
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM clients_tmp WHERE id = ?', [req.params.id])
        res.json({ message: 'Удалён' })
    } catch (err) {
        console.error('Ошибка при удалении временного клиента:', err)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

export default router
