---
name: Grand Raya Hotel
description: Minimal, professional hotel management system with invisible utility and modern UX
colors:
  primary: "#1f3d2e"
  primary-foreground: "#f8f5ee"
  secondary: "#f1efe8"
  secondary-foreground: "#2b1a10"
  background: "#f8f5ee"
  foreground: "#2b1a10"
  muted: "#f1efe8"
  muted-foreground: "#8a7d6f"
  accent: "#1f3d2e"
  accent-foreground: "#f8f5ee"
  destructive: "#c44025"
  border: "#e6e2d9"
  input: "#e6e2d9"
  ring: "#1f3d2e"
  card: "#fdfcf9"
  card-foreground: "#2b1a10"
  popover: "#fdfcf9"
  popover-foreground: "#2b1a10"
  chart-1: "#1f3d2e"
  chart-2: "#8a7d6f"
  chart-3: "#2b1a10"
  chart-4: "#c9b99a"
  chart-5: "#5a4d40"
  sidebar: "#fdfcf9"
  sidebar-foreground: "#2b1a10"
  sidebar-primary: "#1f3d2e"
  sidebar-primary-foreground: "#f8f5ee"
  sidebar-accent: "#f1efe8"
  sidebar-accent-foreground: "#2b1a10"
  sidebar-border: "#e6e2d9"
  sidebar-ring: "#1f3d2e"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 20px"
  button-primary-hover:
    backgroundColor: "color-mix(in oklch, var(--primary) 80%, transparent)"
    textColor: "{colors.primary-foreground}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px 20px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    padding: "16px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
---

# Design System: Grand Raya Hotel

## 1. Overview

**Creative North Star: "The Modern Ledger"**

A system built on the principle of invisible utility — every element exists to serve a workflow, never to decorate. The interface recedes, letting the work take focus. Clean lines, generous whitespace, and restrained color create an environment of professional calm where staff operate with confidence and guests feel guided, not overwhelmed.

This system explicitly rejects the cluttered, enterprise-heavy aesthetic of legacy PMS software (Cloudbeds, Hotelogix) and the generic SaaS template feel. No hero-metric cards, no gradient accents, no cramped layouts with 50 visible options. The modern ledger is sharp, fast, and contemporary — it looks like it was designed by people who actually use hotel management tools.

**Key Characteristics:**
- Invisible utility — components serve function, never decoration
- Generous whitespace and clear hierarchy
- Restrained color palette: deep navy-green as the only accent
- Fraunces serif for headings, DM Sans for body — warm yet efficient
- Zero shadows, pure tonal layering for depth
- Consistent patterns across guest and staff surfaces

## 2. Colors

A restrained palette anchored by a deep navy-green primary, warm near-white backgrounds, and warm neutral accents. Color carries identity but never dominates.

### Primary
- **Deep Navy** (#1f3d2e / oklch(0.32 0.06 155)): The anchor color. Used for primary actions, navigation accents, headings, and focus states. Deep, grounded, and professional — a single saturated hue that does all the brand work.

### Neutral
- **Warm Parchment** (#f8f5ee / oklch(0.973 0.006 85)): The primary background. A true warm off-white with slight golden undertone — not cream, not sand, just the quiet surface everything sits on.
- **Soft Linen** (#f1efe8 / oklch(0.945 0.008 80)): Secondary backgrounds, muted surfaces, sidebar accents. Slightly more saturated than parchment for subtle hierarchy.
- **Warm Stone** (#e6e2d9 / oklch(0.90 0.008 80)): Borders, dividers, input strokes. The line that separates.
- **Quiet Taupe** (#8a7d6f / oklch(0.56 0.01 75)): Muted text, secondary labels, descriptions. Always with sufficient contrast against light backgrounds.
- **Deep Umber** (#2b1a10 / oklch(0.17 0.01 60)): Primary text, headings, foreground. Near-black with warm undertone — never pure black.

### Named Rules
**The One Accent Rule.** Deep Navy is the only saturated color on any screen. Its restraint is the point. Everything else is neutral, warm, or structural.

## 3. Typography

**Display Font:** Fraunces (with Georgia, serif fallback)
**Body Font:** DM Sans (with system-ui, sans-serif fallback)

**Character:** The pairing contrasts organic serif warmth (Fraunces) with geometric sans efficiency (DM Sans). It says "boutique hotel" without saying "luxury resort" — refined but not precious.

### Hierarchy
- **Display** (400 weight, clamp(2.5rem, 6vw, 4.5rem), line-height 1.1): Hero headlines only. The one moment where type is large and deliberate.
- **Headline** (400 weight, clamp(1.75rem, 4vw, 2.5rem), line-height 1.2): Section headings, page titles. Clear hierarchy without shouting.
- **Title** (500 weight, 1.25rem, line-height 1.3): Card titles, subsection headings. Where Fraunces meets DM Sans in weight.
- **Body** (400 weight, 1rem, line-height 1.6): All readable content. Max line length 65–75ch for comfortable reading.
- **Label** (500 weight, 0.75rem, letter-spacing 0.05em): Buttons, navigation, form labels. Where DM Sans carries the functional load.

### Named Rules
**The No-Gradient-Text Rule.** Typography is always a solid color. No `background-clip: text`, no gradient fills. Emphasis through weight, size, and color only.

## 4. Elevation

This system uses no shadows. Depth is conveyed entirely through tonal layering — background color shifts, border treatments, and spatial relationships between elements. Surfaces are flat at rest, flat on hover, flat always. The only structural depth comes from intentional whitespace and color contrast between nested elements.

### Shadow Vocabulary
None. The system is shadow-free by design.

### Named Rules
**The Flat-By-Default Rule.** Surfaces never lift. No `box-shadow`, no `drop-shadow`, no `backdrop-filter` blur. Depth comes from color hierarchy alone. If it looks like it's floating, it's wrong.

## 5. Components

Components are built on shadcn/ui primitives with Tailwind CSS. They follow the "invisible utility" philosophy — serving function without drawing attention to themselves.

### Buttons
- **Shape:** Gently curved (8px radius)
- **Primary:** Deep Navy background, warm parchment text, 8px 20px padding. The single accent moment on any screen.
- **Hover / Focus:** Background lightens to 80% opacity via `color-mix`. Focus ring in primary color at 50% opacity.
- **Secondary:** Transparent background, foreground text, border in warm stone.
- **Ghost:** No border, no background at rest. Subtle linen wash on hover.

### Cards
- **Corner Style:** 12px radius
- **Background:** Card surface (near-white, slightly warmer than background)
- **Shadow Strategy:** None. Defined by ring-1 stroke at 10% foreground opacity.
- **Border:** Implicit via ring. Footer sections get explicit border-top.
- **Internal Padding:** 16px standard, 12px compact

### Inputs
- **Style:** Transparent background, warm stone border, 8px radius
- **Focus:** Border shifts to primary color with 50% opacity ring
- **Error:** Destructive border with 20% opacity ring
- **Disabled:** 50% opacity, pointer-events-none

### Navigation
- **Style:** Horizontal on guest surfaces, sidebar on staff surfaces
- **Typography:** DM Sans 500 weight, 12px, uppercase with 0.05em tracking on guest nav
- **Active:** Deep Navy foreground
- **Hover:** Subtle linen wash
- **Mobile:** Standard responsive collapse

## 6. Do's and Don'ts

### Do:
- **Do** use Deep Navy as the sole accent color on any given screen. Its rarity creates focus.
- **Do** use generous whitespace — let content breathe. The system is defined by what's NOT there.
- **Do** keep typography solid-colored. No gradients, no decorative text effects.
- **Do** use tonal layering (background color shifts) instead of shadows for depth.
- **Do** maintain warm, near-black text (#2b1a10) for all body copy. Never pure black (#000).
- **Do** use Fraunces for headings and DM Sans for body — the pairing carries the boutique identity.

### Don't:
- **Don't** use generic PMS aesthetics: cramped layouts, tiny fonts, enterprise-heavy dashboards with 50 visible options.
- **Don't** use gradient text (`background-clip: text`). It's decorative, never meaningful.
- **Don't** add box shadows to any element. Depth comes from color and spacing only.
- **Don't** use hero-metric templates (big number, small label, supporting stats, gradient accent).
- **Don't** use identical card grids with icon + heading + text repeated endlessly.
- **Don't** use the tiny uppercase tracked eyebrow pattern ("ABOUT", "PROCESS", "PRICING") above every section.
- **Don't** use numbered section markers (01 / 02 / 03) as default scaffolding.
- **Don't** add glassmorphism, backdrop-filter blur, or decorative blur effects.
