import { loading } from "./loading.js";

async function api() {
    loading(true, 'Sincronizando dados', 'Aguarde enquanto analisamos todos os dados dos concursos, para gerar todas as estatísticas e dados desta página.');
    try {
        const response = await fetch('https://loteriascaixa-api.herokuapp.com/api/megasena/');
        const data = await response.json();
        const allData = data.map(contest => ({ ...contest }));
        console.log(data);
        loading(false);
        return allData;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default api;