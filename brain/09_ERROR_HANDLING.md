# 09 // ERROR HANDLING & RESILIENCE SPECIFICATION

## 1. CLIENT-SIDE DEFENSIVE PATTERNS
- **Audio Context Resilience:** Browsers block audio playback until user interaction occurs. The `AudioService` lazily initializes or resumes its `AudioContext` inside user click handlers rather than throwing uncaught DOM exceptions at page load.
- **Empty & Degraded States:** Every view contains dedicated fallback components for zero-quest states, search misses, and missing loadouts.
- **Input Validation:** The Quest Forge modal enforces minimum title lengths, positive time estimates, and sanitized tag strings.

## 2. API & NETWORK ERROR RECOVERY (FUTURE BACKEND)
- **Standardized Error Envelope:**
  ```json
  {
    "error": {
      "code": "INSUFFICIENT_FUNDS",
      "message": "Player does not possess adequate gold for this transaction.",
      "details": { "required": 1500, "current": 840 }
    }
  }
  ```
- **Optimistic UI Rollbacks:** If a quest completion or purchase fails on the network tier, the client reverses the optimistic XP/gold addition and displays a non-blocking toast warning.
