import analyzeMegaSenaData from './repository.js';

async function useMegaSenaData() {
    const datas = await analyzeMegaSenaData();

    if (datas) {
        console.log("Results from other file", datas);
        console.log("Current Contest:", datas.currentContest);
        console.log("Strong Zones:", datas.strongZones);

        // Last Contest
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
            'Ganhadores 4 números': datas.currentContest.premiacoes[2].ganhadores,
            'Ganhadores 5 números': datas.currentContest.premiacoes[1].ganhadores,
            'Ganhadores 6 números': datas.currentContest.premiacoes[0].ganhadores,
            'Premiação 4 números': datas.currentContest.premiacoes[2].valorPremio,
            'Premiação 5 números': datas.currentContest.premiacoes[1].valorPremio,
            'Premiação 6 números': datas.currentContest.premiacoes[0].valorPremio,
            'Locais Ganhadores': datas.currentContest.localGanhadores,
            'Valor arrecadado próximo concurso': datas.currentContest.valorArrecadado
        };

        function formatCurrency(value) {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
        }

        info['Premiação 4 números'] = formatCurrency(info['Premiação 4 números']);
        info['Premiação 5 números'] = formatCurrency(info['Premiação 5 números']);
        info['Premiação 6 números'] = formatCurrency(info['Premiação 6 números']);
        info['Valor arrecadado próximo concurso'] = formatCurrency(info['Valor arrecadado próximo concurso']);

        let locaisGanhadores = info['Locais Ganhadores'];
        let locaisGanhadoresText = "";
        if (locaisGanhadores && locaisGanhadores.length > 0) {
            locaisGanhadores.forEach(local => locaisGanhadoresText += `${local}<br>`);
        } else {
            locaisGanhadoresText = "Não houve ganhadores neste concurso.";
        }

        for (const key in info) {
            const listItem = document.createElement('li');
            let value = info[key];

            if (key === 'Locais Ganhadores') {
                value = locaisGanhadoresText;
            }

            listItem.innerHTML = `<b>${key}:</b> ${value}`;
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
                <p><b>FA:</b>${frequency.absoluteFrequency}</p>
                <p><b>FR:</b>${frequency.relativeFrequency.toFixed(2)}%</p> 
            `;

            frequenciesContainer.appendChild(numberDiv);
        });

        const numberOfElements = frequenciesContainer.children.length;
        for (let i = numberOfElements; i < 60; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('number');
            emptyDiv.innerHTML = `
            <h2>-</h2>
            <p><b>FA:</b>-</p>
            <p><b>FR:</b>-%</p>
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
        winnersIntervalList.innerHTML = ''; // Limpa a lista

        if (datas && datas.averageSpacing) {
            for (const key in datas.averageSpacing) {
                const item = datas.averageSpacing[key];
                const listItem = document.createElement('li');

                if (item && item.average) {
                    if (item.average == 1) {
                        listItem.innerHTML = `<b>${key}:</b> Todos os concursos.<br><b>Vencedores:</b> ${item.winners}`;
                    } else {
                        listItem.innerHTML = `<b>${key}:</b> Intervalo médio de ${item.average} concurso(s).<br><b>Vencedores:</b> ${item.winners}`;
                    }
                    winnersIntervalList.appendChild(listItem);
                } else {
                    console.warn(`Dados ausentes para ${key}`);
                    listItem.innerHTML = `<b>${key}:</b> Dados não disponíveis`;
                    winnersIntervalList.appendChild(listItem);
                }
            }
        } else {
            console.warn("datas ou datas.allWinners não definidos.");
            const listItem = document.createElement('li');
            listItem.innerHTML = "Dados não disponíveis";
            winnersIntervalList.appendChild(listItem);
        }
        
    }
}

useMegaSenaData();