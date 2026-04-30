# Product

## Register

product

## Users

**Customer (storefront):**
18–40 year old Argentine from Mendoza, shopping primarily on mobile. Compares prices between stores, looks for cuotas (installments), cares about condition (NUEVO/USADO). May chat with the bot to ask about stock or trade-in value before buying. Language: Spanish (Argentina) — "vos", "cuotas", "$" before numbers, period as thousands separator.

**Admin (dashboard):**
Single store owner, uses dashboard daily from both desktop and mobile (e.g. checking stock from the sales floor). Primary tasks: review recent orders, check stock alerts, see today's revenue, register physical sales (POS), update order statuses, manage product catalog.

## Product Purpose

TechPhone is an Argentine mobile phone ecommerce store based in Mendoza (Zona Este). Sells new and used smartphones (iPhone, Samsung, Motorola, Xiaomi, etc.) and accessories. Offers device trade-in (canje) valid in Zona Este — customer visits the store or owner goes to their home (with delivery fee). Two distinct surfaces: a public storefront for customers, and a private admin dashboard for the store owner.

Success looks like: a customer finds the phone they want in under 2 minutes, sees the full price without truncation, trusts the condition info, and completes checkout; the owner can handle a full day of orders and stock management entirely from their phone.

## Brand Personality

Direct, confident, slightly warm. Not overly formal — the store is knowledgeable and local, the kind of place where the owner knows phones deeply and gives honest advice. In three words: **trustworthy, expert, local**.

References that capture the right feel: Rappi's catalog clarity, MercadoLibre's product trust signals (without the visual clutter), Apple Argentina's pricing honesty. For the admin surface: Linear's focus and speed, Stripe Dashboard's data density done right.

## Anti-references

- Generic WooCommerce/Shopify default — no white/blue generic ecommerce look, no infinite-scroll pagination, no "Add to Wishlist" everywhere
- Luxury boutique — no all-caps serif headings, no black/gold palette, no ultra-sparse layouts that feel cold
- Tech startup SaaS landing — no gradient hero, no animated particle backgrounds, no "10x your workflow" copy
- ML Marketplace clutter — no 12-column product grids crammed edge-to-edge, no orange/yellow price flash badges
- Admin tools that try to look like marketing pages — no decorative animations, no splash screens, no hero sections inside the dashboard

## Design Principles

1. **Mobile first, always.** Most customers browse on phone. Every layout decision starts at 375px — desktop is an enhancement.
2. **Trust through full information.** Prices never truncated. Condition (NUEVO/USADO), battery level, and stock shown honestly. No dark patterns.
3. **The admin surface disappears into the task.** The dashboard is a focused tool — it should feel transparent, not impressive. Data and actions, nothing else.
4. **Cuotas are first-class.** Financing messaging (3 cuotas sin interés, etc.) gets prominent placement. It's a primary purchasing driver in Argentina, not a footnote.
5. **Green as signal, not decoration.** The brand color marks primary actions, active states, and positive numbers only — not backgrounds, not inactive borders, not decorative accents.

## Accessibility & Inclusion

- WCAG AA minimum (4.5:1 contrast for body text)
- Touch targets minimum 44×44px throughout — customers use the storefront on mobile, the admin manages POS on their phone
- All interactive elements keyboard-navigable
- Reduced motion: animations optional, no motion-dependent information
- Spanish Argentina only (no i18n needed currently)
