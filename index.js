import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = 3001;

app.use(cors());

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://lotasda-api.herokuapp.com/api/megasena');
        res.json(response.data);
    } catch (error) {
        console.error("Proxy Server Error:", error);
        fs.readFile('backup.json', 'utf8', (err, data) => {
            const backupData = JSON.parse(data);
            console.log('bateu aqui');
            res.json(backupData);
        });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});