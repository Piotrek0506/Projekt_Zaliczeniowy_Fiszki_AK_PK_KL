export type Grade = 'Known' | 'NotYet' | null;

export interface Card {
    id: number;
    front: string;
    back: string;
    tag?: string;
}

export interface CardResult {
    cardId: number;
    grade: Grade;
    timeSpentMs: number;
    reviewedAt: number;
}

export interface SessionSettings {
    shuffle: boolean;
    showTimer: boolean;
}


export interface FilterSettings {
    filterTag: string | null; 
    repeatOnlyHard: boolean; 
    shuffle: boolean; 
}

export interface Deck {
    deckTitle: string;
    cards: Card[];
    session: SessionSettings;
}

export interface SessionState {
    deckTitle: string;
    cardOrderIds: number[];
    currentCardIndex: number;
    sessionStartTime: number; 
    results: CardResult[];
    isCompleted: boolean;
    lastReviewDate: number; 


    filterSettings: FilterSettings; 
}

export interface SessionSummary {
    known: number;
    notYet: number;
    totalTime: string;
    avgTime: string;
    hardCards: Card[];
}

