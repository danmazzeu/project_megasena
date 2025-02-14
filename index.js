import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { promises as fs } from 'fs'; // Importando fs.promises
import path from 'path';

const app = express();
const backupFile = path.join(__dirname, 'backup.json');
const port = process.env.PORT || 3000;

const allowedOrigins = [
    'https://danmazzeu.github.io',
    'https://megalumni.com.br',
    'https://www.megalumni.com.br',
    'http://localhost:3000'
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
        
        // Escrever o backup de forma assíncrona
        await fs.writeFile(backupFile, JSON.stringify(response.data), 'utf8');
        
        // Envia os dados da API
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);

        try {
            // Verifica se existe o arquivo de backup
            await fs.access(backupFile);

            // Lê os dados do backup de forma assíncrona
            const backupData = await fs.readFile(backupFile, 'utf8');
            res.json(JSON.parse(backupData));
        } catch (readError) {
            // Se não houver backup e falhar a API, retorna erro
            res.status(500).json({ error: 'Erro ao buscar dados da API e não há backup disponível' });
        }
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});
