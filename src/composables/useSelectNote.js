import { ref, computed } from 'vue';

/**
 * Composable für die Auswahl einer Note in einer Zeile.
 * Verwaltet den aktiven Row-State und die Interaktion mit dem Select-Modal.
 * @returns {Object} API mit State und Methoden zum Öffnen, Schließen und Auswählen von Noten
 */
export function useSelectNote() {
  /**
   * Aktive Row, für die aktuell eine Note ausgewählt wird
   * @type {import('vue').Ref<Object|null>}
   */
  const activeRow = ref(null);

  // =========================
  // 1. Modal öffnen / schließen
  // =========================

  /**
   * Öffnet das Select-Note-Modal für eine bestimmte Zeile
   * @param {Object} row - Zeile, für die das Modal geöffnet wird
   */
  function openSelectModal(row) {
    activeRow.value = row;
  }

  /**
   * Schließt das Select-Note-Modal.
   * Wird z.B. verwendet, um die Prop `show=false` zu setzen.
   */
  function closeSelectModal() {
    // Hier wird nur das Modal via Prop geschlossen
  }

  /**
   * Wird aufgerufen, wenn das Modal komplett geschlossen wurde (z. B. hidden.bs.modal Event)
   * Setzt die aktive Zeile zurück
   */
  function handleModalClosed() {
    activeRow.value = null;
  }

  // =========================
  // 2. Note auswählen
  // =========================

  /**
   * Wählt eine Note für die aktuell aktive Zeile aus.
   * Schließt anschließend das Modal.
   * @param {string} note - Die ausgewählte Note (z. B. "C4")
   */
  function selectNoteForActiveRow(note) {
    if (activeRow.value) {
      activeRow.value.selectedNote = note;
      closeSelectModal();
    }
  }

  // =========================
  // 3. Computed Properties
  // =========================

  /**
   * Gibt zurück, ob gerade eine Zeile aktiv ist
   * @type {import('vue').ComputedRef<boolean>}
   */
  const hasActiveRow = computed(() => !!activeRow.value);

  // =========================
  // 4. API
  // =========================

  return {
    activeRow,
    hasActiveRow,
    openSelectModal,
    closeSelectModal,
    handleModalClosed,
    selectNoteForActiveRow
  };
}
