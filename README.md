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

## 🗄️ Database Architectuur (Supabase)

### 🔹 Tabellen:
1. **users** (gebaseerd op `auth.users`)
   - `id` (UUID, primary key)
   - `nickname`
   - `avatar_url`
   - `role` (leerling/leerkracht)

2. **quizzes**
   - `id` (UUID, primary key)
   - `title`
   - `description`
   - `teacher_id` (FK naar `users.id`)
   - `difficulty`
   - `grade`
   - `school_id`
   - `created_at`

3. **questions**
   - `id` (UUID, primary key)
   - `quiz_id` (FK naar `quizzes.id`)
   - `question_text`
   - `options` (JSONB array van opties indien multiple choice)
   - `correct_answers` (JSONB array)
   - `time_limit` (10s, 20s, 30s, 60s)

4. **quiz_results**
   - `id` (UUID, primary key)
   - `quiz_id` (FK naar `quizzes.id`)
   - `user_id` (FK naar `users.id`)
   - `score`
   - `attempts`
   - `completed_at`

5. **leaderboard**
   - `user_id` (FK naar `users.id`)
   - `highest_score`
   - `rank`

---

## 🚀 Installatie & Opzetten

### 📌 **Benodigdheden**
- Node.js (v18+ aanbevolen)
- Supabase account
- Vite (voor snelle React ontwikkeling)

### 📥 **Project opzetten**

1. **Clone de repository**
   ```sh
   git clone https://github.com/jouw-gebruikersnaam/BRAINSMASH.git
   cd BRAINSMASH
   ```

2. **Installeer de afhankelijkheden**
   ```sh
   npm install
   ```

3. **Creëer een `.env` bestand en voeg de Supabase API-sleutels toe**
   ```sh
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Start de development server**
   ```sh
   npm run dev
   ```

De app is nu beschikbaar op `http://localhost:5173`

---

## 🎨 UI/UX en Animaties
- **Responsieve vormgeving** met flexbox/grid
- **Laden van data**: spinner met een brein-logo dat pulserend beweegt
- **Hover-animaties** op knoppen en quiz cards
- **Feedback-effecten**: Groen knipperend effect bij correcte antwoorden, rood bij foute antwoorden

---

## 🔒 Authenticatie & Beveiliging
- **Microsoft SSO via Supabase Auth**
- **Role-Based Access Control (RBAC)** in Supabase
- **Row Level Security (RLS)** om enkel toegestane data op te halen
- **Storage Buckets** voor avatars en eventuele quizmedia

---

## 💡 Mogelijke uitbreidingen
- Mogelijkheid om quizzen te delen of te exporteren
- Team-modus waarbij leerlingen in groep kunnen spelen
- Meer gamification met extra badges en beloningen

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
