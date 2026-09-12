# 03 // SYSTEM ARCHITECTURE & INTEGRATION BOUNDARIES

## 1. HIGH-LEVEL ARCHITECTURE (FRONTEND-FIRST PHASE)
```
+-------------------------------------------------------------------+
|                           CLIENT TIER                             |
|                                                                   |
|   +-----------------------+     +-------------------------------+ |
|   |   React 19 Views      |     |       UI Primitives           | |
|   |  - Dashboard (Command)|     |  - Button, Badge, Modal       | |
|   |  - Quest Matrix       |     |  - StatProgressBar, Card      | |
|   |  - World Topology     |     +-------------------------------+ |
|   |  - Character & Build  |                                       |
|   |  - Oracle AI Master   |     +-------------------------------+ |
|   |  - Chrono Replay      |     |      Sensory Audio Engine     | |
|   |  - Armory & Rewards   |     |   (Web Audio API Synthesizer) | |
|   +-----------+-----------+     +-------------------------------+ |
|               |                                                   |
|               v                                                   |
|   +-----------------------+     +-------------------------------+ |
|   |    useGameState()     | <-> |       gameService.ts          | |
|   |     (Custom Hook)     |     |  - In-Memory Observable Store | |
|   +-----------------------+     |  - Polynomial XP Curve        | |
|                                 |  - Boss HP Computation        | |
|                                 +---------------+---------------+ |
|                                                 |                 |
+-------------------------------------------------|-----------------+
                                                  |
           [DEFERRED TO BACKEND PHASE]            v
+-------------------------------------------------------------------+
|                      PROPOSED BACKEND TIER                        |
|                                                                   |
|   +-----------------------+     +-------------------------------+ |
|   |   Express / Node.js   | <-> |       PostgreSQL Database     | |
|   |   /api/quests         |     |   - players, quests, stats    | |
|   |   /api/character      |     |   - territory_influence       | |
|   |   /api/oracle         |     |   - replay_telemetry          | |
|   +-----------+-----------+     +-------------------------------+ |
|               |                                                   |
|               v                                                   |
|   +-----------------------+                                       |
|   | Google Gemini 2.5 SDK |                                       |
|   | (@google/genai proxy) |                                       |
|   +-----------------------+                                       |
+-------------------------------------------------------------------+
```

## 2. SERVICE/REPOSITORY BOUNDARY CONTRACT
All UI components strictly interact through `src/services/gameService.ts` and `src/services/oracleService.ts`. No component queries raw storage or mutates state directly.
When the Express/PostgreSQL backend is attached, `gameService.ts` methods will simply swap out the in-memory array operations for `fetch('/api/...')` REST calls without requiring any modifications to the React UI component layer.
