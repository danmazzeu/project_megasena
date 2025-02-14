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

// To create Backup Press on CTRL + C + B
function saveBackup(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function detectCtrlCB(event) {
    if (event.ctrlKey && event.key === 'b') {
        event.preventDefault();
        api().then((data) => {
            saveBackup(data);
        });
    }
}

document.addEventListener('keydown', detectCtrlCB);

export default api;