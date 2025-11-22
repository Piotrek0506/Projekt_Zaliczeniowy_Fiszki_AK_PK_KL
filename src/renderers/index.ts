import { SessionSummary, FilterSettings, Deck } from '../models/index.js'; 
import { FlashcardSession } from '../logic/session.js'; 
import { renderFilterPanel } from './filters.js'; 

const APP_CONTAINER_ID = 'app';
const appContainer = document.getElementById(APP_CONTAINER_ID) as HTMLDivElement;

function getStatsPanelHtml(session: FlashcardSession, cardRevealed: boolean): string {
    const state = session.getState();

    

    let totalTime = '00:00';
    let cardTime = '00:00';
    if (!state.isCompleted) {
        totalTime = session.formatTime(session.getTotalSessionTimeMs());
        cardTime = session.formatTime(session.getTimeOnCurrentCardMs());
    }

    return `
        <div class="stats-panel">
            <div class="stat-item">Bieżąca fiszka: <strong>${state.currentCardIndex + 1}/${state.cardOrderIds.length}</strong></div>
            <div class="stat-item">Znam: <strong style="color: #28a745;">${session.getKnownCount()}</strong></div>
            <div class="stat-item">Jeszcze nie: <strong style="color: #dc3545;">${session.getNotYetCount()}</strong></div>
            <div class="stat-item">Czas na fiszce: <strong id="card-timer">${cardTime}</strong></div>
            <div class="stat-item">Łączny czas: <strong id="session-timer">${totalTime}</strong></div>
        </div>
    `;
}



export function renderStartScreen(deck: Deck, currentSettings: FilterSettings): string {
    return `
        <h1>📖 ${deck.deckTitle}</h1>
        <p>Witaj w aplikacji do nauki słówek. Gotów na powtórkę?</p>
        <div class="summary-item">Liczba fiszek w talii: <strong>${deck.cards.length}</strong></div>
        
        ${renderFilterPanel(deck, currentSettings)}
        
        <div class="controls" style="text-align: center; margin-top: 30px;">
            <button id="start-session-btn" class="btn btn-primary">Rozpocznij sesję</button>
        </div>
    `;
}


export function renderCardViewHtml(session: FlashcardSession, cardRevealed: boolean): string {
    const card = session.getCurrentCard();
    const result = session.getCurrentResult();
    const isGraded = result.grade !== null;

    const backContent = cardRevealed ? 
        `<div class="card-back">${card.back}</div>` : 
        `<p style="font-size: 0.8em; color: #888;">Naciśnij "Pokaż odpowiedź"</p>`;
    
    const gradingControls = `
        <div class="grading-controls" style="display: ${cardRevealed && !isGraded ? 'block' : 'none'};">
            <p>Jak oceniasz swoją znajomość?</p>
            <button id="grade-known-btn" class="btn btn-success" ${isGraded ? 'disabled' : ''}>Znam</button>
            <button id="grade-notyet-btn" class="btn btn-danger" ${isGraded ? 'disabled' : ''}>Jeszcze nie</button>
        </div>
    `;
    
    const showAnswerButton = `
        <button id="show-answer-btn" class="btn btn-secondary" style="display: ${!cardRevealed ? 'block' : 'none'}; margin: 10px auto;">Pokaż odpowiedź</button>
    `;

    const isLastCard = session.getState().currentCardIndex === session.getState().cardOrderIds.length - 1;
    const isFinishActive = session.isFinishButtonActive();

    const navigationControls = `
        <div class="controls">
            <button id="prev-card-btn" class="btn btn-nav" ${session.getState().currentCardIndex === 0 ? 'disabled' : ''}>Poprzednia</button>
            <button id="next-card-btn" class="btn btn-nav" ${isLastCard ? 'disabled' : ''}>Następna</button>
            <button id="finish-session-btn" class="btn btn-primary" ${isFinishActive ? '' : 'disabled'}>Zakończ sesję</button>
        </div>
    `;

    let gradedInfo = '';
    if (isGraded) {
        const gradeText = result.grade === 'Known' ? '✅ ZNANA' : '❌ JESZCZE NIE';
        gradedInfo = `<p style="margin-top: 10px; font-weight: bold; color: ${result.grade === 'Known' ? 'green' : 'red'};">Fiszka już oceniona: ${gradeText}</p>`;
    }
    
    return `
        <h1>${session.getState().deckTitle}</h1>
        ${getStatsPanelHtml(session, cardRevealed)}
        <div class="card-view">
            <div class="flashcard">
                <div class="card-front">${card.front}</div>
                ${backContent}
            </div>
            ${gradedInfo}
            ${showAnswerButton}
            ${gradingControls}
            ${navigationControls}
        </div>
    `;
}


export function renderSummaryScreen(title: string, summary: SessionSummary): string {
    const hardCardsList = summary.hardCards.length > 0 ? 
        `
        <h3>Trudne fiszki (${summary.notYet} szt.) do powtórki:</h3>
        <ul class="hard-cards-list">
            ${summary.hardCards.map(card => `<li><strong>${card.front}</strong> - ${card.back}</li>`).join('')}
        </ul>
        <button id="repeat-hard-btn" class="btn btn-danger" style="margin-top: 15px;">Powtórz tylko trudne</button>
        ` : 
        `<p>Brak fiszek oznaczonych jako "Jeszcze nie". Świetna robota!</p>`;

    return `
        <h1>🎉 Podsumowanie Sesji: ${title}</h1>
        <h2>Wyniki</h2>
        <div class="stats-panel">
            <div class="stat-item">Znam: <strong style="color: #28a745;">${summary.known}</strong></div>
            <div class="stat-item">Jeszcze nie: <strong style="color: #dc3545;">${summary.notYet}</strong></div>
        </div>
        <h2>Czasy</h2>
        <div class="summary-item">Łączny czas sesji: <strong>${summary.totalTime}</strong></div>
        <div class="summary-item">Średni czas na fiszkę: <strong>${summary.avgTime}</strong></div>
        
        <h2>Lista do powtórki</h2>
        ${hardCardsList}
        
        <div class="controls" style="text-align: center; margin-top: 30px;">
            <button id="return-to-start-btn" class="btn btn-primary">Powrót do ekranu startowego</button>
        </div>
    `;
}
