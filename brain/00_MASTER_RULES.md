# 00 // MASTER RULES & HACKATHON PROTOCOLS

## 1. PROJECT IDENTITY & SCOPE
- **Product:** LIFE//OS
- **Brand Tagline:** *Turn progress into a world worth returning to.*
- **Phase:** Frontend-First Architecture (UI/UX, Visual System, Living Topology, Service Boundaries).
- **Hackathon Context:** Tech Zephyr Life RPG Hackathon (5,000+ teams competition tier).

---

## 2. GOVERNING PRINCIPLES & COMPLIANCE

### Rule 01: Coherence Between Source Code and Documentation
- Every screen, data interface, and service contract in `/src` must have a 1:1 conceptual mapping in `/brain/`.
- If an architectural shift occurs, the corresponding brain module must be updated immediately.

### Rule 02: Zero Fake Persistence in Production
- **Mandate:** `localStorage` is **strictly forbidden** as the primary persistence mechanism in production.
- For this Frontend-First stage, realistic in-memory observable services (`src/services/gameService.ts`) manage local demo state.
- Real persistence is formally defined in `03_ARCHITECTURE.md`, `04_DATA_MODEL.md`, and `07_API_CONTRACT.md` for the database integration phase (PostgreSQL/Supabase/Cloud SQL or Firestore).

### Rule 03: Accessible and Responsive by Default
- The application must support desktop-first command ergonomics while scaling down gracefully to mobile viewport devices (compact bottom navigation, responsive bento grids).
- Full keyboard navigation supported: `Tab`, `Enter`, numeric hotkeys (`1-8`), `Q` (Forge Quest), `M` (Audio toggle), and `?` (Hotkeys modal).

### Rule 04: Zero Unsolicited "AI Slop"
- No default enterprise SaaS styling, generic purple-blue gradients, or card-soup layouts.
- Interface aesthetic strictly adheres to Obsidian Dark Cyberpunk/RPG ergonomics (`#07090e` base, subtle cyan/violet glows, mathematical typography hierarchy, procedural Web Audio synthesis).

### Rule 05: Server-Side Validation for Economy & Progression (Future Handover)
- In production, all XP calculation, level-up thresholds, and anti-cheat checks must occur server-side.
- The formula: `Math.floor(1250 * Math.pow(level, 1.32))` ensures a strictly non-linear polynomial progression curve.

### Rule 06: Ethical AI & Code Disclosure
- All AI master-master features (Oracle) must provide actionable, transparent telemetry rationales rather than black-box chatter.
- Third-party packages and Web APIs (e.g. Web Audio API, Canvas Confetti) are declared and documented in `package.json` and `02_TRD.md`.

### Rule 07: Non-Destructive State Transitions
- State transitions (quest completions, inventory equipment, level ascensions) must trigger optimistic UI updates accompanied by tactile audio and visual feedback.

### Rule 08: Hackathon Reference Material Assumption
- The two referenced hackathon PDFs (*Tech Zephyr Life RPG problem statement* and *WEB HACKATHON rulebook*) were not present in the workspace file mount at build time.
- All architectural decisions follow the comprehensive specifications in the prompt. If the original PDFs become available in later stages, they must be audited prior to final submission.

