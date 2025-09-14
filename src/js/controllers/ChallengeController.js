import { ChordChallenge } from "@/js/models/ChordChallenge.js";
import { ChordController } from "@/js/controllers/ChordController.js";

/**
 * Verwaltet die Erstellung und Auswertung von Akkord-Challenges.
 * Generiert zufällige Akkord-Paare, erstellt Tabellenzeilen für das UI
 * und prüft Benutzerantworten.
 */
export class ChallengeController {

    // =========================
    // 1. Initialisierung & Challenge-Erstellung
    // =========================

    /**
     * Erstellt eine neue Akkord-Challenge mit zwei zufälligen Akkorden.
     * @param {boolean} [isPolyphonic=true] - Bestimmt, ob polyphone Akkorde verwendet werden sollen
     * @returns {ChordChallenge} Eine neue Challenge-Instanz
     * @throws {Error} Wenn die Challenge nicht generiert werden kann
     */
    static initChordChallenge(isPolyphonic = true) {
        try {
            const chord1 = ChordController.generateRandomChord(isPolyphonic);
            const chord2 = ChordController.generateRandomChord(isPolyphonic, chord1.pitchedNotes.length);
            const rows = this.generateRows(chord1, chord2);

            return new ChordChallenge(chord1, chord2, isPolyphonic, rows);
        } catch (err) {
            console.error("Fehler beim generieren der Challenge:", err);
            throw Error('initChordChallenge error: ', err);
        }
    }

    // =========================
    // 2. Hilfsfunktionen für UI-Zeilen
    // =========================

    /**
     * Generiert die Titel für die Tabellenzeilen basierend auf der Akkordgröße.
     * Beispiel: Tiefster Ton, Mittlerer Ton, Höchster Ton.
     * @param {Object} chord - Akkord-Objekt mit pitchedNotes-Array
     * @returns {string[]} Array der Zeilentitel
     */
    static generateRowTitles(chord) {
        const availableRows = [
            "Tiefster Ton",
            "Mittlerer Ton 01",
            "Mittlerer Ton 02",
            "Mittlerer Ton 03",
            "Mittlerer Ton 04",
            "Höchster Ton"
        ];

        const rowTitles = [];
        rowTitles.push(availableRows[0]);

        for (let i = 0; i < chord.pitchedNotes.length - 2; i++) {
            rowTitles.push(availableRows[i + 1]);
        }

        rowTitles.push(availableRows[5]);
        return rowTitles;
    }

    /**
     * Erstellt die Datenstruktur für die UI-Zeilen einer Challenge.
     * Jede Zeile enthält IDs, Titel und die entsprechenden Töne der beiden Akkorde.
     * @param {Object} chord1 - Erster Akkord
     * @param {Object} chord2 - Zweiter Akkord
     * @returns {Array<{id: string, title: string, chord1: string, chord2: string}>}
     */
    static generateRows(chord1, chord2) {
        const rowTitles = this.generateRowTitles(chord1);
        return rowTitles.map((rowTitle, index) => ({
            id: `ton0${index + 1}`,
            title: rowTitle,
            chord1: chord1.pitchedNotes[index],
            chord2: chord2.pitchedNotes[index]
        }));
    }

    // =========================
    // 3. Auswertung der Benutzerantworten
    // =========================

    /**
     * Bewertet die Benutzerantworten im Vergleich zur erwarteten Lösung.
     * @param {Object} userInput - Key-Value-Objekt mit Zeilen-ID als Key und gegebener Note als Wert
     * @param {ChordChallenge} challenge - Die aktuelle Challenge-Instanz
     * @returns {Object} Ergebnis mit Score, Gesamtanzahl und Details pro Zeile
     * @returns {number} return.score - Anzahl der korrekten Antworten
     * @returns {number} return.total - Gesamtzahl der Zeilen
     * @returns {Array} return.rows - Details zu jeder Zeile (korrekt/falsch, richtige Antwort, etc.)
     */
    static evaluate(userInput, challenge) {
        const rows = [];
        let score = 0;

        challenge.rows.forEach((row, i) => {
            const id = row.id;
            const expected = row.chord2.slice(0, -1); // Note ohne Oktave
            const given = userInput[id];

            if (given === expected) {
                score++;
                rows.push({ id, isCorrect: true, userAnswer: given });
            } else {
                rows.push({
                    id,
                    isCorrect: false,
                    userAnswer: given || null,
                    correctAnswer: expected
                });
            }
        });

        return {
            score,
            total: challenge.rows.length,
            rows
        };
    }
}