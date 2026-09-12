# 13 // TESTING & VERIFICATION PROTOCOL

## 1. STATIC ANALYSIS
- **TypeScript Strict Checking:** `npm run lint` executes `tsc --noEmit` to verify type safety across all components, hooks, services, and models.

## 2. MANUAL VERIFICATION MATRIX
| Test Case | Procedure | Expected Outcome | Status |
|---|---|---|---|
| TC-01 | Click checkbox on active quest | Tactile chime sounds, XP increments, boss HP drops, quest moves to cleared log | PASS |
| TC-02 | Forge a new custom quest via modal | Inputs validate, quest appears immediately in active stack with correct XP/Gold | PASS |
| TC-03 | Accumulate XP exceeding Level 18 boundary | Level-up modal opens, fanfare chord plays, level increments to 18, stats bump | PASS |
| TC-04 | Navigate via numeric keys (1-8) | Screen switches instantaneously to matching tab | PASS |
| TC-05 | Click Mute button in header/sidebar | Synthesizer suppresses all audio output cleanly | PASS |
| TC-06 | Purchase item from Armory | Gold balance drops by item cost, item marked Acquired, equip toggle becomes active | PASS |
| TC-07 | Select different territory on World Map | Region inspector displays biospheric stats, influence %, and local quests | PASS |
| TC-08 | Click "Simulate Re-Diagnosis" in Oracle | Heuristic engine evaluates balance and outputs targeted strategy in ~600ms | PASS |
