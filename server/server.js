import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import addressesRouter from './routes/addresses.js';
import dvrRoutes from './routes/dvr.js';
import usersRouter from './routes/users.js';
import clientsTmpRouter from "./routes/clientsTmp.js";
import webcamsRouter from './routes/webcams.js';
import authRouter from './routes/auth.js';

const app = express();
dotenv.config();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Роут для адресов
app.use('/api/auth', authRouter);
app.use('/api/addresses', addressesRouter);
app.use('/api/dvr', dvrRoutes);
app.use('/api/users', usersRouter);
app.use('/api/clients_tmp', clientsTmpRouter);
app.use('/api/webcams', webcamsRouter);

// Запуск сервера
const PORT = process.env.PORT || 3000;
console.log(`🚀 PORT .ENV :${process.env.PORT}`);
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
