export function feedAllNumber() {
    const backupData = localStorage.getItem('megalumni_backup');
    const parseBackupData = JSON.parse(backupData);
    
        function analyzeFrequency(startNumber, endNumber, startPosition, endPosition) {
        const frequencyByInterval = {};
        const totalByPosition = {};
        const totalByNumber = {};
    
        for (let position = startPosition; position <= endPosition; position++) {
            frequencyByInterval[position] = {};
            for (let number = startNumber; number <= endNumber; number++) {
                const formattedNumber = number.toString().padStart(2, '0');
                frequencyByInterval[position][formattedNumber] = 0;
                totalByNumber[formattedNumber] = 0;
            }
        }
    
        for (let i = 0; i < parseBackupData.length; i++) {
            const dozens = parseBackupData[i].listaDezenas;
            for (let j = 0; j < dozens.length; j++) {
                const position = j + 1;
                const number = dozens[j];
    
                if (number >= startNumber && number <= endNumber && position >= startPosition && position <= endPosition) {
                    const formattedNumber = number.toString().padStart(2, '0');
                    frequencyByInterval[position][formattedNumber]++;
                    totalByPosition[position] = (totalByPosition[position] || 0) + 1;
                    totalByNumber[formattedNumber]++;
                }
            }
        }
    
        for (const position in frequencyByInterval) {
            for (const number in frequencyByInterval[position]) {
                frequencyByInterval[position][number] = {
                    absoluteFrequency: frequencyByInterval[position][number],
                    relativeFrequency: (frequencyByInterval[position][number] / totalByPosition[position]).toFixed(2)
                };
            }
        }
    
        return {
            frequencyByInterval: frequencyByInterval,
            totalByNumber: totalByNumber 
        };
    }
    
    const { frequencyByInterval, totalByNumber } = analyzeFrequency(1, 60, 1, 6);
    const analysisContainer = document.getElementById('analysis-number-container');
    analysisContainer.innerHTML = '';
    
    const sortedNumbers = Object.keys(totalByNumber).sort((a, b) => {
        return parseInt(a) - parseInt(b);
    });
    
    for (const number of sortedNumbers) { 
        const numberDiv = document.createElement('div');
        numberDiv.classList.add('number');
    
        const numberHeading = document.createElement('h3');
        numberHeading.textContent = number;
    
        const absoluteFrequencyParagraph = document.createElement('p');
        absoluteFrequencyParagraph.textContent = `FA: ${totalByNumber[number]}`;
    
        const totalOcorrencias = parseBackupData.length * 6;
        const relativeFrequencyTotal = (totalByNumber[number] / totalOcorrencias) * 100;
    
        const relativeFrequencyParagraph = document.createElement('p');
        relativeFrequencyParagraph.textContent = `FR: ${relativeFrequencyTotal.toFixed(2)}%`;
    
        numberDiv.appendChild(numberHeading);
        numberDiv.appendChild(absoluteFrequencyParagraph);
        numberDiv.appendChild(relativeFrequencyParagraph);
    
        analysisContainer.appendChild(numberDiv);
    }
}