
import deckData from './data/deck.json'; 

import { Deck, FilterSettings } from './models/index.js'; 
import { FlashcardSession } from './logic/session.js'; 
import { renderStartScreen, renderCardViewHtml, renderSummaryScreen } from './renderers/index.js'; 
import { loadSession, clearSession } from './storage/storage.js'; 

const app = document.getElementById('app') as HTMLDivElement;
const deck: Deck = deckData as Deck;
let session: FlashcardSession | null = null;
let cardRevealed = false;


let currentFilterSettings: FilterSettings = {
    filterTag: null,
    repeatOnlyHard: false,
    shuffle: deck.session.shuffle 
};

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
        } else {
            
            if (session!.isFinishButtonActive()) {
                showSummary();
            }
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
   
    document.getElementById('repeat-hard-btn')?.addEventListener('click', () => {
      
        const newSession = session!.resetForHardCards();
        if (newSession.getState().cardOrderIds.length > 0) {
            session = newSession;
            currentFilterSettings = session.getState().filterSettings; 
            clearSession(deck.deckTitle); 
            showCardView();
        } else {
            alert('Brak trudnych fiszek do powtórki. Zaczynamy normalną sesję.');
            showStartScreen();
        }
    });
}


function showStartScreen() {
    app.innerHTML = renderStartScreen(deck, currentFilterSettings);
    

    (document.getElementById('tag-filter') as HTMLSelectElement).value = currentFilterSettings.filterTag || '';
    (document.getElementById('shuffle-setting') as HTMLInputElement).checked = currentFilterSettings.shuffle;
    (document.getElementById('repeat-hard-setting') as HTMLInputElement).checked = currentFilterSettings.repeatOnlyHard;
    

    document.getElementById('tag-filter')?.addEventListener('change', (e) => {
        currentFilterSettings.filterTag = (e.target as HTMLSelectElement).value || null;
        currentFilterSettings.repeatOnlyHard = false; 
        (document.getElementById('repeat-hard-setting') as HTMLInputElement).checked = false;

    });
    
    document.getElementById('shuffle-setting')?.addEventListener('change', (e) => {
        currentFilterSettings.shuffle = (e.target as HTMLInputElement).checked;
    });

    document.getElementById('repeat-hard-setting')?.addEventListener('change', (e) => {
        currentFilterSettings.repeatOnlyHard = (e.target as HTMLInputElement).checked;
        if (currentFilterSettings.repeatOnlyHard) {
            currentFilterSettings.filterTag = null; 
            (document.getElementById('tag-filter') as HTMLSelectElement).value = '';
        }
    });
    

    document.getElementById('start-session-btn')?.addEventListener('click', () => {

        session = new FlashcardSession(deck, currentFilterSettings); 
        

        currentFilterSettings = session.getState().filterSettings;

        if (session.getState().cardOrderIds.length > 0) {
            showCardView();
        } else {
            alert('Brak fiszek spełniających kryteria filtrowania. Zmień ustawienia i spróbuj ponownie.');
            session = null;
        }
    });
}


function initApp() {

    const savedSessionState = loadSession(deck.deckTitle);

    if (savedSessionState) {

        currentFilterSettings = savedSessionState.filterSettings;
        session = new FlashcardSession(deck, currentFilterSettings);
    }


    if (session && session.getState().isCompleted) {
        showSummary();
    } else if (session && session.getState().sessionStartTime !== 0) {
        showCardView();
    } else {

        currentFilterSettings = {
            filterTag: null,
            repeatOnlyHard: false,
            shuffle: deck.session.shuffle
        };
        showStartScreen();
    }
}


initApp();