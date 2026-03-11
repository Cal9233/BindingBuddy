# Binding-Buddy

Pokemon binder cover e-commerce store — laser-engraved custom designs.

## Tech Stack
- **Framework**: Next.js 15 (App Router) + React 19
- **CMS**: Payload CMS 3 (self-hosted, MongoDB via Mongoose adapter)
- **Database**: MongoDB Atlas
- **Payments**: Stripe (embedded Elements + PaymentIntent) + PayPal
- **Email**: Resend (transactional)
- **Styling**: Tailwind CSS with Pokemon-themed palette
- **State**: Zustand (cart persistence via localStorage)
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Fonts**: Barlow Condensed (display) + DM Sans (body)

## Key Paths
- `src/app/` — Next.js App Router pages
- `src/app/(main)/` — Public-facing routes (products, checkout, contact, etc.)
- `src/app/(payload)/admin/` — Payload CMS admin panel route group
- `src/app/api/checkout/route.ts` — Legacy Stripe checkout session (deprecated)
- `src/app/api/checkout/create-payment-intent/route.ts` — Stripe PaymentIntent creation
- `src/app/api/checkout/paypal/create-order/route.ts` — PayPal order creation
- `src/app/api/checkout/paypal/capture-order/route.ts` — PayPal order capture
- `src/app/api/contact/route.ts` — Contact form → Resend email
- `src/collections/` — Payload CMS schemas (Users, Media, Products, Orders)
- `src/components/ui/` — Reusable primitives (Button, HoloCard, PageTransition)
- `src/components/layout/` — Header, Footer, PageTransition
- `src/components/sections/` — Home page sections (Hero, FeaturedProducts, CategoryGrid, ProcessSection, Testimonials)
- `src/components/products/` — ProductCard, AddToCartButton, ProductGrid
- `src/lib/products.ts` — `getPayloadClient()`, `normalizeProduct()`, `formatPrice()`
- `src/lib/cart-store.ts` — Zustand cart store (localStorage key: `bb_cart`)
- `src/lib/stripe.ts` — Stripe server singleton (lazy-initialized)
- `src/lib/stripe-client.ts` — Stripe client-side `loadStripe()` singleton
- `src/lib/paypal.ts` — PayPal server helpers (OAuth token, API base URL)
- `src/lib/checkout-validation.ts` — Shared cart validation + total calculation
- `src/components/checkout/` — Checkout UI: OrderSummary, PaymentMethodSelector, StripePaymentForm, PayPalPaymentForm
- `src/lib/stores.ts` — Partner store registry (5 stores for QR attribution)
- `src/middleware.ts` — Store referral cookie middleware (handles both `?ref=` and `/ref/[slug]`)
- `src/app/(frontend)/ref/[slug]/page.tsx` — Store landing page (branded welcome, sets cookie via middleware)
- `src/app/api/stores/[slug]/qr/route.ts` — QR code PNG generation for store URLs
- `src/app/(frontend)/stores/[slug]/print/page.tsx` — Printable QR card for partner stores
- `src/components/checkout/StoreReferralPicker.tsx` — Checkout fallback "referred by store?" picker
- `src/lib/totp.ts` — TOTP utilities (generateSecret, verifyToken, generateQRDataURL)
- `src/app/api/admin/totp/` — TOTP API routes (setup, verify, disable, status)
- `src/components/admin/` — Admin UI components (Logo, Icon, BeforeLogin, BeforeDashboard, TOTPSetup, TOTPProvider)
- `payload.config.ts` — Payload CMS root config
- `scripts/seed.ts` — Database seeder

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run seed` — Seed sample products
- `npm run generate:types` — Regenerate Payload types
- `npm run lint` — Run linter

## Architecture & Data Flow

### Product Browsing
Server components → `getPayloadClient()` → Payload REST → `normalizeProduct()` resolves image URLs + defaults → rendered page.

### Cart → Checkout
1. User clicks `AddToCartButton` → Zustand store adds item (persisted to localStorage `bb_cart`)
2. Checkout page mounts → POST `/api/checkout/create-payment-intent` → receives `clientSecret`
3. User selects payment method (Credit Card or PayPal tabs)
4. **Credit Card**: Embedded Stripe Elements form → `confirmPayment({ redirect: "if_required" })` → inline success
5. **PayPal**: PayPal button → create order via API → PayPal popup → capture via API → inline success
6. Both flows: `clearCart()` → thank-you screen shown inline (or via `?success=true` redirect for 3DS)

### Contact / Custom Orders
React Hook Form + Zod validation → POST `/api/contact` → Resend email to `CONTACT_EMAIL`. File upload field exists in the UI but files are **NOT** sent to the API — only the description text.

### Store Attribution
`?ref=store-slug` query param OR `/ref/store-slug` path → `src/middleware.ts` sets `store_ref` cookie (httpOnly, 30 days, sameSite: lax) → cookie value passed to Stripe metadata / PayPal custom_id on checkout. Partner stores defined in `src/lib/stores.ts`. QR codes generated at `/api/stores/[slug]/qr`, printable cards at `/stores/[slug]/print`. Checkout fallback picker (`StoreReferralPicker`) shown when no cookie exists.

## Payload CMS Collections

| Collection | Access | Key Fields |
|------------|--------|------------|
| **Users** | Admin-only CRUD | email, role (`admin` \| `editor`) |
| **Media** | Public read | filename, upload with 3 sizes: `thumbnail` 160px, `card` 480px, `full` 1200px |
| **Products** | Public read | name, slug (unique), price (cents), description, image, images[], category, featured, stock, pokemon, binderType, badge (`New`/`Limited`/`Best Seller`), variants[{label, stock}], inStock |
| **Orders** | Public create+read, admin update+delete | stripeSessionId, storeRef, total, items (JSON), status, timestamps |

## Component Patterns

| Component | Behavior |
|-----------|----------|
| `Button` | Variants: `primary` (yellow), `secondary` (border), `ghost` (muted) |
| `HoloCard` | Wraps any element with holographic hover effect — CSS `holo-rotate` animation (3s ease infinite), hover triggers 0.3s opacity transition |
| `ProductCard` | Uses `HoloCard` + `AddToCartButton` |
| `AddToCartButton` | Shows "Added ✓" state for 1500ms after click |
| `PageTransition` | Framer Motion wrapper — `opacity: 0→1`, `y: 8→0`, duration 0.3s, easeOut |

**Section components** (home page): Hero, FeaturedProducts, CategoryGrid, ProcessSection, Testimonials

## Important Patterns & Gotchas

- **Prices always in cents** — use `formatPrice()` from `src/lib/products.ts` to display
- **Stock `-1` = unlimited** — used for custom engraving services
- **`normalizeProduct()`** resolves image URLs from Payload media objects with fallback to `/images/placeholder.jpg`
- **Home page** (`src/app/page.tsx`) uses `export const dynamic = "force-dynamic"` — no static generation
- **Contact form file upload is UI-only** — files are NOT sent to the API, only the description text
- **Payload admin** lives at `/admin` under a `(payload)` route group
- **Stripe server singleton** in `src/lib/stripe.ts` — lazy-initialized via `getStripe()`. **Client singleton** in `src/lib/stripe-client.ts` via `getStripeClient()`
- **PayPal helpers** in `src/lib/paypal.ts` — OAuth2 access token with module-level caching
- **Shared validation** in `src/lib/checkout-validation.ts` — used by both Stripe and PayPal API routes
- **Store registry** in `src/lib/stores.ts` — 5 partner stores: cool-cards-phoenix, pallet-town-comics, elite-four-games, trainer-hub, pocket-monsters-shop
- **Payload auto-generates** REST at `/api/[...slug]` and GraphQL at `/api/graphql`
- **MFA TOTP** — custom implementation using `otplib` v12 + `qrcode`. TOTP provider wraps admin via `admin.components.providers`. User fields: `totpSecret` (hidden), `totpEnabled` (checkbox). API routes at `/api/admin/totp/{setup,verify,disable,status}`. Session tracked via `totp_verified` cookie.

## Theme Reference

**Colors** (from `tailwind.config.ts`):
| Token | Hex | Usage |
|-------|-----|-------|
| `poke-blue` | `#3B6B9E` | Primary brand blue |
| `poke-yellow` | `#E63946` | Accent / CTA (crimson red) |
| `poke-dark` | `#0F1117` | Page background |
| `poke-card` | `#1A1D27` | Card backgrounds |
| `poke-border` | `#2A2D3A` | Borders / dividers |
| `poke-text` | `#F0F0F8` | Body text |
| `poke-muted` | `#8B8FA8` | Secondary text |
| `poke-gold` | `#2EC4B6` | Teal accents |

**Fonts**: `font-display` → Barlow Condensed (headings), `font-sans` → DM Sans (body)

## Common Tasks

| Task | Where to change |
|------|-----------------|
| Add a new product field | `src/collections/Products.ts` → run `npm run generate:types` |
| Add a new page | Create `src/app/(main)/[route]/page.tsx`, wrap content in `<PageTransition>` |
| Add a partner store | Add entry to registry in `src/lib/stores.ts` |
| Modify checkout flow | `src/app/api/checkout/route.ts` (API) + `src/app/checkout/page.tsx` (UI) |
| Change theme colors | `tailwind.config.ts` → `theme.extend.colors` |
| Add a home page section | Create component in `src/components/sections/`, add to `src/app/page.tsx` |

## Conventions
- Components in PascalCase, one component per file
- Payload collections in `src/collections/`, each exports a collection config
- Server components fetch data via `getPayloadClient()` from `src/lib/products.ts`
- Cart state managed client-side via Zustand store in `src/lib/cart-store.ts`

## Environment Variables
See `.env.example` for required keys: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, NEXT_PUBLIC_PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, RESEND_API_KEY, CONTACT_EMAIL, PAYLOAD_SECRET, DATABASE_URI
