# 07 // API CONTRACT (FUTURE BACKEND HANDOVER)

## 1. PROTOCOL OVERVIEW
All future endpoints follow RESTful conventions over JSON with Bearer JWT authentication. All mutation endpoints perform server-side verification of player level and attribute bounds.

## 2. CORE ENDPOINT MATRIX

### Quests
- `GET /api/v1/quests`
  - Returns array of `Quest` entities for the authenticated player.
- `POST /api/v1/quests`
  - Body: `{ title, description, category, type, difficulty, estimatedMinutes, dnaTags }`
  - Response: Created `Quest` with calculated `xpReward` and `goldReward`.
- `POST /api/v1/quests/:id/complete`
  - Executes quest completion, returns updated `player` profile, attribute deltas, boss damage event, and potential `levelUp` payload.

### Character & Attributes
- `GET /api/v1/player/profile`
  - Returns complete `PlayerProfile` and 6 `AttributeInfo` records.
- `PATCH /api/v1/player/profile`
  - Body: `{ username, avatarUrl }`

### World Topology
- `GET /api/v1/world/regions`
  - Returns all 5 `WorldRegion` objects with computed influence scores.

### Oracle AI Master
- `POST /api/v1/oracle/diagnose`
  - Proxies to Google Gemini API (`@google/genai`) using server-side secret key `process.env.GEMINI_API_KEY`.
  - Body: `{ currentAttributes, recentCompletions, momentum }`
  - Returns `OracleInsight` (coreDiagnosis, statusHeadline, recommendedQuestId, balanceAlert, tacticalTip).

### Armory & Inventory
- `POST /api/v1/inventory/:itemId/purchase`
  - Verifies gold balance, decrements currency, grants item.
- `POST /api/v1/inventory/:itemId/equip`
  - Equips/unequips item and applies passive stat modifiers.
