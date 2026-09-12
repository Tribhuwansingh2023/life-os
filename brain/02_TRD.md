# 02 // TECHNICAL REQUIREMENTS DOCUMENT (TRD)

## 1. TECH STACK & SPECIFICATIONS
- **Language:** TypeScript 5.6+ with strict type checking.
- **Frontend Framework:** React 19 with Vite 6.
- **Styling Architecture:** Tailwind CSS with native CSS variables for dynamic neon glows, cyber grid overlays, and obsidian palettes.
- **Animation & Micro-interactions:** `motion/react` for smooth enter transitions, layout shifts, and modal backdrops.
- **Sound Generation:** Web Audio API (zero external `.mp3` or `.wav` dependencies; fully synthesized procedural frequencies via OscillatorNode + GainNode).
- **Icons:** `lucide-react`.

## 2. CLIENT PERFORMANCE TARGETS
- **Time to Interactive (TTI):** < 400ms on desktop and modern mobile browsers.
- **First Contentful Paint (FCP):** < 250ms.
- **Bundle Footprint:** Minimal third-party bloat; SVG and mathematical rendering prioritized over heavy raster graphics.
- **Accessibility:** Minimum WCAG AA color contrast, semantic buttons, keyboard traps in modals, and full hotkey matrix.

## 3. COMPONENT INVENTORY
- **UI Primitives:** `Button`, `Badge`, `Card`, `Modal`, `StatProgressBar`.
- **RPG Domain Components:** `CharacterCard`, `AttributeGrid`, `MomentumMeter`, `BossRaidBanner`, `LevelUpModal`.
- **Quest Components:** `QuestCard`, `QuestDetailModal`, `CreateQuestModal`.
- **World Topology:** `WorldMap` (Interactive SVG with responsive hover/active biomes).
- **Layout:** `Sidebar`, `Header`, `MobileNav`, `ShortcutsModal`.
