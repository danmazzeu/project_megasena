import { feedAllSelect } from './select.js';
import { feedAllNumber } from './number.js';

let apiBaseURL = 'https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/';
let lastContest;
let allContestsData = [];

function fadeInOut(status) {
    if (status == true) {
        document.querySelector(".loading").classList.add("loading-show");
        document.body.style.overflow = "hidden";
        const elementsToHide = document.querySelectorAll('header, main, footer'); 
            elementsToHide.forEach(element => {
            element.style.display = 'none';
        });
    } else {
        document.querySelector(".loading").classList.remove("loading-show");
        document.body.style.overflow = "auto";
        const elementsToHide = document.querySelectorAll('header, main, footer'); 
            elementsToHide.forEach(element => {
            element.style.display = 'flex';
        });
    }
} fadeInOut(true);

function setupProgressbar(currentContest, totalContests) {
    const progressbar = document.querySelector(".loading-percent");
    const progressbarDetails = document.querySelector(".loading > span");
    const percentage = Math.round((currentContest / totalContests) * 100);

    progressbar.style.width = `${percentage}%`;
    progressbarDetails.textContent = `${percentage} %`;
}

async function getLastContest() {
    try {
        const response = await fetch(apiBaseURL);
        const data = await response.json();
        lastContest = data.numero;
    } catch (error) {
        return;
    }
}

async function getContestData(contestNumber) {
    try {
        const response = await fetch(apiBaseURL + contestNumber);
        const data = await response.json();

        const relevantData = {
            numero: data.numero,
            dataApuracao: data.dataApuracao,
            listaDezenas: data.listaDezenas,
            listaRateioPremio: data.listaRateioPremio,
            listaMunicipioUFGanhadores: data.listaMunicipioUFGanhadores,
            localSorteio: data.localSorteio,
            nomeMunicipioUFSorteio: data.nomeMunicipioUFSorteio,
            valorEstimadoProximoConcurso: data.valorEstimadoProximoConcurso,
            valorArrecadado: data.valorArrecadado
        };

        setupProgressbar(data.numero, lastContest);
        return relevantData;
    } catch (error) {
        return;
    }
}

async function getAllContestsData() {
    const today = new Date().toISOString().slice(0, 10);
    const lastUpdated = localStorage.getItem('megalumni_updated');

    try {
        const storedData = localStorage.getItem('megalumni_backup');
        const parsedData = JSON.parse(storedData);

        if (parsedData.length > 0 && lastUpdated === today && storedData !== null) {
            const lastStoredContest = parsedData[parsedData.length - 1].numero;

            if (lastStoredContest === lastContest) {
                allContestsData = parsedData;
                feedAllSelect();
                feedAllNumber();
                fadeInOut(false);
                return;
            }
        } else {
            fadeInOut(true);
            document.querySelector('.loading > p').innerHTML = 'Falha ao sincronizar dados.<br>Aguarde um pouco e atualize a página.';
            document.querySelector('.loading > .player').style.display = 'none';
            localStorage.removeItem('megalumni_backup');
            localStorage.removeItem('megalumni_updated');
            return;
        }
    } catch (error) {
        fadeInOut(true);
        localStorage.removeItem('megalumni_backup');
        localStorage.removeItem('megalumni_updated');
    }

    fadeInOut(true);

    for (let i = 1; i <= lastContest; i++) {
        const contestData = await getContestData(i);
        if (contestData) {
            allContestsData.push(contestData);
        } else {
            fadeInOut(true);
            window.location.href = '.';
        }
    }

    localStorage.setItem('megalumni_backup', JSON.stringify(allContestsData));
    localStorage.setItem('megalumni_updated', today);

    feedAllSelect();
    feedAllNumber();
    fadeInOut(false);
}

getLastContest()
    .then(() => getAllContestsData())
    .catch(error => console.error('Error:', error));