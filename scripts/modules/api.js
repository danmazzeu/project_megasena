import { loading } from "./loading.js";
import fs from './fs/promises';

async function api() {
    loading(true, 'Sincronizando dados', 'Aguarde...');
    try {
        const response = await fetch('https://projectmegasena-production.up.railway.app/');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }
        const data = await response.json();

        try {
            await fs.writeFile('backup.json', JSON.stringify(data, null, 2), { flag: 'w' });
            console.log("Backup atualizado com sucesso.");
        } catch (error) {
            console.error("Erro ao salvar o backup:", error);
        }

        loading(false);
        return data;
    } catch (error) {
        console.error("Erro ao buscar dados:", error);

        try {
            const backupData = await fs.readFile('backup.json', 'utf8');
            console.log("Dados carregados do backup.");
            loading(false);
            return JSON.parse(backupData);
        } catch (backupError) {
            console.error("Erro ao ler o arquivo de backup:", backupError);
            loading(true, 'Manutenção', 'Servidor temporariamente em manutenção. Tente novamente mais tarde.');
            return [];
        }
    }
}

export default api;