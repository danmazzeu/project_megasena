import { loading } from "./loading.js";

async function api() {
    loading(true, 'Sincronizando dados', 'Aguarde enquanto analisamos todos os dados dos concursos, para gerar todas as estatísticas e dados desta página.');
    try {
        const response = await fetch('https://loteriascaixa-api.herokuapp.com/api/megasena/');
        if (!response.ok) {
          const errorText = await response.text(); // Try to get error details from the API
          throw new Error(`API returned ${response.status}: ${errorText || 'Error fetching data'}`);
        }
        const data = await response.json();
        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Erro ao buscar dados' }); // Send more specific error message
      }
}

export default api;