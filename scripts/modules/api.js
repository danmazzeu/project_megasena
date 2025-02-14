import { loading } from "./loading.js";

async function api() {
    loading(true, 'Sincronizando dados', 'Aguarde...');
    try {
        const response = await fetch('https://projectmegasena-production.up.railway.app/');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        loading(false);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        loading(true, 'Manutenção', 'Servidor temporariamente em manutenção. Tente novamente mais tarde.');
        return [];
    }
}

// Função para salvar os dados como um arquivo JSON
function saveBackup(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup_api.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Função para detectar o atalho Ctrl + C + B
function detectCtrlCB(event) {
    if (event.ctrlKey && event.key === 'b') {
        event.preventDefault(); // Evitar o comportamento padrão
        api().then((data) => {
            saveBackup(data);
        });
    }
}

// Adicionando o ouvinte para o evento de tecla
document.addEventListener('keydown', detectCtrlCB);
