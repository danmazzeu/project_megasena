const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

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
        
        fs.readFile(path.join(__dirname, 'backup.json'), 'utf8', (err, data) => {
            if (err) {
                console.error("Error reading backup file:", err);
                return res.status(500).json({ error: 'Error fetching data from API and backup' });
            }
            
            try {
                const backupData = JSON.parse(data);
                res.json(backupData);
            } catch (parseError) {
                console.error("Error parsing backup file:", parseError);
                res.status(500).json({ error: 'Error parsing backup data' });
            }
        });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});