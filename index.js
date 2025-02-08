import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs/promises';

const app = express();
const port = 3001;

const allowedOrigins = [
    'https://danmazzeu.github.io',
    'https://megalumni.com.br',
    'https://www.megalumni.com.br',
    'http://localhost:3000',
    'http://localhost:3001'
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
        let data;

        try {
            const response = await fetch('https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena');
            if (!response.ok) {
                throw new Error(`Mega Sena API returned ${response.status}: ${await response.text()}`);
            }
            data = await response.json();

            try {
                await fs.writeFile('backup.json', JSON.stringify(data, null, 2));
                console.log('Data saved to backup.json');
            } catch (fileError) {
                console.error('Error saving to file:', fileError);
            }

        } catch (apiError) {
            console.error("Mega Sena API Error:", apiError);
            try {
                const backupData = await fs.readFile('backup.json', 'utf8');
                data = JSON.parse(backupData);
                console.log('Data retrieved from backup.json');
            } catch (backupError) {
                console.error('Error reading from backup.json:', backupError);
                res.status(500).json({ error: 'Failed to fetch data from API and backup' });
                return;
            }
        }

        res.json(data);

    } catch (error) {
        console.error("General Server Error:", error);
        res.status(500).json({ error: 'A general server error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});