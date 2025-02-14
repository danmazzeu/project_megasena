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

        // Backup to JSON file
        try {
            const jsonData = JSON.stringify(data, null, 2); // Use null, 2 for pretty printing
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'megasena_backup.json'; // Choose your filename
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log("Data backed up successfully!");
        } catch (backupError) {
            console.error("Error backing up data:", backupError);
            // Consider displaying a message to the user about the backup failure.
        }


        loading(false);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        loading(true, 'Manutenção', 'Servidor temporariamente em manutenção. Tente novamente mais tarde.');
        return [];
    }
}

export default api;