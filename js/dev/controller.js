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
            for (let i = 0; i < parsedData[0].listaDezenas.length; i++) {
                const mostFrequent = findMostFrequentNumbers(parsedData, i, numsequence);
                if (mostFrequent.length > 0) {
                    const randomIndex = Math.floor(Math.random() * mostFrequent.length);
                    newCombination.push(mostFrequent[randomIndex].toString().padStart(2, '0'));
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

// Consult Contest
const consultSequenceForm = document.getElementById('consult-sequence');
const consultSequenceInput = document.getElementById('consult-sequence-input');

consultSequenceInput.addEventListener('input', () => {
    consultSequenceInput.classList.remove('errorField');
});

consultSequenceForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (consultSequenceInput.value.trim() == '' || consultSequenceInput.value.length < 22) {
        consultSequenceInput.classList.add('errorField');
    } else {
        consultSequenceInput.classList.remove('errorField');
    }
});

// Consult Contest
const consultContestForm = document.getElementById('consult-contest');
const consultContestInput = document.getElementById('consult-contest-input');

consultContestInput.addEventListener('input', () => {
    consultContestInput.classList.remove('errorField');
});

consultContestForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (consultContestInput.value.trim() == '') {
        consultContestInput.classList.add('errorField');
    } else {
        consultContestInput.classList.remove('errorField');
    }
});