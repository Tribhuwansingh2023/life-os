# 05 // DATA SOURCES & SEED ARCHITECTURE

## 1. PRIMARY SEED DATA SOURCE
In this frontend-first prototype, all initial state is seeded in `src/data/mockData.ts` based on real human behavioral benchmarks:
- **Player Call Sign:** `TRIBHUWAN` (Level 17, Quantum Architect, 14-day unbroken streak, 88% momentum).
- **Quest Roster:** 6 active quests spanning multiple categories (Strength hypertrophy session, Distributed systems whitepaper study, 90-minute focus sprint, Creative typography design, Hydration & deep sleep protocol, Weekly engineering sync).
- **World Biosystems:** 5 distinct geopolitical biomes mapped directly to life domains (Iron Citadel, Chrono Archive, Cybernetic Nexus, Neon Spire, Aether Haven).
- **Boss Entity:** Chronos the Procrastinator (3,400 / 5,000 HP remaining).

## 2. HARDWARE & BROWSER DATA SOURCES
- **Web Audio API Context:** Audio synthesis hardware on client devices.
- **Client Window Telemetry:** Viewport geometry via ResizeObserver and standard matchMedia for responsive bento-grid re-layout.
- **Keyboard Event Stream:** Document-level keydown listeners mapping numeric and alphabetic hotkeys.

## 3. FUTURE INTEGRATIONS (ROADMAP)
- **Health & Wearables API:** Apple HealthKit / Google Health Connect for passive physical attribute verification.
- **GitHub GraphQL API:** Automated commit and PR merging verification for Intellect / Discipline quest progression.
- **Calendar & Task Sync:** Google Workspace Calendar / Todoist import pipelines.
