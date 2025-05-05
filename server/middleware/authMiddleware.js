import jwt from 'jsonwebtoken'

// Защита всех НЕ-GET запросов — роль 'user' не допускается
export const protectNonGetRequests = (req, res, next) => {
    if (req.method === 'GET') {
        return next()
    }

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Нет токена' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY)

        if (decoded.role === 'user') {
            return res.status(403).json({ message: 'Доступ запрещён: недостаточно прав' })
        }

        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Неверный токен' })
    }
}

// 🔐 Полная защита любого запроса — только для авторизованных и не 'user'
export const protectStrict = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Нет токена' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY)

        if (decoded.role === 'user') {
            return res.status(403).json({ message: 'Доступ запрещён: недостаточно прав' })
        }

        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Неверный токен' })
    }
}
