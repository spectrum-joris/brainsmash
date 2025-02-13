# BRAINSMASH - powered by HET SPECTRUM

BRAINSMASH is een interactieve webapplicatie voor een jaarlijkse quizcompetitie voor leerlingen uit de tweede en derde graad secundair onderwijs in Gent. Het biedt leerlingen de mogelijkheid om quizzen te spelen, scores te behalen en zichzelf te meten met anderen via een leaderboard. Leerkrachten kunnen quizzen aanmaken en statistieken bekijken.

## 📌 Projectoverzicht

**Gebouwd door:**  
- Leerlingen van de 5AD en 6AD klassen van Het Spectrum in Gent  
- Onder begeleiding van Joris Petillion, leerkracht toegepaste informatica  

**Tech Stack:**  
- **Frontend:** React, Vite, React Component Library (naar keuze), Material Icons  
- **Backend:** Express.js (indien nodig)  
- **Database:** Supabase (PostgreSQL), inclusief Auth, Storage en RLS Policies  
- **Authenticatie:** Microsoft SSO (schoolaccounts)  
- **Styling:** Responsive UI met animaties en toegankelijkheidsopties  

---

## 🎯 Functionaliteiten

### 🔹 Algemene functionaliteiten
- Leerkrachten kunnen quizzen aanmaken via een eenvoudige CMS-achtige interface.
- Leerlingen kunnen quizzen spelen, resultaten bekijken en zich meten met anderen via een leaderboard.
- Login via Microsoft SSO (geen e-mail login).
- Tekst-naar-spraak ondersteuning voor het voorlezen van vragen.
- Responsieve en geanimeerde UI met focus op een moderne en toegankelijke gebruikerservaring.

### 🔹 Gebruikersrollen
1. **Leerlingen**  
   - Kunnen quizzen spelen en scores bekijken  
   - Hebben toegang tot hun voortgang en het leaderboard  
   - Kunnen hun profiel aanpassen (nickname, avatar)  

2. **Leerkrachten**  
   - Kunnen quizzen aanmaken en beheren  
   - Hebben toegang tot statistieken van hun quizzen  
   - Kunnen feedback krijgen over quizdeelname  

---

## 📂 Structuur en Navigatie

### 🔸 **Leerlingen:**
- **Mijn Quizzen**: Overzicht van beschikbare quizzen (per graad en opleiding)
- **Mijn Vooruitgang**: Persoonlijke statistieken van quizresultaten
- **Leaderboard**: Overzicht van de top 20 spelers, beste scholen en gemiddelde scores

### 🔸 **Leerkrachten:**
- **Quiz Forms**: Mogelijkheid om quizzen aan te maken en te beheren
- **Mijn Statistieken**: Overzicht van deelname en prestaties van quizzen

### 🔸 **Quiz Detailpagina**
- Weergave van quizvragen met een timer per vraag (10s, 20s, 30s, 60s)
- Multiple-choice of open vragen, afhankelijk van de instellingen
- Animaties en feedback bij het indienen van antwoorden
- Score wordt per vraag berekend en aan het einde opgeslagen in de database

---

## 🚀 Installatie & Opzetten

### 📌 **Benodigdheden**
- Node.js (v18+ aanbevolen)
- Supabase account
- Vite (voor snelle React ontwikkeling)

*** correctie op benodigdheden *** 
We gebruiken Vite en React niet.
Start gewoon op met het CLI commando "nodemon backend/server.js" 

### 📥 **Project opzetten**

1. **Clone de repository**
   ```sh
   git clone https://github.com/spectrum-joris/BRAINSMASH.git
   cd BRAINSMASH
   ```

2. **Installeer de afhankelijkheden**
   ```sh
   npm install
   ```

3. **Creëer een `.env` bestand en voeg de Supabase API-sleutels toe**
   ```sh
   SUPABASE_URL=de_url
   SUPABASE_KEY=de_key
   PORT=3000
   ```

4. **Start de server**
   ```sh
   nodemon backend/server
   ```

De app is nu beschikbaar op `http://localhost:${PORT}`

---

## 🌟 Aanpak & Technologieën

### ✅ Frontend:
- **Vanilla JavaScript** voor snelle, lichte en flexibele ontwikkeling  
- **CSS (Flexbox & Grid)** voor een responsieve en moderne lay-out  
- **CSS Animations & GSAP** voor soepele transities en micro-interacties  
- **Three.js** voor visuele flair en 3D-elementen (bijv. een draaiend brein of bewegende elementen in de UI)  

### ✅ Backend & Auth:
- **Supabase (PostgreSQL)** voor opslag en beheer van quizdata  
- **Supabase Auth met SSO** voor inloggen via Microsoft-schoolaccounts  
- **Rollenbeheer (leerling vs. leerkracht)** via Supabase Row Level Security (RLS)  

### ✅ Performance & UX:
- **Lichte codebase zonder frameworks** voor snelheid  
- **Lazy loading van content** voor snellere paginalading  
- **Responsive design** voor mobiele en desktopgebruik  
- **Caching & optimalisatie** voor snelle laadtijden  

---

## 💡 Mogelijke uitbreidingen
- Mogelijkheid om quizzen te delen of te exporteren
- Team-modus waarbij leerlingen in groep kunnen spelen
- Meer gamification met extra badges en beloningen

---

## 📅 Stappenplan (Februari - Mei)

### 🔹 Februari: Structuur & Basisfunctionaliteiten
**📌 Doel:** Een functionele, maar eenvoudige versie bouwen zonder visuele flair.  
- Basis **HTML/CSS** structuur opzetten (header, navigatie, dashboard, quizpagina).  
- Connectie met **Supabase** en **SSO-auth** implementeren.  
- Gebruikersrollen (**leerling/leerkracht**) bepalen en juiste data tonen.  
- **CRUD-operaties** voor quizzen en antwoorden maken.  

➡️ **Deliverable:** Een ruwe versie waarin je kan inloggen en quizzen kan bekijken/aanmaken.  

---

### 🔹 Maart: UI/UX en Animaties
**📌 Doel:** De applicatie visueel aantrekkelijk en interactief maken.  
- **Animaties & micro-interacties** toevoegen met CSS en GSAP.  
- **Three.js experimenteren**: eenvoudige 3D-animaties (bijv. bewegend brein).  
- **Responsive maken**: mobiele en desktopversie afstemmen.  
- **Scorebord & statistieken** bouwen (Top 10, beste scores, per school).  

➡️ **Deliverable:** Een werkende en aantrekkelijke quizomgeving met leaderboard en scoreweergave.  

---

### 🔹 April: Optimalisatie & Extra Features
**📌 Doel:** De app finetunen en extra’s toevoegen.  
- **Caching & lazy loading** optimaliseren voor snelheid.  
- **Tekst-naar-spraak** implementeren voor quizvragen.  
- **Sound effects & haptische feedback** bij interacties toevoegen.  
- **Finale UI-polish & testen** op meerdere apparaten.  

➡️ **Deliverable:** Een volledige versie die getest kan worden door leerlingen en leerkrachten.  

---

### 🔹 Mei: Media Push & Live Lancering
**📌 Doel:** De applicatie promoten en publiekelijk lanceren.  
- **Beta-testfase** met echte gebruikers.  
- **Feedback verwerken** en laatste aanpassingen doen.  
- **Publiciteit & marketing** voorbereiden (socials, persberichten, video’s).  
- **Definitieve versie online zetten** & lanceringsevent houden.  

➡️ **Final Deliverable:** **BRAINSMASH** is live en klaar voor gebruik! 🚀

---

## 📜 Licentie
Dit project wordt ontwikkeld als educatief project door **Het Spectrum Gent** en is bedoeld voor niet-commercieel gebruik.

---

## 🎓 Bijdragen
Wil je bijdragen aan het project? Volg deze stappen:
1. **Fork de repository**
2. **Maak een nieuwe branch:**  
   ```sh
   git checkout -b feature/nieuwe-feature
   ```
3. **Commit je wijzigingen en push naar GitHub**
4. **Dien een Pull Request in**

---

## 🏆 Team & Credits
- **Leiding & Coördinatie:** Joris Petillion  
- **Ontwikkeling:** Leerlingen van de 5AD en 6AD klassen van Het Spectrum, Gent  
- **Ondersteuning & Feedback:** Leerkrachten van Het Spectrum  

---
🚀 **Veel plezier met BRAINSMASH!**


---

## instructies voor de leerlingen van Het Spectrum
**initializeer npm en installeer de nodige dependencies**
- npm init -y
- npm install
- start de express server: node backend/server.js
- voor automatisch herstarten bij wijzigingen: nodemon backend/server.js (! "npm install -g nodemon" vereist)
- fontend kan je gewoon met Live Server extensie in VSC openen

**Wil je vanuit jouw repo pushen**
echo "# BRAINSMASH-web" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Jpetillion/BRAINSMASH-web.git
git push -u origin main
git add .
git commit -m""
git push https://github.com/Jpetillion/BRAINSMASH-web.git 

**dependencies**
deze vind je terug in de package.json file: 
- express → Webserver
- cors → Beheert Cross-Origin Requests
- dotenv → Beheert gevoelige API-keys via een .env bestand
- @supabase/supabase-js → Communicatie met de Supabase API
- multer → Beheert bestanduploads (bijv. profielfoto's)

**test**
- **API testen:** http://localhost:5000/api/auth/test
- **frontend (met Live Server) testen:** http://127.0.0.1:5500/frontend/index.html 

**MVC**
Deze applicatie is gebouwd in een MVC project structuur, wat de code onderhoudbaar en uitbreidbaar maakt.

| Onderdeel      | Wat doet het?                                                         | Waar zit dit in ons project?                          |
|---------------|------------------------------------------------------------------------|------------------------------------------------------|
| **Model (M)** | Beheert de database, definieert welke data we opslaan en hoe we deze ophalen. | Supabase database, queries in controllers          |
| **View (V)**  | De frontend: toont data aan de gebruiker en stuurt gebruikersacties naar de backend. | HTML, CSS en JavaScript in de `frontend/` folder  |
| **Controller (C)** | Verwerkt gebruikersverzoeken, haalt data op uit het model en stuurt een antwoord naar de View. | Express.js controllers in `backend/controllers/` |

# WERKEND
## Supabase
- tabellen zouden in orde moeten zijn
- enumeraties: bij te werken en te verfijnen (niet alle tabellen gebruiken ze al ; sommige zijn niet ingevuld: scholen, richtingen, vakken)
- policies op public.users voor login, registratie, updaten en verwijderen van eigen profiel
## BACKEND JavaScript
- auth controller, route, middlewares voor registratie en login ; gebruik van rollen is nog niet duidelijk
## FRONTEND JavaScript
- mogelijks zijn HTML en scripts/auth.js niet volledig op mekaar afgestemd 
## HTML
- registratie en login 
## CSS
- nog niets ; moet op basis van ontwerp en system design 

# LICENCE
all rights reserved