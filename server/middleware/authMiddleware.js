import jwt from 'jsonwebtoken'

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

        // Блокируем доступ, если роль — user
        if (decoded.role === 'user') {
            return res.status(403).json({ message: 'Доступ запрещён: недостаточно прав' })
        }

        // При необходимости можешь сохранить decoded в req.user
        req.user = decoded

        next()
    } catch (err) {
        return res.status(401).json({ message: 'Неверный токен' })
    }
}

