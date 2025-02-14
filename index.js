import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs/promises';

const app = express();
const port = 3001;

app.use(cors());

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://lotapp.com/api/megasena');
        res.json(response.data);
    } catch (error) {
        console.error("Proxy Server Error:", error);
        
        try {
            const data = await fs.readFile('backup.json', 'utf8');
            const backupData = JSON.parse(data);
            res.json(backupData);
        } catch (readError) {
            res.status(500).json({ message: "Unable to fetch data from both the API and the backup." });
        }
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});