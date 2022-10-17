export interface Msg {
  reload?: boolean;
  restart?: boolean;
  get?: string;
  notification?: boolean;
}

export interface Stats {
  elements: number;
  filteredElements: number;
  wordsLoop: number;
  tabooWordsLoop: number;
  filteringEfficency: string;
  algorithmEfficency: string;
}

