# 17 // ARCHITECTURAL DECISION RECORDS (ADR)

## ADR-001: Adoption of Frontend-First Delivery for Hackathon MVP
- **Context:** The hackathon rulebook emphasizes delivering a compelling, high-contrast, tactile RPG identity that stands out among 5,000+ teams.
- **Decision:** Build the complete frontend foundation first with realistic seeded data and clear service boundaries. Backend database persistence and authentication are intentionally deferred to ensure maximum UI polish, zero mock bugs, and rapid prototype demonstration.
- **Status:** ACCEPTED.

## ADR-002: Procedural Web Audio Synthesis vs Audio Assets
- **Context:** Loading static audio MP3s causes latency, network roundtrips, and asset 404 risks in sandboxed environments.
- **Decision:** Implement an in-memory procedural synthesizer using the browser's native `AudioContext`, generating micro-tuned sine waves and chords for tactile feedback.
- **Status:** ACCEPTED.

## ADR-003: Pure SVG / CSS World Map vs Heavy Canvas Engines
- **Context:** Using heavy game canvas engines (e.g. Phaser, Three.js) adds 500KB+ to the bundle and compromises screen reader accessibility.
- **Decision:** Render the world topology using an interactive, styled SVG vector map with responsive coordinate pinning and hover states.
- **Status:** ACCEPTED.

## ADR-004: In-Memory Observable Store vs Redux/Zustand
- **Context:** Avoid unnecessary library overhead for state management while maintaining clean subscription patterns.
- **Decision:** Implemented a singleton `GameService` using standard TypeScript listeners and a custom `useGameState` React hook.
- **Status:** ACCEPTED.
