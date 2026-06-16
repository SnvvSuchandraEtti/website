
# Scope

Audit and improve five surfaces without redesigning them or changing the design language:

1. `src/components/home/HeroSection.tsx`
2. `src/pages/Projects.tsx`
3. `src/pages/ProjectDetail.tsx`
4. `src/pages/Contact.tsx`
5. `src/components/ui/EnhancedChatbot.tsx` (+ thin `ChatbotButton.tsx`)

All changes preserve current functionality, routes, dark editorial theme, and component hierarchy. No new gradients/glows/animations/cards.

---

## Weaknesses found (by file)

### HeroSection.tsx
- **Bug-prone typing effect**: the `tick` closure mixes `setInterval` + nested `setTimeout` that reassigns `interval` after `clearInterval` is already called → the cleanup `clearInterval(interval)` can miss the rescheduled timer, leaving a runaway loop on unmount/title change. Also re-runs the full effect on every title change.
- **A11y**: typing animation has no `aria-live`/`prefers-reduced-motion` opt-out; live-pulsing dot also ignores reduced motion.
- **Scroll anchor**: `href="#about"` works only on the home page; harmless here but the bouncing arrow is always animating (reduced-motion ignored).
- **Tertiary row wraps awkwardly on small screens** (GitHub + LinkedIn + Resume + Voice all inline).
- Minor: `fetchPriority` is a non-standard JSX prop spelling in some TS setups; safe but worth `fetchpriority` lowercase to be defensive.

### Projects.tsx
- `useEffect` + `useState` for derived filtering is an anti-pattern → replace with `useMemo` (removes a render + state).
- Filter buttons lack a `role="tablist"`/`aria-pressed`; keyboard users get no state announcement.
- Empty state is dead-centered text only — give it a "Show all" action.
- Filter category match uses a loose `includes()` on tech strings which can cause false positives (e.g. `"AI"` matches `"Tailwind"` containing no "ai"… actually it doesn't, but `"Web"` could match `"Webpack"`). Tighten to exact match on category, exact-token match on technologies.
- `filtered.length` count badge sits on the same row but wraps under filters on mobile — fine, but `eyebrow` color is too quiet; bump to `text-muted-foreground`.

### ProjectDetail.tsx
- `useEffect` setting derived state (`project`, `relatedProjects`) — both are pure derivations of `id` → `useMemo`.
- `window.scrollTo(0,0)` belongs in a route-level scroll-restoration, but acceptable here; should be guarded for SSR (not used) and use `{ top: 0, behavior: 'instant' }` to avoid jank.
- Not-found path renders no `<SEO>` and no 404 status semantics; add SEO with `noindex` and an `<h1>`.
- Hero image: missing `width`/`height` causes CLS; `loading="eager"` correct for above-fold, but add `decoding="async"` + intrinsic dims.
- "Problem"/"Solution" copy is **boilerplate that's identical for every project** — recruiter red flag. Gate Problem/Solution sections behind real data on `project` and only render Overview + Results when copy is missing, instead of fabricating generic text.
- Related-cards: `<h4>` skips heading levels under `<h1>`/`<h2>`; should be `<h3>`.
- Back link should be a real `<nav aria-label="Breadcrumb">`-flavored landmark or at least `aria-label`.
- Missing `<Footer />` (Projects page also missing it — confirm with existing pattern; Contact has it).

### Contact.tsx
- `setTimeout` after success races unmount; clear on cleanup.
- `noValidate` is fine, but inputs lack `aria-invalid` / `aria-describedby` linking to the error `<p>`.
- Error `<p>` has no `id`, so screen readers don't associate it with the field.
- `Field` component renders the error outside an `aria-live` region — submission errors silently appear.
- Phone number `tel:` is great; add `aria-label` on icon-only social row items (already present — good).
- Submit button uses `motion.button` purely for tap scale — fine but should respect `prefers-reduced-motion` (Framer respects globally via MotionConfig; verify or guard).
- Honeypot/anti-spam: none. Add a hidden honeypot field (no UI change) since EmailJS is exposed.
- `EMAILJS_PUBLIC_KEY` etc. read at module scope — fine, but log a single console warning when missing so silent fallback to the edge function is observable.

### EnhancedChatbot.tsx (+ ChatbotButton.tsx)
- **File is 892 lines** in one component — top maintainability issue. Extract:
  - `useChatPersistence` (localStorage load/save with quota guard)
  - `useSpeechToText` (recognition lifecycle)
  - `useTextToSpeech` (Cartesia + browser fallback)
  - `MessageBubble`, `SuggestionChips`, `CitationChip`
- **Bug**: `loadPersisted` is passed as the initial state value (`useState(loadPersisted)`) — correct lazy form, good. But `JSON.parse` is unguarded for shape; a tampered entry breaks the UI. Validate shape, drop unknown messages.
- **Perf**: scroll-to-bottom runs on every `conversation`/`isLoading` change with `behavior: 'smooth'` — janky during streaming. Throttle / only smooth when user is already near bottom; jump instantly otherwise.
- **A11y**: floating chat button uses `motion.div` wrapping `<Button>` which already handles `aria-expanded`; ensure focus returns to it on close (focus trap + restore).
- **A11y**: the open chat panel needs `role="dialog"` + `aria-modal="true"` + labelled by a heading id, and `Esc` should close — already does, good. Trap focus inside on mobile.
- **A11y**: `BotAvatar` sets `alt=""` (correct) but also sets a fallback text node — fine.
- **Token cost / context**: `enhancedChatCompletion` is called with the entire `conversation` history every turn. Cap to last N (e.g. 8 turns) on the client to bound cost and latency.
- **Voice keys in localStorage** with hard-coded strings — fine; centralize as constants.
- **Body scroll lock** uses `document.body.style.overflow = 'hidden'` which fights other modals; use a counter or a small `useBodyScrollLock` hook.
- **TTS auth**: sends `Authorization: Bearer <publishable key>` and `apikey` — acceptable for Supabase edge functions, but conditional logic is fine.
- **Storage event sync**: open in two tabs → out-of-sync conversation. Add `storage` event listener to sync.
- **Dead imports**: `ExternalLink`, `BookOpen`, `Globe`, `Sparkles` may be unused — audit and remove.
- `ChatbotButton.tsx` is a 1-line passthrough; keep as the public entrypoint but move the heavy chatbot to `src/components/chat/` for clarity (re-export from existing path to avoid breaking imports).

---

## Implementation plan

### 1. HeroSection.tsx
- Replace typing effect with a single self-rescheduling `setTimeout` loop (no `setInterval` reassignment race); store handle in a ref; respect `prefers-reduced-motion` by snapping to the full title and skipping animation entirely.
- Gate the bouncing scroll arrow + pulsing cursor + pulsing "Available" dot on `prefers-reduced-motion: no-preference`.
- Add `aria-live="off"` (decorative) to typed-title container; the title is already in `<h1>` so no SR noise.
- Wrap tertiary row in `flex-wrap gap-x-5 gap-y-3` so it stacks cleanly on `xs`.
- Lowercase `fetchpriority`.

### 2. Projects.tsx
- Drop `useState`+`useEffect` for filtering; compute `filtered = useMemo(...)` from `category`.
- Tighten match: `p.category?.toLowerCase() === cat || p.technologies.some(t => t.toLowerCase() === cat)`.
- Add `role="tablist"` / `role="tab"` / `aria-selected` on filter buttons; arrow-key navigation via a tiny inline handler.
- Empty state gets a secondary "Show all" button that resets to `'all'`.
- Wrap the grid `motion.div` in `AnimatePresence`-free fade by keying on `category` so cards re-mount with a soft 200ms opacity (no layout animation).

### 3. ProjectDetail.tsx
- Replace effect-based state with `useMemo` for `project` and `relatedProjects`.
- Use `requestAnimationFrame(() => window.scrollTo({ top: 0 }))` once per `id`.
- Drop the fabricated Problem/Solution prose. Render those sections only when the data file provides `problem` / `solution` fields (additive optional fields on the `Project` type — non-breaking; existing data continues to render Overview + Results).
- Add 404 SEO (`noindex`) on not-found branch.
- Add intrinsic `width`/`height` to the hero image (use a sensible 1600×900).
- Relabel related-card heading to `<h3>`.

### 4. Contact.tsx
- Wire `aria-invalid` + `aria-describedby={`${id}-err`}` on inputs; give the error `<p>` that id and `role="alert"`.
- Add hidden honeypot field `_company` with `tabIndex={-1}` and `autoComplete="off"`; abort submit if filled.
- Cleanup the success `setTimeout` via a ref in `useEffect`.
- Add `MotionConfig reducedMotion="user"` at the page boundary (or rely on global if already set) — verify and only add if missing.
- Console-warn once at mount if any EmailJS env var is missing.

### 5. EnhancedChatbot — extract + harden (no UX redesign)
- Split into:
  - `src/components/chat/EnhancedChatbot.tsx` (orchestrator, ~250 lines)
  - `src/components/chat/MessageBubble.tsx`
  - `src/components/chat/SuggestionChips.tsx`
  - `src/components/chat/CitationChip.tsx`
  - `src/hooks/useChatPersistence.ts`
  - `src/hooks/useSpeechToText.ts`
  - `src/hooks/useTextToSpeech.ts`
  - `src/hooks/useBodyScrollLock.ts`
- Keep `src/components/ui/EnhancedChatbot.tsx` as a thin re-export so `ChatbotButton.tsx` keeps working.
- Validate persisted messages shape; drop bad entries.
- Cap history sent to the model to the last 8 turns.
- Smooth-scroll only when user is within 80px of bottom; otherwise jump instantly.
- Replace body-scroll-lock with the new hook.
- Add `storage` event listener so two tabs stay in sync.
- Remove unused lucide imports.
- Restore focus to the toggle button when the panel closes.

---

## Files touched

```text
src/components/home/HeroSection.tsx                edit
src/pages/Projects.tsx                             edit
src/pages/ProjectDetail.tsx                        edit
src/pages/Contact.tsx                              edit
src/data/projects.ts                               edit  (additive optional fields)
src/components/ui/EnhancedChatbot.tsx              shrink → re-export
src/components/chat/EnhancedChatbot.tsx            new
src/components/chat/MessageBubble.tsx              new
src/components/chat/SuggestionChips.tsx            new
src/components/chat/CitationChip.tsx               new
src/hooks/useChatPersistence.ts                    new
src/hooks/useSpeechToText.ts                       new
src/hooks/useTextToSpeech.ts                       new
src/hooks/useBodyScrollLock.ts                     new
```

No route changes. No design-token changes. No new dependencies. No backend changes.

---

## Out of scope (per your constraints)

- Visual redesign of any surface
- New gradients, glows, decorative motion, or cards
- New features (analytics, auth, payment, etc.)
- Changing the certificate listing/detail/viewer
- Touching the chatbot backend (`supabase/functions/chat`)
