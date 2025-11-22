import deckData from './data/deck.json'; 


import { Deck } from './models/index.js'; 
import { FlashcardSession } from './logic/session.js'; 
import { renderStartScreen, renderCardViewHtml, renderSummaryScreen } from './renderers/index.js'; 
import { loadSession } from './storage/storage.js'; 

const app = document.getElementById('app') as HTMLDivElement;
const deck: Deck = deckData as Deck;
let session: FlashcardSession | null = null;
let cardRevealed = false;

function updateStatsPanel(totalTime: string, cardTime: string): void {
    const totalTimer = document.getElementById('session-timer');
    const cardTimer = document.getElementById('card-timer');
    if (totalTimer) totalTimer.textContent = totalTime;
    if (cardTimer) cardTimer.textContent = cardTime;
}

function showCardView(newCard: boolean = true) {
    if (!session) return;
    
    if (newCard) {
        cardRevealed = session.isCurrentCardGraded();
    }
    
    app.innerHTML = renderCardViewHtml(session, cardRevealed);
    
    session.stopTimer();
    if (!session.getState().isCompleted && deck.session.showTimer) {
        session.startTimer(updateStatsPanel);
    }
    
    document.getElementById('show-answer-btn')?.addEventListener('click', () => {
        cardRevealed = true;
        showCardView(false); 
    });

    document.getElementById('grade-known-btn')?.addEventListener('click', () => {
        session!.gradeCard('Known');
        handleCardGraded();
    });

    document.getElementById('grade-notyet-btn')?.addEventListener('click', () => {
        session!.gradeCard('NotYet');
        handleCardGraded();
    });

    document.getElementById('prev-card-btn')?.addEventListener('click', () => {
        if (session!.goToPrevious()) {
            showCardView();
        }
    });

    document.getElementById('next-card-btn')?.addEventListener('click', () => {
        if (session!.goToNext()) {
            showCardView();
        }
    });
    
    document.getElementById('finish-session-btn')?.addEventListener('click', () => {
        if (session?.isFinishButtonActive()) {
            session.stopTimer();
            showSummary();
        }
    });
}

function handleCardGraded() {
    if (session!.getState().isCompleted) {
        showSummary();
    } else {
        if (session!.goToNext()) {
            showCardView();
        }
    }
}

function showSummary() {
    if (!session) return;
    
    session.stopTimer();
    const summary = session.getSummary();
    app.innerHTML = renderSummaryScreen(deck.deckTitle, summary);
    
    document.getElementById('return-to-start-btn')?.addEventListener('click', () => {
        session = null;
        cardRevealed = false;
        showStartScreen();
    });
}

function showStartScreen() {
    app.innerHTML = renderStartScreen(deck.deckTitle, deck.cards.length);
    
    document.getElementById('start-session-btn')?.addEventListener('click', () => {
        session = new FlashcardSession(deck); 
        showCardView();
    });
}

function initApp() {
    const savedSessionState = loadSession(deck.deckTitle);

    if (savedSessionState && savedSessionState.isCompleted) {
        session = new FlashcardSession(deck);
        showSummary();
    } else if (savedSessionState && savedSessionState.sessionStartTime !== 0) {
        session = new FlashcardSession(deck);
        showCardView();
    } else {
        showStartScreen();
    }
}

initApp();