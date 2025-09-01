# KlangQuest

KlangQuest ist eine mobile Lern-App, die Nutzern hilft, ihre Musiktheorie-Fähigkeiten zu trainieren. Die App generiert zufällige Akkord-Challenges, bei denen Nutzer Töne identifizieren und Akkorde korrekt zusammensetzen müssen. Feedback und Auswertung erfolgen direkt nach der Eingabe.

Die App ist modular aufgebaut und erweiterbar: Zukünftige Features wie mehrere Schwierigkeitslevel, weitere Challenge-Arten, Login-System, Statistik-Tracking und Multiplayer-Funktionalität mit einem Laravel-Backend sind geplant. Eine Online-Variante mit API-Endpunkten und Express-Server befindet sich aktuell in der Umsetzung.

Funktionen:
- Zufällige Akkordgenerierung (polyphon oder monophon)
- Interaktive Notenauswahl per Modal
- Sofortige Auswertung der Nutzerantworten
- Audio-Wiedergabe von Akkorden mit Pitch-Shifting
- Speicherung des Fortschritts im localStorage

Techstack:
- Frontend: Vue 3, Bootstrap 5, SCSS
- Audio: Web Audio API, Pitch-Shifting für Akkorde
- State & Composables: Vue Ref & Computed für interaktive Komponenten
- Persistenz: LocalStorage via StorageService
- Build & Bundling: Vite
- Code-Struktur: Modular mit Controllers (AudioController, ChordController, ChallengeController) und Composables (useAudioPlayer, useChallenge, useSelectNote)
