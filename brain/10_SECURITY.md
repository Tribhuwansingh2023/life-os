# 10 // SECURITY & PRIVACY SPECIFICATION

## 1. FRONTEND SECURITY POSTURE
- **Zero Exposure of API Secrets:** The Gemini API key or any database credentials must never exist in client-side code or `VITE_` variables.
- **XSS Prevention:** React JSX prevents script injection by escaping string expressions. No `dangerouslySetInnerHTML` is used across the codebase.
- **Input Sanitization:** User-submitted quest titles and descriptions are sanitized to prevent markup injection.

## 2. SERVER-SIDE & AUTH HARMONIZATION (NEXT PHASE)
- **JWT Authentication:** Stateless, signed tokens stored in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
- **Rate Limiting:** Protect all `/api/v1/quests` and `/api/v1/oracle` endpoints using IP and token bucket algorithms (e.g. max 60 requests/minute per player).
- **Anti-Cheat Validation:** Level-up thresholds and XP gains are computed authoritatively on the server. Clients submit completed action payloads; the server computes resulting XP and issues level bumps.
