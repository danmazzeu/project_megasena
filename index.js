import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = 3001;

const allowedOrigins = [
    'https://danmazzeu.github.io',
    'http://localhost:3000', // Corrected port if your frontend runs on 3000
    'http://localhost:3001' // Added this back in case you want to test from the same port.
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

// REMOVE this line.  You already have the CORS configuration above.
// app.use(cors());  <-- This line is redundant and can cause issues.

app.get('/', async (req, res) => {
    try {
        const response = await fetch('https://loteriascaixa-api.herokuapp.com/api/megasena');
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Mega Sena API Error:", response.status, errorText);
            // More informative error message for the client
            throw new Error(`Mega Sena API returned ${response.status}: ${errorText}`);  
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Proxy Server Error:", error);
        res.status(500).json({ error: 'Error fetching data from API' }); // Improved message
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});