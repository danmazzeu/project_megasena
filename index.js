import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = 3001;

app.use(cors());

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://loteriascaixa-api.herokuapp.com/api/megasena');
        res.json(response.data);
    } catch (error) {
        console.error("Proxy Server Error:", error);
        if (error.response) {
            console.error("Mega Sena API Error:", error.response.status, error.response.data);
        }
        res.status(500).json({ error: 'Error fetching data from API' });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});