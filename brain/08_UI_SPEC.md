# 08 // UI SPECIFICATION & DESIGN SYSTEM

## 1. COLOR PALETTE (OBSIDIAN CYBER-RPG)
- **Obsidian Base Canvas:** `#07090e`
- **Surface Elevation 1 (Cards, Panels):** `#0c1017` / `#090d14`
- **Surface Elevation 2 (Hover, Modals):** `#111724` / `#141d2e`
- **Primary Cyber Cyan:** `#00f0ff` (Glow: `rgba(0, 240, 255, 0.4)`)
- **Secondary Aether Violet:** `#8b5cf6` (Glow: `rgba(139, 92, 246, 0.4)`)
- **Accent Quest Amber / Gold:** `#f59e0b`
- **Combat Crimson / Boss Alert:** `#f43f5e`
- **Equilibrium Emerald:** `#10b981`

## 2. TYPOGRAPHY SYSTEM
- **Display & Monospace Elements:** JetBrains Mono / Space Grotesk (`font-mono`) for numerical values, level stats, quest tags, and system logs.
- **Body & Editorial Copy:** Plus Jakarta Sans / Inter (`font-sans`) with line-height 1.5 - 1.6 for comfortable readability.

## 3. MICRO-INTERACTION RULES
- **Button & Checkbox Click:** 40ms low-latency sine audio ping + 0.98 scale compress.
- **Quest Completion:** Upward flying celebration particles, attribute bar pulse, green status flash, and boss damage hit effect.
- **Level Up:** Full-screen celebratory modal with fanfare chord, stat point increment counters, and confetti blast.
- **Hover Transitions:** 150ms cubic-bezier ease with subtle neon border illumination.
