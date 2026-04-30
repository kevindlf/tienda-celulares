---
name: TechPhone
description: Tienda de celulares argentina — confiable, directa, sin vueltas.
colors:
  verde-mendocino: "#00704A"
  verde-sombra: "#005A3B"
  hoja-oscura: "#1E3932"
  verde-noche: "#11211C"
  bosque-profundo: "#182E27"
  blanco-limpio: "#FFFFFF"
  blanco-polvo: "#F9F9F9"
  gris-humo: "#E5E7EB"
  menta-tenue: "#D4E9E2"
typography:
  display:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(2rem, 5vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Syne, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  input: "12px"
  card: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.verde-mendocino}"
    textColor: "{colors.blanco-limpio}"
    rounded: "{rounded.full}"
    padding: "12px 28px"
  button-primary-hover:
    backgroundColor: "{colors.verde-sombra}"
    textColor: "{colors.blanco-limpio}"
    rounded: "{rounded.full}"
    padding: "12px 28px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.hoja-oscura}"
    rounded: "{rounded.full}"
    padding: "12px 28px"
  card:
    backgroundColor: "{colors.blanco-limpio}"
    rounded: "{rounded.card}"
    padding: "24px"
  input:
    backgroundColor: "{colors.blanco-limpio}"
    textColor: "{colors.hoja-oscura}"
    rounded: "{rounded.input}"
    padding: "12px 16px"
---

# Design System: TechPhone

## 1. Overview

**Creative North Star: "El Experto Local"**

TechPhone looks and feels like the store owner is standing right there: informed, direct, with prices that don't hide. No loading animation theater, no decorative gradients, no aspirational lifestyle copy. The interface is a knowledgeable intermediary between the customer and the product, and it gets out of the way.

The palette is grounded in a single deep forest green that signals trust without coldness. Surfaces are clean and light; the green appears only where it matters: the primary action, the price, the active state. Everything else is tinted neutral. Cards have a gentle hover elevation to confirm they're interactive, not to decorate.

Typography is a deliberate contrast: Syne for the moments that need authority (hero title, section headings, dashboard stats), DM Sans for everything the user reads or acts on. The pairing is confident without being loud.

This system explicitly rejects: the generic WooCommerce white-and-blue ecommerce default, the all-caps-serif luxury boutique, the SaaS startup gradient-hero, and the overcrowded marketplace grid. The interface should be impossible to mistake for any of those.

**Key Characteristics:**
- Single green accent, used sparingly, always meaningful
- Syne headlines, DM Sans body: authority + clarity
- Cards flat at rest, lightly lifted on hover
- Prices complete, never truncated, in tabular numerals
- Every touch target minimum 44px; layout starts at 375px

## 2. Colors: La Paleta del Experto

A restrained palette anchored by one deep green. The green is reserved; its rarity makes it effective.

### Primary
- **Verde Mendocino** (`#00704A`): The one accent. CTAs, prices, active nav states, positive data. Used on no more than 10% of any screen surface. Its restraint is its power.
- **Verde Sombra** (`#005A3B`): Pressed and hover state for primary elements only. Never used as a standalone surface color.

### Neutral
- **Hoja Oscura** (`#1E3932`): Primary foreground in light mode. Deep green-tinted near-black. Never a flat neutral gray.
- **Verde Noche** (`#11211C`): Dark mode background. Deep, slightly warm dark green. Pairs with Bosque Profundo as the card surface.
- **Bosque Profundo** (`#182E27`): Dark mode card surface. Slightly lighter than Verde Noche to create tonal layering without shadows.
- **Blanco Limpio** (`#FFFFFF`): Card surface in light mode. Never used as the page background.
- **Blanco Polvo** (`#F9F9F9`): Page background in light mode. Off-white, never pure white, prevents harshness.
- **Gris Humo** (`#E5E7EB`): Border and divider. Light and unobtrusive; the only gray in the palette.
- **Menta Tenue** (`#D4E9E2`): Accent fill for hover states, badges, chip backgrounds, subtle tints. Not a second brand color; a softened echo of the primary.

### Named Rules
**The One Signal Rule.** Verde Mendocino appears on primary buttons, active nav items, prices, and positive numbers. Nowhere else. Using it for decorative borders, section dividers, or inactive states dilutes the signal entirely.

**The No-Pure-Neutral Rule.** Every "gray" is tinted toward green. Hoja Oscura over slate-900, Menta Tenue over gray-100. The green hue runs through the whole system even where it's not visible as green.

## 3. Typography

**Display Font:** Syne (700, 800) — geometric, high-contrast, confidently angular.
**Body Font:** DM Sans (400, 500, 600, 700) — humanist geometric sans, clean at small sizes, works well for prices and labels.

**Character:** Syne commands attention in small doses; DM Sans carries everything else without ego. The contrast between them is intentional and should be maintained. Do not use Syne for body copy, form labels, or button text.

### Hierarchy
- **Display** (800, clamp(2rem, 5vw, 4.5rem), line-height 0.9, tracking -0.02em): Hero titles and campaign headings. Syne only.
- **Headline** (700, 1.5rem, line-height 1.2, tracking -0.01em): Section headings, page titles, dashboard H1s. Syne.
- **Title** (600, 1.125rem, line-height 1.4): Card titles, modal headings, sub-section labels. DM Sans.
- **Body** (400, 1rem, line-height 1.6): Product descriptions, helper text, email content. DM Sans. Max 65ch per line.
- **Label** (700, 0.75rem, line-height 1.2, tracking 0.08em): Badges, status chips, table column headers, uppercase category tags. DM Sans. Always uppercase when used as a category signal.

### Named Rules
**The Syne-is-Authority Rule.** Syne appears only where TechPhone is speaking with its own voice: the store name, page titles, hero headings, and large stat numbers. The moment Syne appears on a button or a form label, it stops being authority and becomes noise.

**The Tabular Price Rule.** All prices use `font-variant-numeric: tabular-nums`. No price ever truncates. A price with an ellipsis is a broken price.

## 4. Elevation

Flat at rest, subtly lifted on hover. The system does not use ambient shadows or decorative depth. Depth is earned through interaction.

Cards rest against the page background with only a border. On hover, a single shadow appears to confirm the element is interactive. This shadow is always directional-ambient: soft, spread, low opacity. Never dark, never dramatic.

### Shadow Vocabulary
- **Hover lift** (`0 8px 30px rgba(30, 57, 50, 0.1)`): Applied to cards and interactive surfaces on hover. Green-tinted shadow using Hoja Oscura as base, not pure black.
- **Primary glow** (`0 4px 14px rgba(0, 112, 74, 0.25)`): Applied to primary buttons at rest. Intensifies on hover to `0 6px 20px rgba(0, 112, 74, 0.35)`.
- **Focus ring** (`0 0 0 3px rgba(0, 112, 74, 0.12)`): Focus-visible state on inputs and interactive elements. Never a harsh outline.
- **Backdrop nav** (`backdrop-filter: blur(12px)`): Navbar only. Frosted glass effect on scroll is purposeful (indicates the layer below is content), not decorative.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as response to state: hover elevation on cards, glow on primary buttons, blur on the navbar. A shadow at rest is decoration; a shadow on hover is feedback.

## 5. Components

### Buttons
Rounded-full always. Full pill shape; no intermediate radii.

- **Shape:** Fully rounded pill (9999px). Never `rounded-lg` or `rounded-xl` for buttons.
- **Primary:** Verde Mendocino background, white text, DM Sans 600, `12px 28px` padding. Shadow glow at rest, intensified on hover with 1px upward translate.
- **Hover / Focus:** Background darkens to Verde Sombra. Translate -1px. Focus-visible ring: 3px spread, 12% primary opacity.
- **Ghost / Secondary:** Transparent background, Hoja Oscura text, Gris Humo border (1.5px). On hover: border shifts to Verde Mendocino, background fills with Menta Tenue.
- **Disabled:** 40% opacity, cursor not-allowed. No color shift.
- **Size variants:** Default `12px 28px`, Large `16px 40px` (checkout CTAs), Compact `8px 16px` (table actions, chips).

### Cards / Containers
- **Corner Style:** 16px radius (rounded-2xl). Product cards, info panels, dashboard sections all share this.
- **Background:** Blanco Limpio in light mode, Bosque Profundo in dark mode.
- **Shadow Strategy:** Flat at rest (border only), hover lift shadow on interactive cards.
- **Border:** 1px Gris Humo in light mode, 1px Hoja Oscura in dark mode.
- **Internal Padding:** `24px` for content cards, `16px` for compact dashboard cards.
- **Nested cards are banned.** A card inside a card is always wrong. Use spacing and borders to create hierarchy within a single card.

### Inputs / Fields
- **Style:** Blanco Limpio background, Gris Humo border (1.5px), 12px radius (rounded-xl).
- **Placeholder:** Hoja Oscura at 35% opacity.
- **Focus:** Border shifts to Verde Mendocino, focus ring `0 0 0 3px rgba(0, 112, 74, 0.12)`.
- **Error:** Border red, helper text below (never inside or above the field).
- **Minimum height:** 48px on mobile (touch target compliance).
- **Search inputs** get a Lucide Search icon inset left, padding-left adjusted accordingly.

### Navigation
- **Desktop:** Sticky top bar, 64px height, frosted glass background (`rgba(255,255,255,0.9)` + backdrop-blur-lg), Gris Humo bottom border. Logo left (Syne 800), links center (DM Sans 500), actions right.
- **Active state:** Link color shifts to Verde Mendocino. No underline, no background, no indicator bar.
- **Mobile:** Logo left, cart icon + theme toggle + hamburger right. Full-width dropdown panel on open, links at 48px minimum height.
- **Cart badge:** Verde Mendocino background, white text, -top-1 -right-1 position relative to the cart icon.
- **Theme toggle:** Sun/Moon icon, no label, rounded-full hover state with Menta Tenue background.

### Product Card (Signature Component)
The primary repeating unit of the catalog. Must be scannable at 160px wide (2-column mobile grid).

- Condition badge (NUEVO/USADO): Menta Tenue background, Verde Mendocino text, all-caps Label typography, rounded-full.
- Brand: Label style, Hoja Oscura at 50% opacity, uppercase.
- Name: Title style (600, 0.875rem), two lines max with proper wrapping (never truncate).
- Price: DM Sans 700, 1.0625rem, Verde Mendocino color, tabular-nums. The price is the most important element after the name.
- Stock: Label at 40% opacity when available; red badge when zero.
- Hover: 2px upward translate, hover-lift shadow.

### Status Badges / Chips
- Filter chips: DM Sans 600, 0.8125rem, Menta Tenue background at rest, Verde Mendocino background + white text when active. Rounded-full, `6px 14px` padding.
- Status badges (PAGADO, ENVIADO, etc.): Semantic color backgrounds at 15% opacity with matching text color. Never solid-filled status badges except for CANCELADO (red).

## 6. Do's and Don'ts

### Do:
- **Do** use Verde Mendocino exclusively for primary CTAs, active states, prices, and positive data. Never for decoration.
- **Do** write every price in full with tabular-nums. `$1.299.999` not `$1.29...` or `$1.3M`.
- **Do** show condition (NUEVO/USADO) and stock on every product card. Trust is built through complete information.
- **Do** start every layout at 375px. Mobile is the primary context for customers.
- **Do** use Syne 700/800 for page titles and hero headings only. DM Sans carries everything interactive.
- **Do** keep touch targets at minimum 44px height throughout. Both the storefront and the dashboard are used on mobile.
- **Do** use green-tinted neutrals (Hoja Oscura, Menta Tenue) instead of flat grays. The brand hue runs through the whole system.
- **Do** use the hover-lift shadow (green-tinted) on interactive cards to confirm interactivity before tap.
- **Do** give financing messaging (cuotas) prominent placement. It is a primary purchasing driver, not a footnote.

### Don't:
- **Don't** use a generic white-and-blue ecommerce layout. No blue anything, no orange/yellow price badges, no Shopify-default card grid.
- **Don't** use all-caps serif headings or black/gold color pairs. This is not a luxury boutique.
- **Don't** add gradient hero backgrounds, particle animations, or "10x your workflow" copy. This is not a SaaS startup landing page.
- **Don't** cram 12 cards edge-to-edge in mobile viewports. Two-column max on mobile, three on tablet.
- **Don't** truncate product names or prices with ellipsis. Wrap the text. Truncated prices destroy trust.
- **Don't** use decorative side-stripe borders (border-left as accent). Use full borders, tinted backgrounds, or nothing.
- **Don't** use gradient text (background-clip: text). Solid Verde Mendocino at most.
- **Don't** add splash screens, loading animations, or hero sequences inside the dashboard. It is a tool. Users are in a task.
- **Don't** use Syne for button labels, form fields, table data, or any interactive text.
- **Don't** use Verde Mendocino as a background or border on inactive/secondary elements. Its signal depends on its rarity.
