import express from 'express';
import dotenv from 'dotenv';
import addressesRouter from './routes/addresses.js';
import dvrRoutes from './routes/dvr.js';

import cors from 'cors';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// Роут для адресов
app.use('/api/addresses', addressesRouter);
app.use('/api/dvr', dvrRoutes);

// Запуск сервера
const PORT = process.env.PORT || 3000;
console.log(`🚀 PORT .ENV :${process.env.PORT}`);
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
