import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import addressesRouter from './routes/addresses.js';
import dvrRoutes from './routes/dvr.js';
import usersRouter from './routes/users.js';
import clientsTmpRouter from "./routes/clientsTmp.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// Роут для адресов
app.use('/api/addresses', addressesRouter);
app.use('/api/dvr', dvrRoutes);
app.use('/api/users', usersRouter);
app.use('/api/clients_tmp', clientsTmpRouter);

// Запуск сервера
const PORT = process.env.PORT || 3000;
console.log(`🚀 PORT .ENV :${process.env.PORT}`);
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
