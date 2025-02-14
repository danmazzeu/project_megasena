import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs/promises';

const app = express();
const port = 3001;

const allowedOrigins = [
    'https://danmazzeu.github.io',
    'https://megalumni.com.br',
    'https://www.megalumni.com.br',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5500'
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

        if (response.status === 200 && response.data) {
            try {
                await fs.writeFile('backup.json', JSON.stringify(response.data, null, 2));
                console.log("Backup file updated successfully.");
            } catch (fileError) {
                console.error('Error saving to file:', fileError);
                res.json(response.data);
                return;
            }
            res.json(response.data);
        } else {
            console.error("Mega Sena API returned unexpected response:", response.status, response.data);
            try {
                const backupData = await fs.readFile('backup.json', 'utf8');
                res.json(JSON.parse(backupData));
            } catch (backupError) {
                console.error("Error reading backup file:", backupError);
                res.status(500).json({ error: 'Error fetching data from API and backup' });
            }
        }

    } catch (error) {
        console.error("Proxy Server Error:", error);
        if (error.response) {
            console.error("Mega Sena API Error:", error.response.status, error.response.data);
        }

        try {
            const backupData = await fs.readFile('backup.json', 'utf8');
            res.json(JSON.parse(backupData));
        } catch (backupError) {
            console.error("Error reading backup file:", backupError);
            res.status(500).json({ error: 'Error fetching data from API and backup' });
        }
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});