<div align="center">

# ⚡ LIFE//OS — The AI-Powered Life RPG

> **Turn real-life progress into a world worth returning to.**  
> *A tactile futuristic Life RPG built with React 19, TypeScript, Firebase, & Web Audio.*

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](./LICENSE)

[**🌐 Live Application**](https://life-os-chi-jade.vercel.app/) &bull; [**📹 Product Video**](https://drive.google.com/file/d/1nGegUe3Bqsw-lEzK1x1DNCtGDwHFwb6m/view?usp=sharing)

</div>

---

## 🏆 Tech Zephyr 4.0 — Team IQ100

| Contributor | Focus Area |
| :--- | :--- |
| **Tribhuwan Singh** *(Lead)* | System Architecture, Cloud Firestore Engine, Firebase Integration |
| **Paresh Sahoo** | RPG Game Engine, Quest Lifecycle & Level Math |
| **Rishika Priyanka Mohanty** | System Research, User Experience & Presentation |
| **Md Waiz Alam** | Procedural Web Audio API, World Biome Topology, Interface UI |

---

## 💡 Overview & Problem Statement

Traditional habit trackers fail because real-world benefits take months to materialize. Games capture attention because they offer **immediate feedback**: XP gain, leveling up, and visual progress.

**LIFE//OS** bridges real-world productivity with RPG mechanics. Every goal you complete converts into character experience, attribute growth, treasury gold, and dynamic territory influence across a living world map.

```
Real-World Action ──► Quest Resolution ──► XP + Gold + Stat Gain ──► World Map Evolution
```

### Key Pillars

1. **Non-Punitive Progression**: Zero destructive streak resets; consistency unlocks compounding momentum multipliers.
2. **6 Core Attributes**: `Strength`, `Intellect`, `Discipline`, `Creativity`, `Wellness`, and `Social`.
3. **Oracle Diagnostic Master**: Algorithmic state analysis that detects attribute imbalances and recommends high-leverage next moves.
4. **Zero-Latency Audio**: Synthesized tactile audio feedback powered by the browser's native Web Audio API.

---

## ✨ Features

- 🗡️ **Quest Matrix**: Full CRUD quest workflow with difficulty tiers (`E` to `S`), time estimates, tags, and attribute gains.
- ⚡ **RPG Progression Engine**: Non-linear level curve (`⌊1250 × level^1.32⌋`), XP bar, momentum percentage, and gold economy.
- 🗺️ **World Biosystem**: 6 reactive territories that evolve from *Locked* to *Mastered* based on real activity.
- 🔮 **Oracle Game Master**: Live diagnostic engine analyzing attribute balance, streak health, and optimal next actions.
- 🛡️ **Armory & Relics**: In-game shop to unlock artifacts and equipment offering passive stat modifiers.
- ☁️ **Cloud Synchronization**: Real-time multi-device sync backed by Firebase Auth and Cloud Firestore.
- 👤 **Multi-Profile System**: Manage multiple named operator character builds under one account.
- 📊 **Weekly Replay**: 7-day telemetry debrief with visual attribute gains and completion analytics.

---

## 🗺️ World Territories

| Region | Attribute Pillar | Landmark |
| :--- | :--- | :--- |
| **The Citadel** | Strength | The Basalt Bastion |
| **The Archive** | Intellect | The Great Crystal Library |
| **The Foundry** | Creativity | The Prismatic Plasma Spire |
| **The Grove** | Wellness | The Celestial Ancient Grove |
| **The Agora** | Social | The Sunken Colosseum Forum |
| **The Nexus** | Discipline | The Chrono Meridian Spire |

---

## 🛠️ Tech Stack & Architecture

```
                 ┌──────────────────────────────────────┐
                 │       React 19 + TypeScript          │
                 │      (TanStack Router + Vite)        │
                 └──────────────────┬───────────────────┘
                                    │
               ┌────────────────────┴────────────────────┐
               │         Application State Layer         │
               │   (GameStateContext, AuthContext, etc.) │
               └──────────┬───────────────────┬──────────┘
                          │                   │
   ┌──────────────────────▼──┐             ┌──▼──────────────────────┐
   │ Firebase Auth & Firestore │             │ Web Audio API Synthesizer│
   │ (/users/{uid} documents)│             │  (Tactile sound engine) │
   └─────────────────────────┘             └─────────────────────────┘
```

| Domain | Technology |
| :--- | :--- |
| **Core Framework** | React 19, TypeScript 5.8 |
| **Build & Bundler** | Vite 6.2 |
| **Styling & Layout** | Tailwind CSS v4, Lucide React Icons |
| **Routing** | TanStack React Router |
| **Authentication** | Firebase Auth (Google OAuth, Email/Password, Guest Mode) |
| **Database** | Cloud Firestore |
| **Animations** | Framer Motion, Canvas Confetti |
| **Audio** | Custom Web Audio API Synthesizer |
| **Charts & Data** | Recharts |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0

### 1. Clone & Install
```bash
git clone https://github.com/Tribhuwansingh2023/life-os.git
cd life-os
npm install
```

### 2. Configure Environment
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Add your Firebase configuration keys:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⌨️ Hotkeys & Navigation

| Key | Action |
| :---: | :--- |
| `1` | Command Center |
| `2` | Quest Matrix |
| `3` | Character & Build |
| `4` | World Biosystem Map |
| `5` | Oracle Game Master |
| `6` | Weekly Replay |
| `7` | Armory & Inventory |
| `8` | System Settings |
| `Q` | Open Create Quest Modal |
| `M` | Toggle Audio Engine |
| `?` | Keyboard Shortcuts Reference |
| `Esc` | Close Active Modal |

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

<div align="center">
  <sub>Built for <b>Tech Zephyr 4.0</b> by <b>Team IQ100</b></sub>
</div>
