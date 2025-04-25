// server/routes/webcams.js

import express from 'express'
import { db } from '../config/db.js'
import axios from 'axios'

const router = express.Router()

// Получить все камеры
router.get('/', async (req, res) => {
    const { address_id } = req.query

    try {
        let sql = `
            SELECT w.*, d.name AS dvr_name, a.city, a.street, a.house_number
            FROM webcam w
                     LEFT JOIN dvr d ON w.dvr_id = d.id
                     LEFT JOIN addresses a ON w.address_id = a.id
        `
        const params = []

        if (address_id) {
            sql += ' WHERE w.address_id = ?'
            params.push(address_id)
        }

        sql += ' ORDER BY w.id DESC'

        const [cams] = await db.query(sql, params)
        res.json(cams)
    } catch (err) {
        console.error('Ошибка при получении камер:', err)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

// Получить одну камеру
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM webcam WHERE id = ?', [req.params.id])
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Камера не найдена' })
        }
        res.json(rows[0])
    } catch (err) {
        console.error('Ошибка при получении камеры:', err)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

// Создать новую камеру
router.post('/', async (req, res) => {
    const { uid, name, url, dvr_id, address_id, role, day_count } = req.body
    const connection = await db.getConnection()

    try {
        // 1. Начинаем транзакцию
        await connection.beginTransaction()

        // 2. Вставляем камеру в БД
        const [result] = await connection.query(
            `INSERT INTO webcam (uid, name, url, dvr_id, address_id, role, day_count)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [uid, name, url, dvr_id, address_id, role, day_count]
        )

        // 3. Подготовка запроса в Flussonic
        const flussonicUrl = `http://192.168.1.76:8888/streamer/api/v3/streams/${uid}`

        const flussonicPayload = {
            inputs: [{ url }],
            title: name,
            template: '_pubcam',
            dvr: {
                root: '/media/dvr',
                dvr_limit: day_count.toString()
            }
        }

        const flussonicHeaders = {
            'accept': 'application/json',
            'content-type': 'application/json',
            'authorization': 'Basic cm9vdDpjdmRZUDc4YQ=='
        }

        // 4. Отправка в Flussonic
        const response = await axios.put(flussonicUrl, flussonicPayload, { headers: flussonicHeaders })

        if (response.status >= 400) {
            throw new Error(`Flussonic вернул ошибку: ${response.status}`)
        }

        // 5. Успех → коммитим
        await connection.commit()

        res.status(201).json({ id: result.insertId })
    } catch (err) {
        // 6. Ошибка → откат
        await connection.rollback()
        console.error('Ошибка при создании камеры или Flussonic:', err.message)
        res.status(500).json({ error: 'Ошибка при создании. Проверь Flussonic.' })
    } finally {
        connection.release()
    }
})

// Обновить камеру
router.put('/:id', async (req, res) => {
    const { uid, name, url, dvr_id, address_id, role, day_count } = req.body
    const connection = await db.getConnection()

    try {
        // 1. Начинаем транзакцию
        await connection.beginTransaction()

        // 2. Обновляем камеру в БД
        await connection.query(
            `UPDATE webcam 
       SET uid = ?, name = ?, url = ?, dvr_id = ?, address_id = ?, role = ?, day_count = ?
       WHERE id = ?`,
            [uid, name, url, dvr_id, address_id, role, day_count, req.params.id]
        )

        // 3. Подготовка данных для Flussonic
        const flussonicUrl = `http://192.168.1.76:8888/streamer/api/v3/streams/${uid}`

        const flussonicPayload = {
            inputs: [
                {
                    url: url
                }
            ],
            title: name,
            template: '_pubcam',
            dvr: {
                root: '/media/dvr',
                dvr_limit: day_count.toString()
            }
        }

        const flussonicHeaders = {
            'accept': 'application/json',
            'content-type': 'application/json',
            'authorization': 'Basic cm9vdDpjdmRZUDc4YQ=='
        }

        // 4. Запрос в Flussonic
        const response = await axios.put(flussonicUrl, flussonicPayload, { headers: flussonicHeaders })

        if (response.status >= 400) {
            throw new Error(`Flussonic вернул ошибку: ${response.status}`)
        }

        // 5. Всё успешно — коммитим транзакцию
        await connection.commit()

        res.json({ message: 'Камера обновлена' })
    } catch (err) {
        // 6. Ошибка — откатываем транзакцию
        await connection.rollback()
        console.error('Ошибка при обновлении камеры или Flussonic:', err.message)
        res.status(500).json({ error: 'Ошибка при обновлении. Проверь Flussonic.' })
    } finally {
        connection.release()
    }
})



// Удалить камеру
router.delete('/:id', async (req, res) => {
    const connection = await db.getConnection()

    try {
        await connection.beginTransaction()

        // 1. Получаем uid камеры, чтобы удалить стрим в Flussonic
        const [rows] = await connection.query('SELECT uid FROM webcam WHERE id = ?', [req.params.id])
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Камера не найдена' })
        }

        const uid = rows[0].uid

        // 2. Удаляем стрим в Flussonic
        const flussonicUrl = `http://192.168.1.76:8888/streamer/api/v3/streams/${uid}`
        const flussonicHeaders = {
            'accept': 'application/json',
            'authorization': 'Basic cm9vdDpjdmRZUDc4YQ=='
        }

        const flussonicResponse = await axios.delete(flussonicUrl, { headers: flussonicHeaders })

        if (flussonicResponse.status >= 400) {
            throw new Error(`Flussonic ошибка при удалении стрима: ${flussonicResponse.status}`)
        }

        // 3. Удаляем запись из БД
        await connection.query('DELETE FROM webcam WHERE id = ?', [req.params.id])

        await connection.commit()
        res.json({ message: 'Камера удалена и стрим в Flussonic тоже' })
    } catch (err) {
        await connection.rollback()
        console.error('Ошибка при удалении камеры или Flussonic:', err.message)
        res.status(500).json({ error: 'Ошибка при удалении. Проверь Flussonic.' })
    } finally {
        connection.release()
    }
})

export default router
