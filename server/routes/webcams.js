import express from 'express'
import {db} from '../config/db.js'
import {getFlussonicSettings} from '../config/getFlussonicSettings.js'
import axios from 'axios'
import {requireAuth} from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const {address_id, page = 1, limit = 10} = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const params = []
    let whereClause = ''

    if (address_id) {
        whereClause = 'WHERE w.address_id = ?'
        params.push(address_id)
    }

    try {
        const sql = `
            SELECT w.*, d.name AS dvr_name, a.city, a.street, a.house_number
            FROM webcam w
                     LEFT JOIN dvr d ON w.dvr_id = d.id
                     LEFT JOIN addresses a ON w.address_id = a.id
                ${whereClause}
            ORDER BY w.id DESC
                LIMIT ?
            OFFSET ?
        `
        params.push(parseInt(limit), offset)

        const countSql = `
            SELECT COUNT(*) as total
            FROM webcam w
                     LEFT JOIN dvr d ON w.dvr_id = d.id
                     LEFT JOIN addresses a ON w.address_id = a.id
                ${whereClause}
        `

        const [[countRow]] = await db.query(countSql, address_id ? [address_id] : [])
        const [cams] = await db.query(sql, params)

        res.json({
            items: cams,
            total: countRow.total
        })
    } catch (err) {
        console.error('Ошибка при получении камер с пагинацией:', err)
        res.status(500).json({error: 'Ошибка сервера'})
    }
})

router.get('/private', requireAuth, async (req, res) => {
    try {
        const {id: userId, origin} = req.user

        console.log(`Запрос камер от пользователя ID: ${userId}, источник: ${origin}`)

        let addressIds = []

        if (origin === 'temp') {
            const [rows] = await db.query(
                'SELECT address_id FROM clients_tmp_addresses WHERE client_id = ?',
                [userId]
            )
            addressIds = rows.map(row => row.address_id)
            console.log('Адреса временного пользователя:', addressIds)
        } else {
            const [rows] = await db.query(
                'SELECT address_id FROM users WHERE id = ?',
                [userId]
            )
            if (!rows.length) {
                console.warn('Пользователь не найден в таблице users:', userId)
                return res.status(404).json({message: 'Пользователь не найден'})
            }
            addressIds = [rows[0].address_id]
            console.log('Адрес постоянного пользователя:', addressIds)
        }

        if (!addressIds.length) {
            console.warn('Нет доступных адресов для пользователя')
            return res.json({items: [], total: 0})
        }

        const [cams] = await db.query(`
            SELECT w.*, d.name AS dvr_name, a.city, a.street, a.house_number
            FROM webcam w
                     LEFT JOIN dvr d ON w.dvr_id = d.id
                     LEFT JOIN addresses a ON w.address_id = a.id
            WHERE w.role = 'private'
              AND w.address_id IN (?)
            ORDER BY w.id DESC
        `, [addressIds])

        console.log(`Найдено приватных камер: ${cams.length}`)

        res.json({
            items: cams,
            total: cams.length
        })

    } catch (err) {
        console.error('Ошибка при получении приватных камер:', err)
        res.status(500).json({message: 'Ошибка сервера'})
    }
})

router.get('/public', async (req, res) => {
    const { address_id, page = 1, limit = 10 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const params = []
    let whereClause = 'WHERE w.role = "public"'

    if (address_id) {
        whereClause += ' AND w.address_id = ?'
        params.push(address_id)
    }

    try {
        const sql = `
            SELECT w.*, d.name AS dvr_name, a.city, a.street, a.house_number
            FROM webcam w
            LEFT JOIN dvr d ON w.dvr_id = d.id
            LEFT JOIN addresses a ON w.address_id = a.id
            ${whereClause}
            ORDER BY w.id DESC
            LIMIT ?
            OFFSET ?
        `
        params.push(parseInt(limit), offset)

        const countSql = `
            SELECT COUNT(*) AS total
            FROM webcam w
            LEFT JOIN dvr d ON w.dvr_id = d.id
            LEFT JOIN addresses a ON w.address_id = a.id
            ${whereClause}
        `

        const [[countRow]] = await db.query(countSql, address_id ? [address_id] : [])
        const [cams] = await db.query(sql, params)

        res.json({
            items: cams,
            total: countRow.total
        })
    } catch (err) {
        console.error('Ошибка при получении публичных камер:', err)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT w.*, d.name AS dvr_name, a.city, a.street, a.house_number
            FROM webcam w
                     LEFT JOIN dvr d ON w.dvr_id = d.id
                     LEFT JOIN addresses a ON w.address_id = a.id
            WHERE w.id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({error: 'Камера не найдена'});
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('Ошибка при получении камеры:', err);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

router.post('/', async (req, res) => {
    const {uid, name, url, dvr_id, address_id, role, day_count} = req.body
    const connection = await db.getConnection()

    try {
        const {cdnUrl, authHeader, templates} = await getFlussonicSettings()

        const templateName = role === 'private' ? templates.private : templates.public

        await connection.beginTransaction()

        // Получаем DVR путь по dvr_id
        const [[dvrRow]] = await connection.query('SELECT path FROM dvr WHERE id = ?', [dvr_id])
        if (!dvrRow || !dvrRow.path) throw new Error('DVR path not найден')

        const [result] = await connection.query(
            `INSERT INTO webcam (uid, name, url, dvr_id, address_id, role, day_count)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [uid, name, url, dvr_id, address_id, role, day_count]
        )

        const flussonicUrl = `${cdnUrl}/streamer/api/v3/streams/${uid}`

        const flussonicPayload = {
            inputs: [{ url: String(url) }],
            title: String(name),
            template: templateName,
            dvr: {
                root: String(dvrRow.path),
                dvr_limit: Number(day_count)
            }
        }

        const flussonicHeaders = {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: authHeader
        }

        const response = await axios.put(flussonicUrl, flussonicPayload, {headers: flussonicHeaders})

        if (response.status >= 400) throw new Error(`Flussonic error: ${response.status}`)

        await connection.commit()
        res.status(201).json({id: result.insertId})
    } catch (err) {
        await connection.rollback()
        console.error('Ошибка Flussonic или БД:', err.message)
        res.status(500).json({error: 'Ошибка при создании. Проверь Flussonic/настройки.'})
    } finally {
        connection.release()
    }
})

router.put('/:id', async (req, res) => {
    const { uid, name, url, dvr_id, address_id, role, day_count } = req.body
    const connection = await db.getConnection()

    try {
        const { cdnUrl, authHeader, templates } = await getFlussonicSettings()
        const templateName = role === 'private' ? templates.private : templates.public

        await connection.beginTransaction()

        // Получаем старые данные камеры
        const [[oldCam]] = await connection.query(`
            SELECT w.uid, w.name, w.url, w.dvr_id, w.address_id, w.role, w.day_count, d.path AS dvr_path
            FROM webcam w
                     LEFT JOIN dvr d ON w.dvr_id = d.id
            WHERE w.id = ?
        `, [req.params.id])
        if (!oldCam) throw new Error('Камера не найдена')

        // Получаем новый путь DVR
        const [[newDvr]] = await connection.query('SELECT path FROM dvr WHERE id = ?', [dvr_id])
        if (!newDvr?.path) throw new Error('Новый DVR путь не найден')

        const isChanged =
            oldCam.uid !== uid ||
            oldCam.name !== name ||
            oldCam.url !== url ||
            oldCam.dvr_id !== dvr_id ||
            oldCam.address_id !== address_id ||
            oldCam.role !== role ||
            oldCam.day_count !== day_count

        // Обновляем в БД всегда
        await connection.query(
            `UPDATE webcam
             SET uid = ?, name = ?, url = ?, dvr_id = ?, address_id = ?, role = ?, day_count = ?
             WHERE id = ?`,
            [uid, name, url, dvr_id, address_id, role, day_count, req.params.id]
        )

        // Только если что-то поменялось — обновляем Flussonic
        if (isChanged) {
            const flussonicUrl = `${cdnUrl}/streamer/api/v3/streams/${uid}`

            const flussonicPayload = {
                inputs: [{ url }],
                title: name,
                template: templateName,
                dvr: {
                    root: newDvr.path,
                    dvr_limit: Number(day_count)
                }
            }

            const flussonicHeaders = {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: authHeader
            }

            const response = await axios.put(flussonicUrl, flussonicPayload, {
                headers: flussonicHeaders
            })

            if (response.status >= 400) {
                throw new Error(`Flussonic вернул ошибку: ${response.status}`)
            }
        }

        await connection.commit()
        res.json({ message: 'Камера обновлена' })
    } catch (err) {
        await connection.rollback()
        console.error('Ошибка при обновлении камеры или Flussonic:', err.message)
        res.status(500).json({ error: 'Ошибка при обновлении. Проверь Flussonic.' })
    } finally {
        connection.release()
    }
})

router.delete('/:id', async (req, res) => {
    const connection = await db.getConnection()

    try {
        const {cdnUrl, authHeader, templates} = await getFlussonicSettings()


        await connection.beginTransaction()

        // 1. Получаем uid камеры, чтобы удалить стрим в Flussonic
        const [rows] = await connection.query('SELECT uid FROM webcam WHERE id = ?', [req.params.id])
        if (rows.length === 0) {
            return res.status(404).json({error: 'Камера не найдена'})
        }

        const uid = rows[0].uid

        // 2. Удаляем стрим в Flussonic
        const flussonicUrl = `${cdnUrl}/streamer/api/v3/streams/${uid}`

        const flussonicHeaders = {
            accept: 'application/json',
            authorization: authHeader
        }

        const flussonicResponse = await axios.delete(flussonicUrl, {headers: flussonicHeaders})

        if (flussonicResponse.status >= 400) {
            throw new Error(`Flussonic ошибка при удалении стрима: ${flussonicResponse.status}`)
        }

        // 3. Удаляем запись из БД
        await connection.query('DELETE FROM webcam WHERE id = ?', [req.params.id])

        await connection.commit()
        res.json({message: 'Камера удалена и стрим в Flussonic тоже'})
    } catch (err) {
        await connection.rollback()
        console.error('Ошибка при удалении камеры или Flussonic:', err.message)
        res.status(500).json({error: 'Ошибка при удалении. Проверь Flussonic.'})
    } finally {
        connection.release()
    }
})

export default router
