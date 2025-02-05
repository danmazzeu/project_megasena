import api from './api.js';
import { loading } from "./loading.js";

async function analyzeMegaSenaData() {
    const data = await api();

    if (!data || data.length === 0) {
        return;
    }

    let currentContest;
    const strongZones = [];
    const allFrequencies = [];
    const allDozens = {};

    // 1. Current Contest
    function getCurrentContest() {
        currentContest = data[0];
        return currentContest;
    }

    // 2. All Dozens
    function getAllDozens() {
        data.forEach((contest, index) => {
            allDozens[`dezenas ${index + 1}`] = contest.dezenas.sort((a, b) => a - b).map(dezena => dezena.padStart(2, '0'));
        });
        return allDozens;
    }

    // 3. Strong Zones
    function getStrongZones() {
        for (let i = 0; i < 6; i++) {
            const numbersInPosition = data.map(contest => contest.dezenas[i]);
            const frequencies = {};

            numbersInPosition.forEach(number => {
                frequencies[number] = (frequencies[number] || 0) + 1;
            });

            const sortedFrequencies = Object.entries(frequencies)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10);

            const sortedNumbers = sortedFrequencies.map(([number]) => number)
                .sort((a, b) => a - b)
                .map(number => number.padStart(2, '0'));

            strongZones.push(sortedNumbers);
        }
        return strongZones;
    }

    // 4. Generate Combinations (using top 'freq' numbers)
    function generateCombinations(freq) {
        const combinations = [];
        for (let i = 0; i < 6; i++) {
            const numbersInPosition = data.map(contest => contest.dezenas[i]);
            const frequencies = {};

            numbersInPosition.forEach(number => {
                frequencies[number] = (frequencies[number] || 0) + 1;
            });

            const sortedFrequencies = Object.entries(frequencies)
                .sort(([, a], [, b]) => b - a)
                .slice(0, freq)
                .map(([number]) => number.padStart(2, '0'));

            combinations.push(sortedFrequencies);
        }
        return combinations;
    }

    // 5. FA & FR (Frequency Absolute and Relative)
    function getFrequencies() {
        const allNumbers = [];
    
        for (let i = 0; i < 6; i++) {
            const numbersInPosition = data.map(contest => contest.dezenas[i]);
            allNumbers.push(...numbersInPosition);
        }
    
        const totalNumbers = allNumbers.length;
        const frequencies = {};
    
        allNumbers.forEach(number => {
            frequencies[number] = (frequencies[number] || 0) + 1;
        });
    
        Object.entries(frequencies).forEach(([number, count]) => {
            allFrequencies.push({
                number: number.padStart(2, '0'),
                absoluteFrequency: count,
                relativeFrequency: (count / totalNumbers) * 100
            });
        });
    
        return allFrequencies;
    }

    // 6. All Winners
    function getAllWinners() {
        const allWinners = [];

        data.forEach(contest => {
            const winnersForContest = [];

            contest.premiacoes.forEach(premio => { 
                if (premio.ganhadores > 0) {
                  const localGanhadoresArray = contest.localGanhadores || [];

                    winnersForContest.push({
                        faixa: premio.faixa,
                        descricao: premio.descricao,
                        ganhadores: premio.ganhadores,
                        valorPremio: premio.valorPremio,
                        localGanhadores: localGanhadoresArray.filter(local => local.faixa === premio.faixa)
                    });
                }
            });

            if (winnersForContest.length > 0) {
                allWinners.push({
                    concurso: contest.concurso,
                    data: contest.data,
                    dezenas: contest.dezenas,
                    premiacoes: winnersForContest
                });
            }
        });

        return allWinners;
    }

    // 7. Calculate Average Contest Spacing for Winners
    function calculateAverageSpacing() {
        const spacing = {
            "6 acertos": { total: 0, winners: 0, averages: [] },
            "5 acertos": { total: 0, winners: 0, averages: [] },
            "4 acertos": { total: 0, winners: 0, averages: [] }
        };

        data.forEach((contest, index) => {
            contest.premiacoes.forEach(premio => {
                if (premio.ganhadores > 0) {
                    const prizeType = premio.descricao;
                    if (spacing[prizeType]) {
                        spacing[prizeType].winners++;
                        spacing[prizeType].averages.push(index + 1);
                    }
                }
            });
        });

        for (const prizeType in spacing) {
            const { winners, averages } = spacing[prizeType];
            if (winners > 1) {
                let diffs = [];
                for (let i = 1; i < averages.length; i++) {
                    diffs.push(averages[i] - averages[i - 1]);
                }
                const sum = diffs.reduce((acc, val) => acc + val, 0);
                spacing[prizeType].total = sum;
                spacing[prizeType].average = Math.round(sum / diffs.length);
            } else if (winners === 1) {
                spacing[prizeType].average = "Apenas um concurso com ganhadores";
            } else {
                spacing[prizeType].average = "Nenhum concurso com ganhadores";
            }
        }

        return spacing;
    }

    const current = getCurrentContest();
    const dozens = getAllDozens();
    const strong = getStrongZones();
    const freq = getFrequencies();
    const combos = generateCombinations(10);
    const winners = getAllWinners();
    const averageSpacing = calculateAverageSpacing();

    loading(false);

    return {
        currentContest: current,
        strongZones: strong,
        allFrequencies: freq,
        allDozens: dozens,
        combinations: combos,
        allWinners: winners,
        averageSpacing: averageSpacing
    };
}

export default analyzeMegaSenaData;