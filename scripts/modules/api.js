import { loading } from "./loading.js";
import fs from 'fs';  // Importa o módulo fs do Node.js

// Função para salvar dados no backup.json
function saveBackup(data) {
    try {
        fs.writeFileSync('backup.json', JSON.stringify(data), 'utf8');
        console.log('Backup salvo com sucesso!');
    } catch (error) {
        console.error("Erro ao salvar o backup:", error);
    }
}

// Função para carregar os dados do backup.json
function loadBackup() {
    try {
        const data = fs.readFileSync('backup.json', 'utf8');
        return JSON.parse(data);  // Converte o conteúdo do arquivo JSON para um objeto
    } catch (error) {
        console.error("Erro ao carregar o backup:", error);
        return [];
    }
}

async function api() {
    loading(true, 'Sincronizando dados', 'Aguarde...');
    try {
        const response = await fetch('https://projectmegasena-production.up.railway.app/');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }
        const data = await response.json();

        // Salva o backup localmente após sucesso na API
        saveBackup(data);

        loading(false);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        loading(true, 'Manutenção', 'Servidor temporariamente em manutenção. Tente novamente mais tarde.');

        // Tenta carregar os dados do backup, caso a API falhe
        const backupData = loadBackup();
        return backupData;
    }
}

export default api;
