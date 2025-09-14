import { Piano } from "../models/Piano.js";
import { Chord } from "../models/Chord.js";

/**
 * Verwaltet die Generierung und Verarbeitung von Akkorden.
 * Enthält Methoden zum Erstellen von Akkorden aus Intervallen,
 * Zuweisung von Oktaven und Konvertierung in MIDI-Werte.
 */
export class ChordController {

    /**
     * Sammlung von Akkordtypen und deren Intervallformeln in Halbtonschritten.
     * @type {Object<string, number[]>}
     */
    static chordFormulas = {
        major: [0, 4, 7],
        minor: [0, 3, 7],
        diminished: [0, 3, 6],
        augmented: [0, 4, 8],
        dominant7: [0, 4, 7, 10],
        add6: [0, 4, 7, 9],
        minorAdd6: [0, 3, 7, 9],
        sus4: [0, 5, 7],
        sus2: [0, 2, 7],
        doubleDim: [0, 3, 6, 9],
        maj7: [0, 4, 7, 11],
        min7: [0, 3, 7, 10],
        minMaj7: [0, 3, 7, 11],
        dom9: [0, 4, 7, 10, 14],
        min79: [0, 3, 7, 10, 14],
        dom7b9: [0, 4, 7, 10, 13],
    };

    // =========================
    // 1. Auswahl zufälliger Parameter (Root, Akkordtyp)
    // =========================

    /**
     * Wählt einen zufälligen Akkordtyp aus.
     * Wenn eine maximale Größe angegeben ist, wird nach Akkorden gefiltert, die diese Größe nicht überschreiten.
     * @param {number|null} [chordSize=null] - Maximale Akkordgröße
     * @returns {string} Zufälliger Akkordtyp (z. B. "major", "min7")
     */
    static selectRandomChordType(chordSize) {
        let chordTypes;

        // falls chordSize angegeben ist, wird chordTypes gefiltert nach Akkorden, die kürzer oder genauso lang sind, wie angegebene chordSize
        if (chordSize) {
            chordTypes =
                Object
                    .entries(this.chordFormulas)
                    .filter(entry => entry[1].length <= chordSize)
                    .flatMap(entry => entry[0]);
        } else {
            chordTypes = Object.keys(this.chordFormulas);
        }

        return chordTypes[Math.floor(Math.random() * chordTypes.length)];
    }

    /**
     * Wählt eine zufällige Grundnote (Root) aus der Pianoskala.
     * @returns {string} Zufällige Note (z. B. "C", "F#", "G")
     */
    static selectRandomRoot() {
        return Piano.notes[Math.floor(Math.random() * Piano.notes.length)];
    }

    // =========================
    // 2. Akkordaufbau (Intervalle anwenden, Noten erstellen)
    // =========================

    /**
     * Wendet ein Intervall auf eine Grundnote an und gibt die entsprechende Note zurück.
     * @param {string} root - Grundton
     * @param {number} interval - Intervall in Halbtonschritten
     * @returns {string} Resultierende Note
     */
    static applyIntervalToRoot(root, interval) {
        const rootIndex = Piano.notes.indexOf(root);
        const index = (rootIndex + interval) % Piano.notes.length;
        return Piano.notes[index];
    }

    /**
     * Erstellt einen Akkord aus einer Formel (Intervall-Liste) und einer Grundnote.
     * @param {number[]} chordFormula - Liste der Intervalle in Halbtonschritten
     * @param {string} root - Grundton
     * @returns {string[]} Array der Notennamen ohne Oktaven
     */
    static buildChordFromRoot(chordFormula, root) {
        return chordFormula.map(interval =>
            this.applyIntervalToRoot(root, interval)
        );
    }

     // =========================
    // 3. Oktavzuweisung & Stimmenverteilung
    // =========================

    /**
     * Fügt Noten zufällig Oktaven hinzu und verteilt Stimmen, um einen realistischen Akkord zu erzeugen.
     * @param {string[]} notes - Akkordnoten ohne Oktave
     * @param {number|null} chordSize - Zielgröße des Akkords
     * @param {boolean} isPolyphonic - Ob mehrere Stimmen erlaubt sind
     * @returns {string[]} Array von Noten mit Oktaven (z. B. ["C4", "E4", "G5"])
     */
    static pitchify(notes, chordSize, isPolyphonic) {
        const usedNoteOctaves = new Set();
        const spreadNotes = [...notes];

        if (chordSize || isPolyphonic) {
            const voices = [4, 5, 6];
            const numberOfVoices = chordSize ?? voices[Math.floor(Math.random() * voices.length)];

            let notesToAdd = numberOfVoices - spreadNotes.length;

            while (notesToAdd-- > 0) {
                spreadNotes.push(notes[Math.floor(Math.random() * notes.length)]);
            }
        }

        return spreadNotes
            .map(note => this.spreadNoteToOctave(note, Piano.notesByOctave, usedNoteOctaves))
            .sort(this.makePitchComparator(Piano.keysToMidi));
    }

     /**
     * Weist einer Note eine zufällige verfügbare Oktave zu, die bestimmte Regeln erfüllt.
     * @param {string} note - Die Note (z. B. "C")
     * @param {Object} notesByOctave - Objekt mit Oktaven als Keys und Arrays von Noten als Values
     * @param {Set<string>} usedNoteOctaves - Set bereits verwendeter Noten mit Oktaven
     * @returns {string} Note mit Oktave (z. B. "C4")
     * @throws {Error} Wenn keine verfügbare Oktave gefunden wird
     */
    static spreadNoteToOctave(note, notesByOctave, usedNoteOctaves) {
        const validOctaves = Object.keys(notesByOctave)
            .map(Number)
            .filter(oct => oct >= 2 && oct <= 5);

        const availableOctaves = validOctaves.filter(oct => {
            const notes = notesByOctave[oct];
            const noteWithOctave = `${note}${oct}`;

            if (!notes.includes(note)) return false;
            if (usedNoteOctaves.has(noteWithOctave)) return false;

            if (oct === 2 && ["A", "A#", "B"].includes(note)) return true;
            if (oct === 5 && ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"].includes(note)) return true;
            if (oct > 2 && oct < 5) return true;

            return false;
        });

        if (availableOctaves.length === 0) {
            throw new Error(`No available octave for ${note}`);
        }

        const randomOctave = availableOctaves[Math.floor(Math.random() * availableOctaves.length)];
        const noteWithOctave = `${note}${randomOctave}`;
        usedNoteOctaves.add(noteWithOctave);

        return noteWithOctave;
    }

    /**
     * Erstellt eine Vergleichsfunktion für das Sortieren von Noten nach MIDI-Wert.
     * @param {Object} keysToMidi - Map von Noten zu MIDI-Werten
     * @returns {function(string, string): number} Vergleichsfunktion
     */
    static makePitchComparator(keysToMidi) {
        return (noteA, noteB) => {
            return this.noteToMidi(noteA, keysToMidi) - this.noteToMidi(noteB, keysToMidi);
        };
    }

    /**
     * Wandelt eine Note (mit Oktave) in ihren MIDI-Wert um.
     * @param {string} pitchedNote - Note mit Oktave (z. B. "C4")
     * @param {Object} keysToMidi - Map von Noten zu MIDI-Werten
     * @returns {number} MIDI-Wert der Note
     */
    static noteToMidi(pitchedNote, keysToMidi) {
        return keysToMidi[pitchedNote];
    }

    // =========================
    // 5. Akkord-Generierung
    // =========================

    /**
     * Generiert einen zufälligen Akkord mit optionaler Polyphonie und Größe.
     * @param {boolean} [isPolyphonic=true] - Ob der Akkord polyphon sein soll
     * @param {number|null} [chordSize=null] - Gewünschte Größe des Akkords
     * @returns {Chord} Ein neues Chord-Objekt mit allen berechneten Daten
     * @throws {Error} Wenn nach mehreren Versuchen kein gültiger Akkord erzeugt werden kann
     */
    static generateRandomChord(isPolyphonic = true, chordSize = null) {
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
            try {
                const root = this.selectRandomRoot();
                const type = this.selectRandomChordType(chordSize);
                const formula = this.chordFormulas[type];
                const notes = this.buildChordFromRoot(formula, root);
                const pitchedNotes = this.pitchify(notes, chordSize, isPolyphonic);

                return new Chord(root, type, formula, notes, pitchedNotes, isPolyphonic);
            } catch (err) {
                attempts++;
                console.warn(`Fehler beim Generieren eines Akkords (Versuch ${attempts}): ${err.message}`);
            }
        }

        throw new Error('Konnte nach mehreren Versuchen keinen gültigen Akkord erzeugen.');
    }
}