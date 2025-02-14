import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs'; // Importando fs
import path from 'path'; // Importando path

const app = express();
const backupFile = path.join(__dirname, 'backup.json');
const port = process.env.PORT || 3000; // Usando variável de ambiente para a porta

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
        
        // Se a API der certo, salva os dados no backup.json
        fs.writeFileSync(backupFile, JSON.stringify(response.data), 'utf8');
        
        // Envia a resposta com os dados da API
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        
        // Caso dê erro, verifica se existe o backup.json
        if (fs.existsSync(backupFile)) {
            const backupData = fs.readFileSync(backupFile, 'utf8');
            res.json(JSON.parse(backupData));
        } else {
            // Se não houver backup e falhar a API, retorna um erro mais claro
            res.status(500).json({ error: 'Erro ao buscar dados da API e não há backup disponível' });
        }
    }
});


app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});
