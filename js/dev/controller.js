const storedData = localStorage.getItem('megalumni_backup');
const parsedData = JSON.parse(storedData);
const currentContest = parsedData.length;
console.log(parsedData)

// Generator
const generatorForm = document.getElementById('generator');
const generatorSelect = document.getElementById('generator-select');
const generatorCardsDiv = document.getElementById('generator-cards');
const generatorError = document.getElementById('generator-error');

generatorSelect.addEventListener("change", function() {
    this.classList.remove('errorField');
    generatorError.style.display = 'none';
    generatorCardsDiv.style.display = 'none';
});

generatorForm.addEventListener("submit", function(event) {
    event.preventDefault();
    if (generatorSelect.value == 'null') {
        generatorSelect.classList.add('errorField');
    } else {
        generatorSelect.classList.remove('errorField');

        function findMostFrequentNumbers(data, position, numsequence) {
            const frequencyMap = {};
            data.forEach(contest => {
                const number = contest.listaDezenas[position];
                if (number !== undefined) {
                    frequencyMap[number] = (frequencyMap[number] || 0) + 1;
                }
            });
          
            return Object.entries(frequencyMap)
                .map(([number, frequency]) => ({ number: parseInt(number), frequency }))
                .sort((a, b) => b.frequency - a.frequency)
                .slice(0, numsequence)
                .map(({ number }) => number);
          }
          
        function generateNewCombination(parsedData, numsequence) {
            const newCombination = [];
            const usedNumbers = new Set();
          
            for (let i = 0; i < parsedData[0].listaDezenas.length; i++) {
                let mostFrequent = findMostFrequentNumbers(parsedData, i, numsequence);
            
                if (i > 0 && mostFrequent.length > 0) {
                    const prevNumber = parseInt(newCombination[i - 1]);
                    mostFrequent = mostFrequent.filter(num => parseInt(num) >= prevNumber && !usedNumbers.has(num));
                }
            
                if (mostFrequent.length > 0) {
                    const randomIndex = Math.floor(Math.random() * mostFrequent.length);
                    const selectedNumber = mostFrequent[randomIndex];
                    newCombination.push(selectedNumber.toString().padStart(2, '0'));
                    usedNumbers.add(selectedNumber);
                } else {
                    newCombination.push(null);
                }
            }
            return newCombination;
        }
          
        function generatorCards(newCombination) {
            generatorCardsDiv.innerHTML = '';
            generatorCardsDiv.style.display = 'grid';
            generatorError.style.display = 'flex';
            generatorError.querySelector('p').innerText = 'Sequência gerada com sucesso.';
          
            for (let i = 0; i < newCombination.length; i++) {
                const number = newCombination[i];
                const card = document.createElement('div');
                card.classList.add('number');
                card.innerHTML = `
                    <h3>${number ?? 'N/A'}</h3>
                    <p>Posição: ${i+1}</p>
                `;
                generatorCardsDiv.appendChild(card);
            }
        }
          
        const newCombination = generateNewCombination(parsedData, generatorSelect.value);
        generatorCards(newCombination);
    }
});

// Analysis Numbers & Positions
const analysisForm = document.getElementById('analysis-numbers');
const analysisSelects = [
    'analysis-position-select-start',
    'analysis-position-select-end',
    'analysis-number-select-start',
    'analysis-number-select-end'
];

analysisSelects.forEach(id => {
    const select = document.getElementById(id);
    select.addEventListener('change', () => {
        select.classList.remove('errorField');
    });
});

analysisForm.addEventListener('submit', (event) => {
    event.preventDefault();
    analysisSelects.forEach(id => {
        const select = document.getElementById(id);
        if (select.value === 'null') {
            select.classList.add('errorField');
        } else {
            select.classList.remove('errorField');
        }
    });
});

// Analysis Contest
const analysisContestForm = document.getElementById('analysis-contests');
const analysisContestSelects = [
    'analysis-contest-select-start',
    'analysis-contest-select-end'
];

analysisContestSelects.forEach(id => {
    const select = document.getElementById(id);
    select.addEventListener('change', () => {
        select.classList.remove('errorField');
    });
});

analysisContestForm.addEventListener('submit', (event) => {
    event.preventDefault();
    analysisContestSelects.forEach(id => {
        const select = document.getElementById(id);
        if (select.value === 'null') {
            select.classList.add('errorField');
        } else {
            select.classList.remove('errorField');
        }
    });
});

// Consult Sequence
const consultSequenceForm = document.getElementById('consult-sequence');
const consultSequenceInput = document.getElementById('consult-sequence-input');
const consultSequenceError = document.getElementById('consult-sequence-error');

consultSequenceInput.addEventListener('input', () => {
    consultSequenceInput.classList.remove('errorField');
    consultSequenceError.style.display = 'none';
});

consultSequenceForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const inputSequence = consultSequenceInput.value.split(', ').map(Number); 

    if (consultSequenceInput.value.trim() == '' || consultSequenceInput.value.length < 22) {
        consultSequenceInput.classList.add('errorField');
        consultSequenceError.classList.add('fail');
        consultSequenceError.classList.remove('success');
        consultSequenceError.querySelector('p').textContent = "É preciso completar a sequência com todos os números.";
    } else if (inputSequence.some(num => num < 0 || num > 60)) {
        consultSequenceInput.classList.add('errorField');
        consultSequenceError.classList.add('fail');
        consultSequenceError.classList.remove('success');
        consultSequenceError.querySelector('p').textContent = "Todos os números devem estar entre 0 e 60.";
    } else if (new Set(inputSequence).size !== inputSequence.length) {
        consultSequenceInput.classList.add('errorField');
        consultSequenceError.classList.add('fail');
        consultSequenceError.classList.remove('success');
        consultSequenceError.querySelector('p').textContent = "Não é possível ter números iguais em posições diferentes.";
    } else {
        const sequenceExists = parsedData.some(item => {
            const itemDezenas = item.listaDezenas.map(dezena => Number(dezena)); 
            return itemDezenas.every(dezena => inputSequence.includes(dezena)) && 
                    inputSequence.every(dezena => itemDezenas.includes(dezena));
        });

        if (sequenceExists) {
            consultSequenceError.classList.add('fail');
            consultSequenceError.classList.remove('success');
            consultSequenceError.querySelector('p').textContent = "Sequência já sorteada anteriormente."
        } else {
            consultSequenceError.classList.add("success");
            consultSequenceError.classList.remove('fail');
            consultSequenceError.querySelector('p').textContent = "Sequência não sorteada anteriormente."
        }
    }

    consultSequenceError.style.display = 'flex';
});

// Consult Contest
const consultContestForm = document.getElementById('consult-contest');
const consultContestInput = document.getElementById('consult-contest-input');
const consultContestError = document.getElementById('consult-contest-error');
const consultResultList = document.getElementById('consult-result');

consultContestInput.addEventListener('input', () => {
    consultContestInput.classList.remove('errorField');
    consultContestError.style.display = 'none';
    consultResultList.style.display = 'none';
});

consultContestForm.addEventListener('submit', (event) => {
    event.preventDefault();
  
    if (consultContestInput.value.trim() === '') {
        consultContestInput.classList.add('errorField');
        consultContestError.classList.add('fail');
        consultContestError.classList.remove('success');
        return;
    }

    function formatToCurrency(value) {
        value = parseFloat(value); 
        if (isNaN(value)) {
          return "Invalid value"; 
        }
        return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
  
    if (consultContestInput.value > currentContest || consultContestInput.value < 1) {
        consultContestInput.classList.add('errorField');
        consultContestError.querySelector('p').textContent = "O número do concurso precisa ser entre 1 e " + currentContest + '.';
        consultContestError.style.display = "flex";
        consultContestError.classList.add('fail');
        consultContestError.classList.remove('success');
    } else {
        consultContestInput.classList.remove('errorField');
        const matchingContest = parsedData.find(item => item.numero === Number(consultContestInput.value));

        if (matchingContest) {
            consultResultList.innerHTML = '';

            const coreInfoList = [
                { textContent: `Concurso: <span>${matchingContest.numero}</span>` },
                { textContent: `Data apuração: <span>${matchingContest.dataApuracao}</span>` },
                { textContent: `Dezenas sorteadas: <span>${matchingContest.listaDezenas.join(' - ')}</span>` },
                { textContent: `Local sorteio: <span>${matchingContest.localSorteio}</span>` },
                { textContent: `Município/UF sorteio: <span>${matchingContest.nomeMunicipioUFSorteio}</span>` },
                { textContent: `Valor acumulado próximo concurso: <span>${formatToCurrency(matchingContest.valorEstimadoProximoConcurso)}</span>` },
                { textContent: `Valor arrecadado: <span>${formatToCurrency(matchingContest.valorArrecadado)}</span>` },
            ];

            const ufList = [];
            for (const uf of matchingContest.listaMunicipioUFGanhadores) {
                ufList.push({
                    textContent: `Locais ganhadores: <span>${uf.municipio} - ${uf.uf}</span>`,
                });
            }

            const rateioList = [];
            for (const rateio of matchingContest.listaRateioPremio) {
                rateioList.push({
                    textContent: `${rateio.descricaoFaixa}: <span>${rateio.numeroDeGanhadores} ganhadores - ${formatToCurrency(rateio.valorPremio)} / cada<span>`,
                });
            }

            const mainList = document.createElement('ul');
            mainList.classList.add('list');

            coreInfoList.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = item.textContent;
                mainList.appendChild(listItem);
            });

            ufList.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = item.textContent;
                mainList.appendChild(listItem);
            });

            rateioList.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = item.textContent;
                mainList.appendChild(listItem);
            });

            consultResultList.appendChild(mainList);
            consultResultList.style.display = 'flex';
            consultContestError.querySelector('p').textContent = "Concurso encontrado com sucesso.";
            consultContestError.style.display = "flex";
            consultContestError.classList.add('success');
            consultContestError.classList.remove('fail');
        } else {
            consultContestError.querySelector('p').textContent = "Concurso não encontrado.";
            consultContestError.style.display = "flex";
            consultContestError.classList.add('fail');
            consultContestError.classList.remove('success');
            consultResultList.style.display = 'none';
        }
    }
});

// Analysis Contests
const analysisContestsForm = document.getElementById('analysis-contests');
const analysisContestsInputStart = document.getElementById('analysis-contest-select-start');
const analysisContestsInputEnd = document.getElementById('analysis-contest-select-end');
const analysisContestsError = document.getElementById('analysis-contest-error');
const analysisContestsResultList = document.getElementById('analysis-contest-result');

analysisContestsInputStart.addEventListener('input', () => {
    analysisContestsInputStart.classList.remove('errorField');
    analysisContestsError.style.display = 'none';
    analysisContestsResultList.style.display = 'none';
});

analysisContestsInputEnd.addEventListener('input', () => {
    analysisContestsInputEnd.classList.remove('errorField');
    analysisContestsError.style.display = 'none';
    analysisContestsResultList.style.display = 'none';
});

analysisContestsForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (analysisContestsInputStart.value.trim() === '') {
      analysisContestsInputStart.classList.add('errorField');
      analysisContestsError.classList.add('fail');
      analysisContestsError.classList.remove('success');
      return;
  }

  if (analysisContestsInputEnd.value.trim() === '') {
      analysisContestsInputEnd.classList.add('errorField');
      analysisContestsError.classList.add('fail');
      analysisContestsError.classList.remove('success');
      return;
  }

  function formatToCurrency(value) {
      value = parseFloat(value);
      if (isNaN(value)) {
        return "Invalid value";
      }
      return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }

  const startContestNumber = parseInt(analysisContestsInputStart.value);
  const endContestNumber = parseInt(analysisContestsInputEnd.value);

  // Validate contest number range
  if (startContestNumber < 1 || endContestNumber < startContestNumber) {
      analysisContestsInputStart.classList.add('errorField');
      analysisContestsError.querySelector('p').textContent = "O número inicial do concurso deve ser maior ou igual a 1 e menor ou igual ao número final.";
      analysisContestsError.style.display = "flex";
      analysisContestsError.classList.add('fail');
      analysisContestsError.classList.remove('success');
      return;
  }

  // Filter contests by number range
  const filteredContests = parsedData.filter(contest => {
      const contestNumber = parseInt(contest.numero);
      return contestNumber >= startContestNumber && contestNumber <= endContestNumber;
  });

  if (filteredContests.length === 0) {
      analysisContestsError.querySelector('p').textContent = "Nenhum concurso encontrado para o intervalo informado.";
      analysisContestsError.style.display = "flex";
      analysisContestsError.classList.add('fail');
      analysisContestsError.classList.remove('success');
      analysisContestsResultList.style.display = 'none';
      return;
  }

  // Calculate total accumulated values and winner counts for each prize tier
  let totalArrecadado = 0;
  let totalRateio = 0;
  const winnerCounts = { '6': 0, '5': 0, '4': 0 }; // Initialize winner counts for 6, 5, and 4 hits

  for (const contest of filteredContests) {
      totalArrecadado += parseFloat(contest.valorArrecadado);
      for (const rateio of contest.listaRateioPremio) {
          const prizeTier = rateio.descricaoFaixa.slice(0, 1); // Extract prize tier (e.g., "6", "5", "4")
          winnerCounts[prizeTier] += parseInt(rateio.numeroDeGanhadores);
          totalRateio += parseFloat(rateio.valorPremio) * parseInt(rateio.numeroDeGanhadores);
      }
  }

  analysisContestsResultList.innerHTML = '';

  const coreInfoList = [
      { textContent: `Total de concursos analisados: <span>${filteredContests.length}</span>` },
      { textContent: `Total de concursos analisados: <span>${filteredContests.length}</span>` },
      { textContent: `Valor total arrecadado: <span>${formatToCurrency(totalArrecadado)}</span>` },
      { textContent: `Total de prêmios distribuídos: <span>${formatToCurrency(totalRateio)}</span>` }, // Corrected line
      { textContent: `Total de ganhadores (6 acertos): <span>${winnerCounts['6']}</span>` },
      { textContent: `Total de ganhadores (5 acertos): <span>${winnerCounts['5']}</span>` },
      { textContent: `Total de ganhadores (4 acertos): <span>${winnerCounts['4']}</span>` },
  ];

  const mainList = document.createElement('ul');
  mainList.classList.add('list');

  coreInfoList.forEach(item => {
      const listItem = document.createElement('li');
      listItem.innerHTML = item.textContent;
      mainList.appendChild(listItem);
  });

  analysisContestsResultList.appendChild(mainList);
  analysisContestsResultList.style.display = 'flex'; 
  analysisContestsError.querySelector('p').textContent = "Análise de concursos realizada com sucesso.";
  analysisContestsError.style.display = "flex";
  analysisContestsError.classList.add('success');
  analysisContestsError.classList.remove('fail');
});