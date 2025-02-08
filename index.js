import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = 3001;

const allowedOrigins = [
    'https://danmazzeu.github.io',
    'http://localhost:3001',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}));

app.use(cors());

app.get('/api/megasena', async (req, res) => { // Correct route: /api/megasena
    try {
        const response = await fetch('https://loteriascaixa-api.herokuapp.com/api/megasena/'); // Correct API URL
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Mega Sena API Error:", response.status, errorText);
            throw new Error(`Mega Sena API returned ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Proxy Server Error:", error);
        res.status(500).json({ error: 'Erro ao obter dados da API' });
    }
});

app.listen(port, () => {
    console.log(`Servidor proxy rodando na porta ${port}`);
});