// server/utils/getFlussonicSettings.js
import { db } from './db.js'

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
}
