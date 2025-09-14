# KlangQuest

![Screenshot der KlangQuest AkkordChallenge im Browser](public/images/KlangQuest_Screenshot "KlangQuest AkkordChallenge im Browser")

## KlangQuest (Demo)

Diese Version enthält nur kleine Audio-Dateien. Die volle Audio-Library kann separat heruntergeladen werden.
Die App kann als **Demo** oder **Full-Version** betrieben werden (über `.env` konfigurierbar).

## Über diese App

KlangQuest ist eine Lern-App, die Nutzern hilft, ihre Musiktheorie-Fähigkeiten zu trainieren. Die App generiert zufällige Akkord-Challenges, bei denen Nutzer Töne identifizieren und Akkorde korrekt zusammensetzen müssen. Feedback und Auswertung erfolgen direkt nach der Eingabe.

Die App ist modular aufgebaut und erweiterbar: Zukünftige Features wie mehrere Schwierigkeitslevel, weitere Challenge-Arten, Login-System, Statistik-Tracking und Multiplayer-Funktionalität mit einem Laravel-Backend sind geplant. Eine Online-Variante mit API-Endpunkten und Express-Server befindet sich aktuell in der Umsetzung.

### Funktionen
- Zufällige Akkordgenerierung (polyphon oder monophon)  
- Interaktive Notenauswahl per Modal  
- Sofortige Auswertung der Nutzerantworten  
- Audio-Wiedergabe von Akkorden mit Pitch-Shifting  
- Speicherung des Fortschritts im localStorage  

### Techstack
- **Frontend:** Vue 3, Bootstrap 5, SCSS  
- **Audio:** Web Audio API, Pitch-Shifting für Akkorde  
- **State & Composables:** Vue Ref & Computed für interaktive Komponenten  
- **Persistenz:** LocalStorage via StorageService  
- **Build & Bundling:** Vite  
- **Code-Struktur:** Modular mit  
  - Controllers (AudioController, ChordController, ChallengeController)  
  - Composables (useAudioPlayer, useChallenge, useSelectNote)  

## Credits & Lizenzen

- **Idee, Struktur & Konzept:** Lena Lautner  
- **Design, Entwicklung & Umsetzung:** Katharina J. Schröder  
- **Klaviersounds:** [Salamander Grand Piano](https://archive.org/details/SalamanderGrandPianoV3), lizenziert unter Creative Commons  
- **Icons:** Diese App verwendet [Font Awesome](https://fontawesome.com/)  
- **Schriftarten:** Google Font [Roboto](https://fonts.google.com/specimen/Roboto), lokal eingebunden  
- **Open-Source-Komponenten:** Verwendete Bibliotheken und Frameworks unterliegen ihren jeweiligen Open-Source-Lizenzen (z. B. MIT). Die Lizenztexte sind den Projekten beigelegt und bleiben erhalten  

---

## Installation

```bash
# Dependencies installieren
npm install
````

---

## Entwicklung

```bash
# Entwicklungsserver starten mit Hot-Reload
npm run dev
```

---

## Produktion

```bash
# App für Produktion bauen (minifizierte Dateien)
npm run build
```

**App-Version einstellen:**

* `.env` → `VITE_IS_DEMO=true` für Demo, `false` für Full-Version

---

## Hinweise

* Fallbacks sind implementiert, falls bestimmte Samples in der Demo-Version fehlen.
* Die Challenge-Daten werden lokal im Browser (`localStorage`) gespeichert, sodass die App auch offline funktioniert.