import { Stats } from './../types';

const stats: Stats = {
  elements: 0,
  filteredElements: 0,
  wordsLoop: 0,
  tabooWordsLoop: 0,
  timeRunned: '0 s',
  filteringEfficency: '0 %',
  algorithmEfficency: '0 %',
};

const createStats = () => ({ ...stats });

const resetStats = (s: Stats) => {
  s = { ...stats };
};

const calculateFilteringEfficency = (elements: number, filteredElements: number) =>
  ((elements - filteredElements) / elements) * 100;

const calculateAlgorithmEfficency = (wordsLoop: number, tabooWordsLoop: number, filteredElements: number) =>
  (filteredElements / (wordsLoop + tabooWordsLoop)) * 100;

const printStats = (s: Stats) => {
  s.filteringEfficency = `${calculateFilteringEfficency(s.elements, s.filteredElements).toFixed(2)} %`;
  s.algorithmEfficency = `${calculateAlgorithmEfficency(s.wordsLoop, s.tabooWordsLoop, s.filteredElements).toFixed(
    2
  )} %`;
  console.table(s);
};

export { createStats, resetStats, printStats };
