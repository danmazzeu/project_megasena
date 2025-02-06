import analyzeMegaSenaData from './repository.js';

async function useMegaSenaData() {
    const datas = await analyzeMegaSenaData();

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    if (datas) {
        console.log("Results from other file", datas);
        console.log("Current Contest:", datas.currentContest);
        console.log("Strong Zones:", datas.strongZones);
        console.log("All Contests:", datas.allContests);

        const lastNumbers = document.getElementById('last-numbers');
        lastNumbers.innerHTML = '';

        datas.currentContest.dezenas.forEach((numero, index) => {
            const div = document.createElement('div');
            div.classList.add('number');
            div.innerHTML = `<h2>${numero}</h2><p>Posição: ${index + 1}</p>`;
            lastNumbers.appendChild(div);
        });

        const lastInfo = document.getElementById('last-info');
        lastInfo.innerHTML = '';

        const info = {
            'Concurso': datas.currentContest.concurso,
            'Data': datas.currentContest.data || "Não informado",
            'Local do sorteio': datas.currentContest.local ? datas.currentContest.local.toLowerCase().replace(/\b\w/i, l => l.toUpperCase()) : "Não informado",
            'Data próximo concurso': datas.currentContest.dataProximoConcurso || "Não informado",
            'Ganhadores 4 números': datas.currentContest.premiacoes && datas.currentContest.premiacoes[2] ? datas.currentContest.premiacoes[2].ganhadores : "Não informado",
            'Ganhadores 5 números': datas.currentContest.premiacoes && datas.currentContest.premiacoes[1] ? datas.currentContest.premiacoes[1].ganhadores : "Não informado",
            'Ganhadores 6 números': datas.currentContest.premiacoes && datas.currentContest.premiacoes[0] ? datas.currentContest.premiacoes[0].ganhadores : "Não informado",
            'Premiação 4 números': datas.currentContest.premiacoes && datas.currentContest.premiacoes[2] ? formatCurrency(datas.currentContest.premiacoes[2].valorPremio) : "Não informado",
            'Premiação 5 números': datas.currentContest.premiacoes && datas.currentContest.premiacoes[1] ? formatCurrency(datas.currentContest.premiacoes[1].valorPremio) : "Não informado",
            'Premiação 6 números': datas.currentContest.premiacoes && datas.currentContest.premiacoes[0] ? formatCurrency(datas.currentContest.premiacoes[0].valorPremio) : "Não informado",
            'Premiação estimada próximo concurso': formatCurrency(datas.currentContest.valorEstimadoProximoConcurso),
            'Valor arrecadado': formatCurrency(datas.currentContest.valorArrecadado),
            'Acumulou': datas.currentContest.acumulou ? 'Sim' : 'Não'
        };

        for (const key in info) {
            const listItem = document.createElement('li');
            let value = info[key];

            listItem.innerHTML = `<strong>${key}:</strong> ${value}`;
            lastInfo.appendChild(listItem);
        }

        // FA & FR
        const frequenciesContainer = document.querySelector('#all-frequencies');
        frequenciesContainer.innerHTML = '';
        const frequencies1to60 = datas.allFrequencies.filter(item => parseInt(item.number) >= 1 && parseInt(item.number) <= 60);

        const groupedFrequencies = {};
        frequencies1to60.forEach(frequency => {
            const number = frequency.number;
            if (!groupedFrequencies[number]) {
                groupedFrequencies[number] = {
                    absoluteFrequency: 0,
                    relativeFrequency: 0,
                    number: number
                };
            }
            groupedFrequencies[number].absoluteFrequency += frequency.absoluteFrequency;
            groupedFrequencies[number].relativeFrequency += frequency.relativeFrequency;
        });

        const uniqueFrequencies = Object.values(groupedFrequencies);
        uniqueFrequencies.sort((a, b) => parseInt(a.number) - parseInt(b.number));

        uniqueFrequencies.forEach(frequency => {
            const numberDiv = document.createElement('div');
            numberDiv.classList.add('number');

            numberDiv.innerHTML = `
                <h2>${frequency.number}</h2>
                <p><strong>FA:</strong> ${frequency.absoluteFrequency}</p>
                <p><strong>FR:</strong> ${frequency.relativeFrequency.toFixed(2)}%</p> 
            `;

            frequenciesContainer.appendChild(numberDiv);
        });

        const numberOfElements = frequenciesContainer.children.length;
        for (let i = numberOfElements; i < 60; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('number');
            emptyDiv.innerHTML = `
            <h2>-</h2>
            <p><strong>FA:</strong>-</p>
            <p><strong>FR:</strong>-%</p>
            `;
            frequenciesContainer.appendChild(emptyDiv);
        }

        // Strong Zones
        const strongZonesList = document.getElementById('strong-zones');
        strongZonesList.innerHTML = '';

        datas.strongZones.forEach((zf, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<b>Posição ${index + 1}:</b> ${zf.join(', ')}`;
            strongZonesList.appendChild(listItem);
        });

        // Winners Interval
        const winnersIntervalList = document.getElementById('winners-interval');
        winnersIntervalList.innerHTML = '';

        if (datas && datas.averageSpacing) {
            for (const key in datas.averageSpacing) {
                const item = datas.averageSpacing[key];
                const listItem = document.createElement('li');

                if (item && item.average) {
                    if (item.average == 1) {
                        listItem.innerHTML = `<strong>${key}:</strong> Todos os concursos.<br><strong>Vencedores:</strong> ${item.winners}`;
                    } else {
                        listItem.innerHTML = `<strong>${key}:</strong> Intervalo médio de ${item.average} concurso(s).<br><strong>Vencedores:</strong> ${item.winners}`;
                    }
                    winnersIntervalList.appendChild(listItem);
                } else {
                    console.warn(`Dados ausentes para ${key}`);
                    listItem.innerHTML = `<strong>${key}:</strong> Dados não disponíveis`;
                    winnersIntervalList.appendChild(listItem);
                }
            }
        } else {
            console.warn("datas ou datas.allWinners não definidos.");
            const listItem = document.createElement('li');
            listItem.innerHTML = "Dados não disponíveis";
            winnersIntervalList.appendChild(listItem);
        }

        // Sequence Consult
        const sequenceform = document.querySelector('#sequence-consult-form');
        const sequenceInput = document.querySelector('#sequence-consult-input');
        const sequenceErrorDiv = document.querySelector('#sequence-consult-error');

        sequenceInput.addEventListener('input', () => {
            errorDiv.style.display = 'none';
        });

        sequenceform.addEventListener('submit', (event) => {
            event.preventDefault();

            const sequence = sequenceInput.value;
            if (!/^\d{2}, \d{2}, \d{2}, \d{2}, \d{2}, \d{2}$/.test(sequence)) {
                displayResult('Formato inválido. Use o formato: 00, 00, 00, 00, 00, 00.', 'fail');
                return;
            }

            const numbers = sequence.split(', ').map(Number);
            if (hasDuplicates(numbers)) {
                displayResult('Números repetidos não são permitidos.', 'fail');
                return;
            }

            if (!areNumbersInRange(numbers)) {
                displayResult('Os números devem estar entre 01 e 60.', 'fail');
                return;
            }

            sequenceErrorDiv.style.display = 'none';

            let found = false;
            for (const dozens in datas.allDozens) {
                const numbersInDozens = datas.allDozens[dozens].map(Number);
                if (numbersInDozens.length === numbers.length && numbersInDozens.every((value, index) => value === numbers[index])) {
                    found = true;
                    break;
                }
            }

            if (found) {
                displayResult('A sequência já foi sorteada!', 'fail');
            } else {
                displayResult('A sequência nunca foi sorteada.', 'success');
            }

            function hasDuplicates(arr) {
                return new Set(arr).size !== arr.length;
            }
    
            function areNumbersInRange(arr) {
                return arr.every(num => num >= 1 && num <= 60);
            }
    
            function displayResult(message, className) {
                sequenceErrorDiv.style.display = 'flex';
                sequenceErrorDiv.querySelector('p').textContent = message;
                sequenceErrorDiv.classList.remove('fail', 'success');
                sequenceErrorDiv.classList.add(className);
            }
        });
        
        // Contest Consult
        const contestConsultForm = document.getElementById('contest-consult-form');
        const contestConsultInput = document.getElementById('contest-consult-input');
        const contestConsultResult = document.getElementById('contest-consult-result');
        const contestConsultError = document.getElementById('contest-consult-error');
        const contestConsultErrorText = contestConsultError.querySelector('p');
        contestConsultResult.style.display = 'none';

        contestConsultInput.addEventListener('input', function(event) {
            contestConsultResult.style.display = 'none';
            contestConsultError.style.display = 'none';
            contestConsultResult.innerHTML = '';
        });

        contestConsultForm.addEventListener('submit', function(event) {
            event.preventDefault();
            contestConsultResult.style.display = 'flex';
            contestConsultResult.innerHTML = '';

            const contestNumber = contestConsultInput.value.trim();

            if (contestNumber === '') {
                showError('Por favor, insira um número de concurso.', 'fail');
                contestConsultResult.style.display = 'none';
                return;
            }

            const contestData = datas.allContests.find(contest => contest.concurso === parseInt(contestNumber));

            if (!contestData) {
                showError('Concurso não encontrado.', 'fail');
                contestConsultResult.style.display = 'none';
                return;
            }

            showError('Concurso encontrado!', 'success');

            const info = {
                'Concurso': contestData.concurso,
                'Data': contestData.data || "Não informado",
                'Local do sorteio': contestData.local ? contestData.local.toLowerCase().replace(/\b\w/i, l => l.toUpperCase()) : "Não informado",
                'Data próximo concurso': contestData.dataProximoConcurso || "Não informado",
                'Dezenas sorteadas': contestData.dezenas.join(', ') || "Não informado",
                'Ganhadores 4 números': contestData.premiacoes && contestData.premiacoes[2] ? contestData.premiacoes[2].ganhadores : "Não informado",
                'Ganhadores 5 números': contestData.premiacoes && contestData.premiacoes[1] ? contestData.premiacoes[1].ganhadores : "Não informado",
                'Ganhadores 6 números': contestData.premiacoes && contestData.premiacoes[0] ? contestData.premiacoes[0].ganhadores : "Não informado",
                'Premiação 4 números': contestData.premiacoes && contestData.premiacoes[2] ? formatCurrency(contestData.premiacoes[2].valorPremio) : "Não informado",
                'Premiação 5 números': contestData.premiacoes && contestData.premiacoes[1] ? formatCurrency(contestData.premiacoes[1].valorPremio) : "Não informado",
                'Premiação 6 números': contestData.premiacoes && contestData.premiacoes[0] ? formatCurrency(contestData.premiacoes[0].valorPremio) : "Não informado",
                'Premiação estimada próximo concurso': formatCurrency(contestData.valorEstimadoProximoConcurso),
                'Valor arrecadado': formatCurrency(contestData.valorArrecadado),
                'Acumulou': contestData.acumulou ? 'Sim' : 'Não'
            };

            for (const key in info) {
                createListItem(contestConsultResult, `<strong>${key}:</strong> ${info[key]}`);
            }

            function createListItem(parent, content) {
                const listItem = document.createElement('li');
                listItem.innerHTML = content;
                parent.appendChild(listItem);
            }

            function showError(message, type) {
                contestConsultErrorText.textContent = message;
                contestConsultError.style.display = 'flex';
                contestConsultError.classList.remove('fail', 'success');
                contestConsultError.classList.add(type);
            }

            function formatCurrency(value) {
                if (value === null || value === undefined) return "Não informado";
                return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
            }
        });
        
        // Contests Interval Consult
        
    }
}

useMegaSenaData();