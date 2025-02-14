import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const app = express();
const backupFile = path.join(__dirname, 'backup.json');
const port = 3001;

const allowedOrigins = [
    'https://danmazzeu.github.io',
    'https://megalumni.com.br',
    'https://www.megalumni.com.br',
    'http://localhost'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://loteriascaixa-api.herokuapp.com/api/megasena');
        fs.writeFileSync(backupFile, JSON.stringify(response.data), 'utf8');
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
    
        if (fs.existsSync(backupFile)) {
            const backupData = fs.readFileSync(backupFile, 'utf8');
            res.json(JSON.parse(backupData));
        } else {
            res.status(500).json({ error: 'Erro ao buscar dados da API e não há backup disponível' });
        }
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});