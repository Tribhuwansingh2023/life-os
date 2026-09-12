# LIFE//OS — The AI-Powered Life RPG

> Turn real-world goals into quests, progression, rewards, and a living RPG system.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth+Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

---

## 🏆 Tech Zephyr 4.0 — Problem Statement: Life RPG

**Team:** IQ100

| Name | Role |
|---|---|
| **Tribhuwan Singh** *(Lead)* | Architecture, Firebase integration, state engine |
| **Paresh Sahoo** | RPG progression engine, quest logic |
| **Rishika Priyanka Mohanty** | UI/UX design, design system, accessibility |
| **Md Waiz Alam** | Audio synthesis, world topology, frontend |

---

## What is LIFE//OS?

Traditional productivity apps feel like chores — real-world benefits of habits and learning take months to show. Video games work because they provide immediate feedback: XP bars, rewards, and clear progression. **LIFE//OS** brings those mechanics to real life.

Every goal you complete earns XP, attributes, gold, and expands a living world map shaped by your consistency across six real-life dimensions.

**Problem → Solution → Difference**
- **Problem:** Delayed gratification in productivity tools kills long-term motivation.
- **Solution:** Real-world actions map to quests that reward XP, attributes, and territory influence.
- **Difference:** Six attribute pillars, a dynamic world biosystem, procedural audio, and persistent cloud state.

---

## 🎮 Demo

| | |
|---|---|
| **Live Demo** | *(deploy URL)* |
| **Demo Video** | *(video URL)* |

**Suggested screenshots:**
1. Command Center dashboard
2. Quest Matrix
3. World Biosystem Map
4. Oracle Game Master
5. Character & Armory

---

## ✨ Features

| Feature | Description |
|---|---|
| **Quest Matrix** | Create, view, edit, and complete real-world quests with tiers, tags, and categories |
| **RPG Progression** | Non-linear XP curve (`⌊1250 × level^1.32⌋`), streaks, momentum, and gold economy |
| **6 Attribute Pillars** | Strength, Intellect, Discipline, Creativity, Wellness, Social |
| **World Biosystem Map** | 6 territories that evolve as you complete quests |
| **Oracle Game Master** | Algorithmic diagnostic engine analyzing attribute balance and recommending next actions |
| **Armory & Rewards** | Spend earned gold on relics and equipment with passive stat bonuses |
| **Cloud Persistence** | Firebase Auth + Firestore — state survives page refresh and works across devices |
| **Procedural Audio** | Web Audio API synthesizes tactile feedback — no audio file downloads |
| **Multi-Profile** | Multiple named character profiles under one account |
| **Weekly Replay** | 7-day progress debrief with attribute telemetry |

### 🗺️ World Territories

Six regions evolve from Locked → Discovered → Active → Mastered based on quest activity:

| Region | Attribute | Landmark |
|---|---|---|
| **The Citadel** | Strength | The Basalt Bastion |
| **The Archive** | Intellect | The Great Crystal Library |
| **The Foundry** | Creativity | The Prismatic Plasma Spire |
| **The Grove** | Wellness | The Celestial Ancient Grove |
| **The Agora** | Social | The Sunken Colosseum Forum |
| **The Nexus** | Discipline | The Chrono Meridian Spire |

### 🔮 Oracle Game Master

The Oracle analyzes your live game state — attribute values, active quests, streak momentum, and completions — to produce:
- A recommended quest targeting your weakest attribute
- Imbalance diagnostics (e.g. high Intellect but neglected Wellness)
- Alternative strategic moves with explanations

> **Note:** The Oracle uses deterministic algorithmic analysis of your game state. The `@google/genai` package is included as a dependency for planned Gemini integration.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | TanStack React Router |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| Animation | Framer Motion + Canvas Confetti |
| Audio | Web Audio API |
| Charts | Recharts |
| Icons | Lucide React |

---

## 🏗️ Architecture

```
User
  ↓
React + TypeScript (Vite)
  ↓
Application State  ←→  Services (gameService, oracleService, audioService)
  ↓
Firebase Authentication + Cloud Firestore
  ↓
/users/{uid}/  ←  player profile, quests, inventory, replay subcollections
```

Detailed architecture documentation is in [`/brain`](./brain/).

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) ≥ 18
- npm

### Install
```bash
git clone https://github.com/Tribhuwansingh2023/life-os.git
cd life-os
npm install
```

### Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Firebase (required for auth + persistence)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_FIREBASE_DATABASE_ID=(default)

# Gemini (for planned AI Oracle features)
GEMINI_API_KEY=
```

### Run
```bash
npm run dev
# → http://localhost:3000
```

---

## 🔐 Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** — Google Sign-In and Email/Password
3. Create a **Firestore** database
4. Copy your config values into `.env`
5. The `firestore.rules` file enforces user-level data isolation

---

## 🛡️ Security

- Authentication required to read or write user data
- Firestore rules isolate each user's documents under `/users/{uid}`
- `.env` is gitignored — credentials are never committed
- Guest access is session-scoped only

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|:---:|---|
| `1` | Command Center |
| `2` | Quest Matrix |
| `3` | Character & Build |
| `4` | World Map |
| `5` | Oracle Game Master |
| `6` | Weekly Replay |
| `7` | Armory & Inventory |
| `8` | System Settings |
| `Q` | Open Create Quest modal |
| `M` | Toggle audio |
| `?` | Show shortcuts |
| `Esc` | Close modal |

---

## 📂 Project Structure

```
life-os/
├── brain/                  # Architecture & design documentation
│   ├── 00_MASTER_RULES.md
│   ├── 01_PRD.md
│   ├── 02_TRD.md
│   ├── 03_ARCHITECTURE.md
│   ├── 04_DATA_MODEL.md
│   └── 10_SECURITY.md
├── src/
│   ├── components/         # auth, layout, quest, rpg, ui, world
│   ├── context/            # AuthContext, GameStateContext, SoundContext
│   ├── data/               # Seed data, world region configs
│   ├── hooks/              # useGameState
│   ├── lib/                # Firebase initialization
│   ├── pages/              # Route-level page components
│   ├── services/           # gameService, oracleService, audioService, firestoreService
│   ├── types/              # TypeScript interfaces
│   ├── App.tsx
│   ├── router.tsx
│   └── index.css
├── firestore.rules
├── .env.example
└── package.json
```

---

## 🏆 Hackathon Alignment

**Tech Zephyr 4.0 — Problem Statement: Life RPG**

| Requirement | Implementation |
|---|---|
| User Authentication | Firebase Auth — Google, Email/Password, Guest |
| Cloud Persistence | Firestore per-user document store (`/users/{uid}`) |
| Full CRUD | Quest create, read, update, delete |
| RPG Progression | XP curve, levels, attributes, streaks, gold |
| Gamification | World map, boss raids, armory, momentum, streaks |
| Responsive UI | Mobile nav + desktop sidebar, all breakpoints |
| Accessibility | Full keyboard navigation (1–8, Q, M, ?, Esc), ARIA roles |

---

## 🗺️ Roadmap

- [ ] Live Gemini AI recommendations in the Oracle
- [ ] World events and boss raid seasons
- [ ] Social / guild features
- [ ] PWA / mobile app
- [ ] Advanced analytics and replay export

---

## 📄 License

[MIT](./LICENSE) © 2026 Tribhuwan Singh

---

<div align="center">
  <sub>Built with ⚡ for Tech Zephyr 4.0 by <b>Team IQ100</b></sub>
</div>
