import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs/promises';

const app = express();
const port = 3001;

app.use(cors());

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://lotasda-api.herokuapp.com/api/megasena');
        res.json(response.data);
    } catch (error) {
        console.error("Proxy Server Error:", error);
        
        try {
            const data = await fs.readFile('backup.json', 'utf8');
            const backupData = JSON.parse(data);
            console.log('Backup data loaded successfully');
            res.json(backupData);
        } catch (readError) {
            console.error("Error reading or parsing backup file:", readError);
            res.status(500).json({ message: "Unable to fetch data from both the API and the backup." });
        }
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});