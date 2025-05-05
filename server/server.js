import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { protectNonGetRequests } from './middleware/authMiddleware.js';

import addressesRouter from './routes/addresses.js';
import dvrRoutes from './routes/dvr.js';
import usersRouter from './routes/users.js';
import clientsTmpRouter from "./routes/clientsTmp.js";
import webcamsRouter from './routes/webcams.js';
import authRouter from './routes/auth.js';
import flussonicRouter from './routes/flussonic.js';
import settingsRouter from './routes/settings.js';

const app = express();
dotenv.config();

app.use(cors({ origin: '*' }));
app.use(express.json());

// 🚫 Не защищаем login/registration
app.use('/api/auth', authRouter);
app.use('/api/flussonic', flussonicRouter); // 👈 Flussonic должен иметь доступ без авторизации

// ❗️ Middleware авторизации для всех, кроме auth
app.use(protectNonGetRequests);

// ✅ Защищённые маршруты
app.use('/api/addresses', addressesRouter);
app.use('/api/dvr', dvrRoutes);
app.use('/api/users', usersRouter);
app.use('/api/clients_tmp', clientsTmpRouter);
app.use('/api/webcams', webcamsRouter);
app.use('/api/settings', settingsRouter);

// Запуск
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
