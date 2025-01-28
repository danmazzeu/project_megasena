export function feedAllSelect() {
    // Generator
    const generatorSelect = document.getElementById('generator-select');
    const generatorSelectPremiun = 3;

    for (let index = 0; index <= 15; index++) {
        const option = document.createElement('option');
        option.value = index;

        if (index === 0) {
            option.text = `Selecione a frequência`;
            option.value = 'null';
        } else {
            if (index <= generatorSelectPremiun) {
                option.text = `Frequência de ${index} número(s) (Premium)`;
            } else {
                option.text = `Frequência de ${index} número(s)`;
            }
        }

        generatorSelect.appendChild(option);
    }

    // Populate Select
    function populateSelect(selectElement, startValue, endValue, prefix = '', phrase, defaultSelected = null) {
        selectElement.innerHTML = '';
      
        for (let index = 0; index <= endValue; index++) {
            if (index == 0) {
                const selectOption = document.createElement('option');
                selectOption.value = 'null';
                selectOption.text = phrase;
                selectElement.appendChild(selectOption);
            } else {
                const option = document.createElement('option');
                option.value = index;
                option.text = index <= 9 ? `${prefix} 0${index}` : `${prefix} ${index}`;
                option.selected = index == defaultSelected;
                option.style.display = index <= startValue ? 'none' : 'flex';
                selectElement.appendChild(option);
            }
        }
    }

    // Analysis Position & Numbers
    const analysisPositionSelectStart = document.querySelector('#analysis-position-select-start');
    const analysisPositionSelectEnd = document.querySelector('#analysis-position-select-end');
    const analysisNumberSelectStart = document.querySelector('#analysis-number-select-start');
    const analysisNumberSelectEnd = document.querySelector('#analysis-number-select-end');

    populateSelect(analysisPositionSelectStart, 0, 6, 'Posição: ', 'Selecione a posição inicial'); 
    populateSelect(analysisPositionSelectEnd, 0, 6, 'Posição: ', 'Selecione a posição final'); 
    populateSelect(analysisNumberSelectStart, 0, 60, 'Número: ', 'Selecione o número inicial'); 
    populateSelect(analysisNumberSelectEnd, 0, 60, 'Número: ', 'Selecione o número final');

    analysisPositionSelectStart.addEventListener('change', () => {
        analysisPositionSelectEnd.disabled = analysisPositionSelectStart.value === 'null';
        populateSelect(analysisPositionSelectEnd, analysisPositionSelectStart.value, 6, 'Posição: ', 'Selecione a posição final');
    });

    analysisNumberSelectStart.addEventListener('change', () => {
        analysisNumberSelectEnd.disabled = analysisNumberSelectStart.value === 'null';
        populateSelect(analysisNumberSelectEnd, analysisNumberSelectStart.value, 60, 'Número: ', 'Selecione o número final');
    });

    // Analysis Contest
    const storedData = localStorage.getItem('megalumni_backup');
    const parsedData = JSON.parse(storedData);
    const currentContest = parsedData.length;

    const analysisContestSelectStart = document.querySelector('#analysis-contest-select-start');
    const analysisContestSelectEnd = document.querySelector('#analysis-contest-select-end');

    populateSelect(analysisContestSelectStart, 0, currentContest, 'Concurso: ', 'Selecione o concurso inicial');
    populateSelect(analysisContestSelectEnd, 0, currentContest, 'Concurso: ', 'Selecione o concurso final');

    analysisContestSelectStart.addEventListener('change', () => {
        analysisContestSelectEnd.disabled = analysisContestSelectStart.value === 'null';
        populateSelect(analysisContestSelectEnd, analysisContestSelectStart.value, currentContest, 'Concurso: ', 'Selecione o concurso final', currentContest);
    });
}