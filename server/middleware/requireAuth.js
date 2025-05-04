import jwt from 'jsonwebtoken'

export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Нет токена' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Неверный токен' })
    }
}
