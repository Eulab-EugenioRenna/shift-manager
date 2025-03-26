# 🗓️ Web Application per Gestione Avanzata dei Turni, Pianificazione Automatica Intelligente e Sincronizzazione Calendari per Associazioni di Volontariato

## 🚀 Descrizione del Progetto

Questa applicazione web è progettata per aiutare associazioni di volontariato nella **gestione avanzata dei turni**, **pianificazione automatica intelligente** e **sincronizzazione con calendari personali**. Pensata per team multipli e ruoli differenziati, l'app garantisce una gestione semplice, equa e altamente personalizzabile delle attività, sfruttando le tecnologie più moderne.

## 🧱 Stack Tecnologico

### Frontend
- **Framework**: Angular 19+
- **Componenti UI**: PrimeNG 19
- **CSS Framework**: TailwindCSS 4 (design mobile-first, completamente personalizzabile)

### Backend
- **Backend-as-a-Service**: [Pocketbase](https://pocketbase.io/)
- **API RESTful** ben documentate
- **Autenticazione e autorizzazione** gestite tramite Pocketbase

---

## 🔑 Funzionalità Principali

### 1. 👥 Gestione Avanzata dei Team
- CRUD dei team (creazione, modifica, cancellazione)
- Dati team: nome, descrizione, note, Capo Servizio, volontari
- Gestione dettagli volontari: nome, cognome, ruolo, email, telefono, preferenze e disponibilità

### 2. 🧩 Gestione e Assegnazione Turni
- Configurazione di giornate/fasce orarie standard
- Personalizzazione completa fasce orarie
- Interfaccia **drag-and-drop PrimeNG** per assegnazioni manuali
- **Assegnazione automatica intelligente** basata su:
  - Preferenze e disponibilità
  - Equità di distribuzione
  - Gestione assenze

### 3. 🧠 Pianificazione Automatica Intelligente
- Pattern ricorrenti personalizzabili (giornalieri, settimanali, mensili)
- Algoritmo di pianificazione intelligente:
  - Bilanciamento carico
  - Rispetto preferenze
  - Gestione assenze
- Revisione e modifica post-assegnazione

### 4. 🔐 Sistema Avanzato di Permessi e Ruoli
- **Amministratore**: gestione completa
- **Capo Servizio**: gestione team e pianificazione
- **Volontario**: accesso personale ai propri dati

### 5. 🔄 Sincronizzazione Calendari
- Esportazione turni in formato `.ics`
- Sincronizzazione per:
  - Turni personali (Volontario)
  - Calendario team (Capo Servizio)
  - Tutti i team (Amministratore)

---

## ⭐ Funzionalità Consigliate (Extra)

- 📬 Notifiche automatiche (Email, SMS, Telegram)
- 📊 Dashboard con statistiche (ore, attività, riepiloghi)
- 📁 Esportazione report PDF/Excel
- 🕵️‍♂️ Logging avanzato (storico attività, modifiche)

---

## 🎨 UX/UI Design

- **Componentistica obbligatoria**: PrimeNG (calendari, modali, form, drag-and-drop)
- **Styling**: TailwindCSS per responsive design, look moderno e minimalista
- Navigazione specifica per ruolo utente
- Form con validazioni real-time e UX intuitiva

---

## 🔁 Workflow Esempio

### 👑 Amministratore
1. Crea Team
2. Assegna Capo Servizio
3. Aggiunge Volontari con preferenze/disponibilità
4. Imposta giornate e fasce orarie

### 🧭 Capo Servizio
1. Lancia pianificazione automatica
2. Verifica e modifica turni
3. Conferma e invia notifiche

### 🙋 Volontario
1. Login → Dashboard personale
2. Visualizza turni assegnati
3. Sincronizza con calendario personale

---

## 📦 Deliverables Tecnici

- Codice sorgente completo, pulito e **commentato**
- Documentazione tecnica:
  - Architettura frontend-backend
  - Documentazione API REST
  - Istruzioni di installazione, configurazione e deploy
  - Manuale utente/admin con esempi e screenshot

---

## 🛠️ Installazione e Avvio del Progetto

> ⚠️ Requisiti: Node.js, Angular CLI, TailwindCSS, Pocketbase

```bash
# Clona il repository
git clone https://github.com/tuo-utente/turni-volontariato-app.git
cd turni-volontariato-app

# Installa le dipendenze
npm install

# Avvia l'applicazione Angular
ng serve

# (Separatamente) Avvia Pocketbase
./pocketbase serve
