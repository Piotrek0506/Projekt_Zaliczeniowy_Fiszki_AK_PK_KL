import { SessionState } from '../models';

const STORAGE_KEY_PREFIX = 'flashcard_session_';

/**
 * Zapisuje stan sesji do localStorage.
 * @param state - aktualny stan sesji.
 */
export function saveSession(state: SessionState): void {
    const key = STORAGE_KEY_PREFIX + state.deckTitle;
    try {
        state.lastReviewDate = Date.now(); 
        localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
        console.error("Błąd zapisu do localStorage", e);
    }
}

/**
 * Wczytuje stan sesji z localStorage.
 * @param deckTitle - tytuł talii.
 * @returns Zapisany stan sesji lub null.
 */
export function loadSession(deckTitle: string): SessionState | null {
    const key = STORAGE_KEY_PREFIX + deckTitle;
    try {
        const json = localStorage.getItem(key);
        if (json) {
            return JSON.parse(json) as SessionState;
        }
    } catch (e) {
        console.error("Błąd odczytu z localStorage", e);
    }
    return null;
}

/**
 * Usuwa stan sesji z localStorage.
 * @param deckTitle - tytuł talii.
 */
export function clearSession(deckTitle: string): void {
    const key = STORAGE_KEY_PREFIX + deckTitle;
    localStorage.removeItem(key);
}