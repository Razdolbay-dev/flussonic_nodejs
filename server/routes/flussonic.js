// routes/flussonic.js
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/flussonic-auth', (req, res) => {
    const { token, uri } = req.body;

    if (!token) {
        return res.status(403).send('Missing token');
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        const allowedPaths = decoded.paths || [];

        if (!allowedPaths.includes(uri)) {
            return res.status(403).send('Path not allowed');
        }

        return res.status(200).send('OK');
    } catch (err) {
        console.error('[Flussonic auth] Invalid token:', err.message);
        return res.status(403).send('Invalid token');
    }
});

export default router;
