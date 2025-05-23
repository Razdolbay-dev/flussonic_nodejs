// routes/flussonic.js
import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.get('/auth', (req, res) => {
    const { token } = req.query

    if (!token) {
        return res.status(403).send('Missing token')
    }

    try {
        jwt.verify(token, process.env.TOKEN_SECRET_KEY)
        return res.sendStatus(200) // пользователь авторизован
    } catch (err) {
        console.error('[Flussonic auth] Invalid token:', err.message)
        return res.sendStatus(403) // токен недействителен
    }
})

export default router
