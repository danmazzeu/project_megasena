const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurando CORS para permitir localhost e o domínio de produção
const allowedOrigins = ['https://megalumni.com.br', 'http://localhost:3000'];

app.use(cors({
    origin: function(origin, callback) {
        // Permite origens que estão na lista de origens permitidas
        if (allowedOrigins.includes(origin) || !origin) {  // O !origin permite requisições feitas diretamente, como o Postman
            callback(null, true);
        } else {
            callback(new Error('Origin not allowed by CORS'));
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
        // Fazendo a requisição para a API externa
        const response = await axios.get('https://projectmegasena-production.up.railway.app/');
        const data = response.data;

        // Salva os dados no arquivo de backup
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
    console.log(`Servidor rodando na porta ${PORT}`);
});
