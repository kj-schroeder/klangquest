const STORAGE_KEY = 'klangquest_challenge';

export const StorageService = {
  /**
    * Speichert die aktuelle Challenge in localStorage
    * @param {Object} challenge - Die Challenge-Daten
    */
  saveChallenge(challenge) {
    try {
      localStorage.setItem('challenge', JSON.stringify(challenge));
    } catch (err) {
      console.error('Fehler beim Speichern der Challenge:', err);
    }
  },
  
  /**
    * Lädt die Challenge aus localStorage
    * @returns {Object|null} Challenge-Objekt oder null
    */
  getChallenge() {
    try {
      const challenge = localStorage.getItem(STORAGE_KEY);
      return challenge ? JSON.parse(challenge) : null
    } catch (err) {
      console.error('Fehler beim Laden der Challenge:', err);
      return null;
    }

  },

  /**
    * Löscht die gespeicherte Challenge aus localStorage
    */
  clearChallenge() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Fehler beim Löschen der Challenge:", error);
    }
  },
};
