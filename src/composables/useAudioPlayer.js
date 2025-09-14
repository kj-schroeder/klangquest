import { AudioController } from "@/js/controllers/AudioController.js";
import { ref } from "vue";

/**
 * Composable für die Audio-Wiedergabe von Akkorden.
 * Verwaltet Play/Stop-Logik und den Status, ob aktuell abgespielt wird.
 * @returns {Object} API mit isPlaying-Ref, playChord- und stopChord-Funktionen
 */
export function useAudioPlayer() {
    /**
     * Gibt an, ob aktuell ein Akkord abgespielt wird
     * @type {import('vue').Ref<boolean>}
     */
    const isPlaying = ref(false);

    /**
     * Gespeicherte AudioBufferSourceNodes für Stopp-Zugriff
     * @type {AudioBufferSourceNode[]}
     */
    let sources = [];

    // =========================
    // 1. Wiedergabe von Akkorden
    // =========================

    /**
     * Spielt einen Akkord aus mehreren Noten ab.
     * Initialisiert AudioContext, lädt die Samples und startet die Wiedergabe.
     * @param {string[]} notes - Array von Notennamen (z. B. ["C4", "E4", "G4"])
     */
    async function playChord(notes) {
        await AudioController.initContext();
        isPlaying.value = true;
        
        // Lade AudioBuffer und Halbton-Differenzen
        const chordData = await AudioController.setupChord(notes);

        // Starte jede Note und speichere die AudioQuellen für Stop
        sources = chordData.map(([buffer, semitoneDiff]) => {
            const source = AudioController.playNote(buffer, semitoneDiff);
            return source; // speichern für Stop
        });

        // Setze isPlaying nach Ende des längsten Buffers zurück auf false
        const maxDuration = Math.max(...sources.map(source => source.buffer.duration));
        setTimeout(() => (isPlaying.value = false), maxDuration * 1000);
    }

    // =========================
    // 2. Stopp der Wiedergabe
    // =========================

    /**
     * Stoppt aktuell abgespielte Akkorde sofort.
     * Leert die gespeicherten Quellen und setzt isPlaying zurück.
     */
    function stopChord() {

        sources.forEach(source => {
            try { 
                source.stop(); 
            } catch { /* ignorieren, falls bereits gestoppt */ }
        });
        sources = [];
        isPlaying.value = false;
    }

    // =========================
    // 3. API
    // =========================
    return {
        isPlaying,
        playChord,
        stopChord
    };
}