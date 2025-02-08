import { loading } from "./loading.js";

async function api() {
    loading(true, 'Sincronizando dados', 'Aguarde...');
    try {
        const response = await fetch('https://loteriascaixa-api.herokuapp.com/api/megasena/');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        loading(false);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        loading(true, 'Manutenção', 'Falha ao sincronizar dados. Tente novamente mais tarde.');
        return [];
    }
}

export default api;