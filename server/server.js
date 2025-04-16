// server/server.js
import express from 'express'
import cors from 'cors'

const app = express()

// Разрешаем запросы с фронтенда (localhost:5173)
app.use(cors({
    origin: 'http://localhost:5173',  // Фронтенд-адрес
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Разрешаем HTTP-методы
    allowedHeaders: ['Content-Type', 'Authorization'],  // Разрешаем нужные заголовки
}))

app.get('/api/me', (req, res) => {
    res.json({ message: 'Пользователь', user: req.user })
})

app.listen(5000, () => {
    console.log('Сервер работает на http://localhost:5000')
})
