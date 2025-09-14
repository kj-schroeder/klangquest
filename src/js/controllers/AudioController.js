// AudioController.js
import { Piano } from '../models/Piano.js';

export class AudioController {
    /**
     * Globale AudioContext-Instanz für die Audio-Wiedergabe
     * @type {AudioContext|null}
     */
    static audioContext = null;

    /**
     * App-Version (demo oder full)
     * @type {Boolean}
     */
    static isDemo = import.meta.env.VITE_IS_DEMO === "true";

    // =========================
    // 1. Initialisierung & Setup
    // =========================

    /**
     * Initialisiert den AudioContext (falls nicht vorhanden) und setzt ihn fort, wenn er suspendiert ist
     * @returns {AudioContext} Die initialisierte AudioContext-Instanz
     */
    static initContext() {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        return this.audioContext;
    }

    // =========================
    // 2. Konvertierungs-Methoden (Note ↔ MIDI)
    // =========================

    /**
     * Wandelt einen Notennamen in seinen MIDI-Wert um
     * @param {string} note - Der Notenname (z. B. "C4")
     * @returns {number} MIDI-Wert der Note
     */
    static noteToMidi(note) {
        const midiMap = Piano.generateMidiMap();
        return midiMap[note];
    }

    /**
     * Wandelt einen MIDI-Wert in den entsprechenden Notennamen um
     * @param {number} midiValue - Der MIDI-Wert
     * @returns {string|undefined} Der Notenname oder undefined, wenn nicht gefunden
     */
    static midiToNote(midiValue) {
        const midiMap = Piano.generateMidiMap();
        for (const [note, value] of Object.entries(midiMap)) {
            if (value === midiValue) return note;
        }
    }

    // =========================
    // 3. Berechnungs-Hilfsfunktionen
    // =========================

    /**
     * Berechnet den Grundton (Base Note) für einen Akkord aus einem MIDI-Wert
     * @param {number} midiValue - Der MIDI-Wert
     * @returns {number} Grundton-MIDI-Wert
     */
    static calcBaseNote(midiValue) {
        if (this.isDemo) {
            if (midiValue % 12 === 0) return midiValue;
            if (((midiValue % 12) / 12) > 0.5) return (Math.floor(midiValue / 12) + 1) * 12;
            return Math.floor(midiValue / 12) * 12;
        } else {
            if (midiValue % 3 === 0) return midiValue;
            if (midiValue % 3 === 1) return midiValue - 1;
            return midiValue + 1;
        }
    }

    /**
     * Berechnet die Halbton-Differenz zwischen zwei MIDI-Werten
     * @param {number} midiNote - Der MIDI-Wert der Note
     * @param {number} baseNote - Der MIDI-Wert des Grundtons
     * @returns {number} Halbtonschritte-Differenz
     */
    static calcSemitoneDiff(midiNote, baseNote) {
        return midiNote - baseNote;
    }

    // =========================
    // 4. Audio-Daten laden
    // =========================

    /**
     * Lädt ein Audiosample und dekodiert es in ein AudioBuffer
     * @param {string} filePath - Pfad zur Audiodatei
     * @returns {Promise<AudioBuffer>} Dekodierter AudioBuffer
     */
    static async loadSample(filePath) {
        const response = await fetch(filePath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }

    /**
     * Holt die Audiodaten und Halbton-Differenz für eine Note
     * @param {string} note - Der Notenname (z. B. "C4")
     * @returns {Promise<[AudioBuffer, number]>} AudioBuffer und Halbton-Differenz
     */
    static async getNoteData(note) {
        const midiValue = this.noteToMidi(note);
        const baseNote = this.calcBaseNote(midiValue);
        const semitoneDiff = this.calcSemitoneDiff(midiValue, baseNote);

        const baseNoteName = this.midiToNote(baseNote).replace('#', 'sh');
        const filePath = `/audio/pianotones/${baseNoteName}v9.wav`;

        const audioBuffer = await this.loadSample(filePath);
        return [audioBuffer, semitoneDiff];
    }

    /**
     * Bereitet ein Akkord-Array vor, indem alle Noten geladen und berechnet werden
     * @param {string[]} noteArray - Array von Notennamen
     * @returns {Promise<Array<[AudioBuffer, number]>>} Array aus AudioBuffer und Halbton-Differenz für jede Note
     */
    static async setupChord(noteArray) {
        return await Promise.all(
            noteArray.map(note => this.getNoteData(note))
        );
    }

    // =========================
    // 5. Playback
    // =========================

    /**
     * Spielt eine Note ab mit optionalem Pitch-Shifting
     * @param {AudioBuffer} audioBuffer - Der AudioBuffer der Note
     * @param {number} semitoneDiff - Halbton-Differenz für Pitch-Shifting
     * @returns {AudioBufferSourceNode} Die erstellte Audioquelle
     */
    static playNote(audioBuffer, semitoneDiff) {
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // Erst detune (feinere Anpassung), ansonsten playbackRate als Fallback
        if (source.detune) {
            source.detune.value = semitoneDiff * 100;
        } else {
            source.playbackRate.value = 2 ** (semitoneDiff / 12);
        }

        source.connect(this.audioContext.destination);
        source.start();
        return source;
    }
}
