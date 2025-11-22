# Projekt Zaliczeniowy - "Fiszki"

Nowoczesna, przeglądarkowa aplikacjado efektywnej nauki za pomocą fiszek. Projekt napisany w czystym TypeScript z naciskiem na modułowość i obiektowe podejście do logiki sesji.

##  Główne Funkcjonalności

###  Nauka i Powtórki
* **Interaktywne Fiszki:** Możliwość "odwracania" karty i samooceny ("Znam" / "Jeszcze nie").
* **Inteligentne Powtórki:** Unikalny tryb **"Powtórz tylko trudne"**, który pozwala w pętli wałkować błędne odpowiedzi, aż do pełnego opanowania materiału.
* **Filtrowanie:** Wybór fiszek po tagach (np. *czasowniki*, *rzeczowniki*) lub nauka całej talii.
* **Losowanie:** Opcja losowej kolejności kart (Shuffle).

###  Śledzenie Postępów
* **Timery:** Licznik czasu całej sesji oraz czasu spędzonego na pojedynczej fiszce.
* **Statystyki na żywo:** Podgląd licznika znanych/nieznanych słówek w trakcie nauki.
* **Podsumowanie Graficzne:** Wykres słupkowy (Canvas API) generowany po zakończeniu sesji.
* **Szczegółowy Raport:** Lista trudnych słówek do powtórzenia wraz ze średnim czasem odpowiedzi.

###  Zapis i Eksport
* **Auto-Save:** Stan sesji jest automatycznie zapisywany w `localStorage`. Możesz zamknąć przeglądarkę i wrócić do nauki w tym samym miejscu.
* **Eksport Wyników:** Możliwość pobrania raportu z sesji do pliku `.json`.

##  Technologie

Projekt został zbudowany przy użyciu nowoczesnych standardów webowych:

* **Język:** [TypeScript](https://www.typescriptlang.org/) (ES2020, Strict Mode)
* **Struktura:** ES Modules (import/export)
* **Styl:** CSS3 (Flexbox, responsywny design)
* **Wykresy:** HTML5 Canvas API (bez zewnętrznych bibliotek)
* **Dane:** JSON (struktura talii)

## Autorzy
Amelia Kucharz, Piotr Kula, Kinga Łopata.


##  Struktura Projektu

```text
src/
├── data/           # Pliki z danymi (deck.json)
├── logic/          # Logika biznesowa (klasa FlashcardSession)
├── models/         # Interfejsy i typy TypeScript
├── renderers/      # Funkcje generujące widok HTML (View layer)
├── storage/        # Obsługa localStorage
└── main.ts         # Punkt wejściowy aplikacji (Controller)

