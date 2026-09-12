# LIFE//OS — The AI-Powered Life RPG

> *"Turn progress into a world worth returning to."*

[![React 19](https://img.shields.io/badge/React-19.0.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-v12.19-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini 2.5](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

---

## 🏆 Tech Zephyr 4.0 Hackathon Submission

**Problem Statement:** Life RPG  
**Team Name:** `IQ100`

### 👥 Team Members
| Role | Name | Contribution Focus |
| :--- | :--- | :--- |
| **Team Lead** | **Tribhuwan Singh** | System Architecture, Full-Stack Integration, Firebase & State Engine |
| **Teammate** | **Paresh Sahoo** | RPG Progression Engine, Quest Matrix CRUD & Game Logic |
| **Teammate** | **Rishika Priyanka Mohanty** | Cyberpunk UI/UX Design, Design System & Accessibility |
| **Teammate** | **Md Waiz Alam** | Sound Synthesis Engine, World Topology & Frontend Integration |

---

## 🌌 The Core Problem

Traditional productivity tools, habit trackers, and to-do lists are fundamentally flawed: **they feel like chores**. They suffer from the classic **"delayed gratification"** problem—where real-world benefits of reading, coding, or exercising take months to manifest. 

In contrast, video games provide immediate dopamine through tactile feedback loops, clear progression bars, and tangible rewards.

**LIFE//OS** bridges this gap. It transforms real-life goals, habits, fitness, and learning into an immersive **Cyberpunk Life RPG** with an active world topology, procedural Web Audio effects, non-linear leveling, and an AI Game Master that analyzes player balance.

---

## ✨ Key Features & System Pillars

```
+-------------------------------------------------------------------------------+
|                                 LIFE//OS                                      |
|                                                                               |
|   [ QUEST MATRIX ]      [ RPG PROGRESSION ]     [ DYNAMIC WORLD TOPOLOGY ]    |
|   • Full Task CRUD      • Polynomial XP Curve   • 5 Biomes Evolve Live        |
|   • Tiers E to S        • Level-Up Celebrations • Habit-Driven Influence      |
|   • Streak Multipliers  • Procedural SFX Audio  • Boss Raid Encounters        |
|                                                                               |
|   [ ORACLE AI MASTER ]  [ REWARDS & ARMORY ]    [ CLOUD PERSISTENCE ]         |
|   • Gemini Telemetry    • In-game Gold Economy  • Firebase Auth (Google/Pass) |
|   • Balance Diagnostics • Relics & Themes       • True Firestore Cloud Sync   |
|   • Tactical Advice     • Stat Synergy Perks    • Survives Page Refresh       |
+-------------------------------------------------------------------------------+
```

### 1. ⚔️ Quest Matrix (Full Task CRUD)
- **Create**: Forge custom quests with title, description, category, difficulty tier, time estimate, and DNA tags.
- **Read**: Dynamic filtering across 6 attribute pillars, difficulty tiers, active vs completed tasks, and search queries.
- **Update**: Adjust quest status, difficulty ratings, and edit task parameters.
- **Delete**: Safely delete or abandon quests with automatic cloud synchronization.

### 2. 📈 Non-Linear RPG Progression Engine
- Progression uses an authentic mathematical curve:
  $$\text{XP Required} = \lfloor 1250 \times \text{Level}^{1.32} \rfloor$$
- Prevents early-game burnout while making late-game levels meaningful milestones.
- Level-up events trigger celebratory visual confetti, unlock titles, award bonus gold, and play procedural synthesized audio cues.

### 3. 🧬 The 6 Character Attribute Pillars
Every quest contributes points to real-world character dimensions:
- **Strength**: Physical fitness, gym workouts, endurance.
- **Intellect**: Coding, reading, technical mastery, problem-solving.
- **Discipline**: Habit streaks, daily routines, meditation, sleep schedule.
- **Creativity**: Writing, design, art, brainstorming.
- **Wellness**: Nutrition, mental recovery, hydration, mindfulness.
- **Social**: Networking, community collaboration, relationships.

### 4. 🌍 Living World Topology (Biosystem Map)
- Real-world consistency shapes 5 distinct regional biomes:
  - **The Silicon Foundry** (Intellect / Discipline)
  - **The Iron Citadel** (Strength)
  - **The Neon Agora** (Social)
  - **The Bioluminescent Grove** (Wellness)
  - **The Aether Archive** (Creativity)
- Regions shift dynamically between *Discovered*, *Unlocked*, and *Mastered* states as quest influence scores rise.
- Features global **Boss Raid Battles** where quest completion damages shared adversaries.

### 5. 🔮 Oracle AI Game Master (Google Gemini)
- Analyzes player telemetry across attributes, recent completions, and momentum.
- Flags dangerous stat imbalances (e.g. high Intellect but neglected Wellness).
- Generates high-leverage tactical recommendations with actionable diagnostic reasons.

### 6. 🛡️ Armory & Virtual Economy
- Earn **Gold** through quest completions, streaks, and level-ups.
- Purchase and equip relics, cybernetic accessories, consumables, and UI themes.
- Equipped artifacts trigger passive stat synergy bonuses (e.g. Cognitive Overclock synergy: +15% XP multiplier).

### 7. 🔊 Procedural Web Audio Engine
- Built with the native **Web Audio API**—zero heavy audio asset downloads.
- Procedurally synthesizes tactile clicks, quest completions, boss hits, error hums, and celebratory level ascensions.

### 8. ☁️ Real Cloud Database & Security (No Fake Persistence)
- **Firebase Authentication**: Supports Google Sign-In, Email & Password accounts, and an instant Guest Agent bypass for evaluations.
- **Cloud Firestore**: Player state, inventory, quests, and attributes are isolated under `/users/{userId}`.
- **Zero-Tolerance Compliance**: Progress persists securely across page reloads and devices.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 (`v19.0.1`) | Modern concurrent UI architecture |
| **Language** | TypeScript 5.8 | Type-safe development across models and services |
| **Styling & Theme** | TailwindCSS v4 | Obsidian dark cyberpunk design system (`#07090e`) |
| **Routing** | TanStack React Router | Fast client-side routing & deep-linking |
| **Animations** | Framer Motion + Canvas Confetti | Tactile spring micro-interactions & level-up visuals |
| **Icons** | Lucide React | Clean, minimalist SVG icon library |
| **Sound Design** | Web Audio API | Procedural sound synthesizer engine |
| **BaaS / Auth** | Firebase Authentication | Google OAuth, Email/Password, and Session Management |
| **Database** | Cloud Firestore | Cloud document store with real-time snapshot sync |
| **AI Engine** | Google Gemini 2.5 (`@google/genai`) | Oracle diagnostic analysis & tactical telemetry |
| **Build Tool** | Vite 6.2 | Rapid HMR and optimized production bundles |

---

## 🚀 Quickstart & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or later)
- npm (bundled with Node.js)

### 1. Clone the Repository
```bash
git clone https://github.com/Tribhuwansingh2023/life-os.git
cd life-os
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment template:
```bash
cp .env.example .env
```
Edit `.env` with your API keys:
```env
# Gemini API Key (for Oracle AI Game Master)
GEMINI_API_KEY="your_gemini_api_key_here"

# App URL
APP_URL="http://localhost:3000"

# Firebase Credentials (project: life-os-2f)
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="life-os-2f.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="life-os-2f"
VITE_FIREBASE_STORAGE_BUCKET="life-os-2f.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="538675642161"
VITE_FIREBASE_APP_ID="1:538675642161:web:ff54e7de77f7d9119e3a10"
VITE_FIREBASE_MEASUREMENT_ID="G-Z0RYSP4GLY"
VITE_FIREBASE_DATABASE_ID="(default)"
```

### 4. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## ⌨️ Keyboard Shortcuts & Accessibility

LIFE//OS is designed for keyboard ergonomics:

| Key | Action |
| :---: | :--- |
| `1` | Command Center (Dashboard) |
| `2` | Quest Matrix |
| `3` | Character & Build Stats |
| `4` | World Topology Map |
| `5` | Oracle AI Game Master |
| `6` | Chrono Replay (7-Day Debrief) |
| `7` | Armory & Inventory Shop |
| `8` | System Settings |
| `Q` | Open Quest Forge Modal |
| `M` | Toggle Sensory Audio Engine |
| `?` | Show Keyboard Shortcut Matrix |
| `Escape` | Dismiss Open Modals |

---

## 📂 Project Architecture

```
life__os/
├── brain/                      # Complete architectural and PRD documentation
│   ├── 00_MASTER_RULES.md      # Governing principles & hackathon protocols
│   ├── 01_PRD.md               # Product Requirements Document
│   ├── 02_TRD.md               # Technical Requirements Document
│   ├── 03_ARCHITECTURE.md      # System architecture & integration contracts
│   ├── 04_DATA_MODEL.md        # Entity definitions & relations
│   └── 10_SECURITY.md          # Security, zero-leak rules, and sanitization
├── src/
│   ├── components/             # Reusable UI primitives & game components
│   │   ├── auth/               # AuthModal (Google, Email, Guest Agent)
│   │   ├── layout/             # Header, Sidebar, MobileNav, Layout
│   │   ├── quest/              # QuestCard, CreateQuestModal, DetailModal
│   │   ├── rpg/                # AttributeGrid, CharacterAvatar, BossRaid
│   │   ├── ui/                 # Button, Card, Badge, Modal, StatBar
│   │   └── world/              # WorldMap (Interactive SVG topology)
│   ├── context/                # React context providers
│   │   ├── AuthContext.tsx     # Firebase session management & binding
│   │   ├── GameStateContext.tsx# Reactive state hook & actions
│   │   └── SoundContext.tsx    # Sensory Web Audio API wrapper
│   ├── data/                   # Initial seeds, regional coordinates, mock data
│   ├── hooks/                  # Custom hooks (useGameState, useAudio)
│   ├── lib/                    # Firebase app, auth, db, analytics init
│   ├── pages/                  # Page route views
│   ├── services/               # Core services
│   │   ├── audioService.ts     # Procedural synthesizer sound engine
│   │   ├── gameService.ts      # Polynomial XP curve, CRUD, Firestore sync
│   │   └── oracleService.ts    # Oracle AI telemetry & diagnostic engine
│   ├── types/                  # Strict TypeScript interfaces & types
│   ├── App.tsx                 # Root application wrapper
│   ├── index.css               # Obsidian Cyberpunk CSS design system
│   ├── main.tsx                # DOM entry point
│   └── router.tsx              # TanStack type-safe router
├── .env.example                # Environment variable template
├── firestore.rules             # Cloud Firestore user isolation rules
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript strict configuration
└── vite.config.ts              # Vite bundler configuration
```

---

## 🛡️ Hackathon Compliance Verification

| Requirement | Implementation Details | Verified Status |
| :--- | :--- | :---: |
| **User Authentication** | Firebase Auth (Google OAuth, Email/Password, Guest Mode) | ✅ PASSED |
| **Cloud Persistence** | Cloud Firestore document store (`/users/{uid}`) survives page refresh | ✅ PASSED |
| **Full Quest CRUD** | Create, Read, Update, and Delete actions with tactile feedback | ✅ PASSED |
| **RPG Progression** | Non-linear polynomial leveling ($1250 \times \text{level}^{1.32}$) | ✅ PASSED |
| **Gamified Elements** | Daily Streaks, 6 Attributes, Gold Economy, Boss Raids, Armory | ✅ PASSED |
| **UI/UX Polish** | Obsidian dark cyberpunk aesthetic, spring animations, zero generic UI | ✅ PASSED |
| **Accessibility** | Complete keyboard navigation (`1-8`, `Q`, `M`, `?`, `Tab`, `Enter`) | ✅ PASSED |
| **Clean Repo** | Chronological commit history, `.env` strictly protected | ✅ PASSED |

---

<div align="center">
  <sub>Built with ⚡ for Tech Zephyr 4.0 by <b>Team IQ100</b></sub>
</div>
