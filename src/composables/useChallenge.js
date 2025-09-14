import { ref, onMounted } from "vue";
import { ChallengeController } from "@/js/controllers/ChallengeController.js";
import { AudioController } from "@/js/controllers/AudioController";
import { StorageService } from "@/js/services/storageService.js";

const { saveChallenge, getChallenge, clearChallenge } = StorageService;

/**
 * Composable für die Verwaltung von Chord-Challenges.
 * Lädt, speichert, wertet aus und resetet Challenges.
 * @returns {Object} API mit Challenge-State, Lade-Status, Fehler und Methoden
 */
export function useChallenge() {
    /**
     * Aktuelle Challenge-Instanz
     * @type {import('vue').Ref<Object|null>}
     */
    const challenge = ref(null);

    /**
     * Flag für Ladeanzeige
     * @type {import('vue').Ref<boolean>}
     */
    const showLoading = ref(true);

    /**
     * Fehlernachrichten
     * @type {import('vue').Ref<string|null>}
     */
    const error = ref(null);

    /**
     * App Version
     * @type {import('vue').Ref<boolean>}
     */
    const isDemo = ref(AudioController.isDemo);

    // ==============================
    // INIT: App-Version prüfen
    // ==============================
    onMounted(async () => {
        console.log("App läuft im Modus:", isDemo.value ? "Demo" : "Full");
    });

    // =========================
    // 1. Challenge laden
    // =========================

    /**
     * Lädt eine Challenge aus localStorage oder erzeugt eine neue.
     * @param {boolean} [forceNew=false] - Erzwingt die Erstellung einer neuen Challenge
     */
    const loadChallenge = async (forceNew = false) => {
        error.value = null;

        // Lade-Timer starten: erst nach 200ms Loading anzeigen
        const loadingTimer = setTimeout(() => {
            showLoading.value = true;
        }, 200);

        try {
            if (!forceNew) {
                const storedChallenge = getChallenge();
                if (storedChallenge) {
                    challenge.value = storedChallenge;
                    return;
                }
            }

            const newChallenge = ChallengeController.initChordChallenge(true);
            challenge.value = newChallenge;
            saveChallenge(newChallenge);

        } catch (err) {
            console.error("Fehler beim Laden der Challenge:", err);
            error.value = "Challenge konnte nicht geladen werden.";
            challenge.value.rows = [];
        } finally {
            clearTimeout(loadingTimer);
            showLoading.value = false;
        }
    };

    // =========================
    // 2. Challenge auswerten
    // =========================

    /**
     * Bewertet die aktuelle Challenge anhand der Benutzereingaben.
     * Speichert das Ergebnis im Challenge-Objekt.
     * @returns {Object|null} Auswertungsergebnis oder null bei Fehler
     */
    const evaluateChallenge = async () => {
        error.value = null;

        // Benutzer-Eingaben aus Challenge-Rows sammeln
        const userInput = {};
        challenge.value.rows.forEach((row) => {
            userInput[row.id] = row.selectedNote;
        });

        try {
            if (!userInput || !challenge.value) {
                throw new Error('Ungültiger Userinput oder Challenge-Wert.');
            }

            const result = ChallengeController.evaluate(userInput, challenge.value);
            challenge.value.result = result;
            return result;
        } catch (err) {
            console.error("Fehler beim Auswerten der Challenge:", err);
            error.value = "Challenge konnte nicht ausgewertet werden.";
            return null;
        }
    };

    // =========================
    // 3. Challenge zurücksetzen
    // =========================

    /**
     * Löscht die gespeicherte Challenge und setzt den State zurück.
     */
    const resetChallenge = () => {
        clearChallenge();
        challenge.value = null;
    };

    // =========================
    // 4. API
    // =========================

    return {
        challenge,
        showLoading,
        error,
        isDemo,
        loadChallenge,
        evaluateChallenge,
        resetChallenge
    };
}
