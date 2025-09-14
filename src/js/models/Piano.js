export class Piano {
    constructor() {
        //
    }
    
    static octaves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    static notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

    static keys;
    static notesByOctave;
    static keysToMidi;
    
    // Static-Block zur Initialisierung
    static {
        this.notesByOctave = this.generateNotesByOctave();
        this.keys = this.generatePianoKeys();
        this.keysToMidi = this.generateMidiMap();
    }
    
    /**
     * Erzeugt ein Objekt, das jeder Oktave die darin vorkommenden Noten zuordnet.
     *
     * Beispielausgabe:
     * {
     *   0: ["A", "A#", "B"],
     *   1: ["C", "C#", ..., "B"],
     *   ...
     *   8: ["C"]
     * }
    */
    static generateNotesByOctave() {
        const notesByOctave = {};

        for (const octave of Piano.octaves) {
            let notesForOctave;

            if (octave === 0) {
                notesForOctave = ["A", "A#", "B"]
            } else if (octave === 8) {
                notesForOctave = ["C"]
            } else {
                notesForOctave = Piano.notes;
            }

            notesByOctave[octave] = notesForOctave
        }
        
        return notesByOctave;
    };

    /**
     * Erstellt ein Array aller auf einem Klavier vorkommenden Tasten als Strings.
     * 
     * Beispielausgabe:
     * ["A0", "A#0", "B0", "C1", ..., "C8"]
     */
    static generatePianoKeys() {
        const keys = [];

        for (const octave of Piano.octaves) {
            for (const note of Piano.notesByOctave[octave]) {
                keys.push(`${note}${octave}`);
            }
        }

        return keys;
    }
    
    /**
     * Erstellt ein Objekt, das jeder Klaviertaste den entsprechenden MIDI-Wert zuordnet.
     * MIDI-Standard: A0 = 21, C4 = 60, C8 = 108
     *
     * Beispielausgabe:
     * {
     *   "A0": 21,
     *   "A#0": 22,
     *   ...
     *   "C8": 108
     * }
     */
    static generateMidiMap() {
        let midiValue = 0;
        const midiMap = {};

        for (const key of Piano.keys) {
            midiMap[key] = midiValue + 21;
            midiValue++;
        }

        return midiMap;
    };

};