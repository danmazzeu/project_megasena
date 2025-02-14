const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitando CORS
const allowedOrigins = [
    'https://danmazzeu.github.io',
    'https://megalumni.com.br',
    'https://www.megalumni.com.br',
    'http://localhost'
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

// Caminho do arquivo de backup
const backupFilePath = path.join(__dirname, 'backup.json');

// Função para ler o arquivo de backup
function readBackup() {
    try {
        if (fs.existsSync(backupFilePath)) {
            const data = fs.readFileSync(backupFilePath, 'utf8');
            return JSON.parse(data);
        }
        return null; // Retorna null se o arquivo não existir
    } catch (error) {
        console.error("Erro ao ler o backup:", error);
        return null;
    }
}

// Função para salvar os dados no backup.json
function saveBackup(data) {
    try {
        fs.writeFileSync(backupFilePath, JSON.stringify(data, null, 2), 'utf8');
        console.log('Backup salvo com sucesso!');
    } catch (error) {
        console.error("Erro ao salvar o backup:", error);
    }
}

// Rota principal
app.get('/', async (req, res) => {
    try {
        // Tenta buscar os dados da API
        const response = await axios.get('https://loteriascaixa-api.herokuapp.com/api/megasena');
        const data = response.data;

        // Se os dados foram recebidos com sucesso, cria ou atualiza o arquivo de backup
        saveBackup(data);

        res.json(data); // Retorna os dados para o cliente
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        
        // Se a API falhar, tenta carregar os dados do backup
        const backupData = readBackup();
        
        if (backupData) {
            console.log('Dados carregados do backup.');
            res.json(backupData); // Retorna os dados do backup
        } else {
            res.status(500).json({ error: 'Erro ao buscar dados e não há backup disponível.' });
        }
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
