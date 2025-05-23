// server/utils/getFlussonicSettings.js
import { db } from './db.js'
import axios from 'axios'

export const getFlussonicSettings = async () => {
    const [rows] = await db.query('SELECT * FROM settings LIMIT 1')
    if (!rows.length) throw new Error('Настройки Flussonic не найдены')

    const { cdn_url, username, password, pubt, privt } = rows[0]
    const auth = Buffer.from(`${username}:${password}`).toString('base64')

    return {
        cdnUrl: cdn_url,
        authHeader: `Basic ${auth}`,
        templates: { public: pubt, private: privt }
    }
};

export async function isCameraActive(uid) {
    try {
        const { cdnUrl, authHeader } = await getFlussonicSettings()
        const url = `${cdnUrl}/streamer/api/v3/streams/${uid}`
        const headers = {
            accept: 'application/json',
            authorization: authHeader
        }

        const { data } = await axios.get(url, { headers })

        const stats = data?.stats
        const inputStats = data?.inputs?.[0]?.stats

        // Проверка на все возможные неисправности
        const isBroken =
            stats?.alive === false ||                              // Камера не активна
            stats?.status === 'error' ||                           // Статус ошибки
            stats?.source_error === 'timeout' ||                   // RTSP-таймаут
            inputStats?.bytes === 0 ||                             // Нет байтов от источника
            inputStats?.started_at === null                        // Поток не стартовал
/*
        console.log(`Проверка ${uid}`, {
            alive: stats?.alive,
            status: stats?.status,
            source_error: stats?.source_error,
            bytes: inputStats?.bytes,
            started_at: inputStats?.started_at
        })
*/

        return !isBroken
    } catch (err) {
        console.warn(`Ошибка проверки камеры ${uid}:`, err.message)
        return false // Безопасно исключаем, если нет ответа от Flussonic
    }
};