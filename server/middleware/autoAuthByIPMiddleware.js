import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'

export const autoAuthByIP = async (req, res, next) => {
    // Получаем IP-адрес клиента
    const clientIP =
        req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress

    const normalizedIP = clientIP.replace('::ffff:', '')

    try {
        const [rows] = await db.query(
            'SELECT id, name, role FROM users WHERE ip = ? LIMIT 1',
            [normalizedIP]
        )

        if (rows.length === 0) {
            return next() // IP не найден — передаём управление дальше
        }

        const user = rows[0]

        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '8h' }
        )

        // Добавим токен и пользователя в запрос
        req.headers.authorization = `Bearer ${token}`
        req.user = { id: user.id, name: user.name, role: user.role }

        console.log(`✅ Авто-авторизация: IP ${normalizedIP} → ${user.name} (${user.role})`)
        next()
    } catch (err) {
        console.error('❌ Ошибка авто-авторизации по IP:', err)
        next()
    }
}
