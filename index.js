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
        const response = await fetch('https://loteriascaixa-api.herokuapp.com/api/megasena');
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Mega Sena API Error:", response.status, errorText);
            throw new Error(`Mega Sena API returned ${response.status}: ${errorText}`);  
        }
        const data = await response.json();
        
        try {
            await fs.writeFile('backup.json', JSON.stringify(data, null, 2));   
        } catch (fileError) {
            console.error('Error saving to file:', fileError);
             res.status(500).json({ error: 'Error saving data to file' });
            return;
        }

        res.json(data);

    } catch (error) {
        console.error("Proxy Server Error:", error);
        res.status(500).json({ error: 'Error fetching data from API' });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});