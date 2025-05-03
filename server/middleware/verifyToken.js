import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization
        if (!authHeader) return res.status(401).json({ error: 'Нет токена' })

        const token = authHeader.split(' ')[1]
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
            req.user = decoded

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ error: 'Нет прав доступа' })
            }

            next()
        } catch (err) {
            return res.status(401).json({ error: 'Невалидный токен' })
        }
    }
}
