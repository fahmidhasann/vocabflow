# Mobile Navigation Hamburger Menu — Design & Decision

**Date:** 2026-03-12  
**Requested by:** Fahmid  
**Context:** Current mobile nav (7 items) consumes ~20% of screen height; cramped on small phones

---

## Current State

### Mobile Navigation (< md breakpoint, 768px)
```
Bottom fixed bar with 7 icon buttons in flex row:
[Dashboard] [Add] [Words] [Categories] [Analytics] [Achievements] [Settings]
```

**Issues:**
1. **Space consumption:** ~80px (including safe area) = ~20% of viewport on small phones
2. **Text overflow:** Long labels (e.g., "Categories") compressed to [10px] font
3. **Tap target size:** Icon + label works, but tight on < 320px devices
4. **Scrollable overflow:** On many-items list, labels disappear

### Desktop Navigation (≥ md breakpoint)
- **Sidebar:** 256px fixed left panel with full text labels
- **Works well:** Plenty of space, no truncation, semantic grouping

---

## Proposal: Hamburger Menu Strategy

### Option A: Mobile-Only Hamburger (Recommended)

**Breakpoint:** Hide bottom nav, show hamburger + action buttons for md and below

```
Mobile (< 768px):
┌─────────────────────┐
│ VocabFlow  ☰ [dark] │  ← Header with hamburger
│─────────────────────│
│  Main content       │
│  (extra space!)     │
│─────────────────────│
│ [+Add]  [Settings]  │  ← Sticky action bar (2 primary buttons)
└─────────────────────┘
Hamburger menu (overlay):
├─ Dashboard
├─ My Words
├─ Categories
├─ Analytics
├─ Achievements
└─ Settings
```

**Advantages:**
- ✅ Reclaims ~80px of screen real estate (massive on small phones)
- ✅ Cleaner main content area
- ✅ Industry standard (most mobile apps use hamburger + drawer)
- ✅ Reduces visual clutter
- ✅ Sticky footer with just 2 primary actions (Add + Settings)

**Disadvantages:**
- ⚠️ Hamburger adds one tap to reach Settings (not critical)
- ⚠️ Requires new component (MobileHamburger, DrawerMenu)

---

### Option B: Dual Navigation (Mobile + Tablet Hybrid)

**Breakpoints:**
- **Mobile (< 640px):** Hamburger menu
- **Tablet (640px–768px):** Bottom nav (larger screens, text fits better)
- **Desktop (≥ 768px):** Sidebar

```
Tablet (640–768px):
┌────────────────────────┐
│ Main content           │
│ (more space than mobile)
├────────────────────────┤
│ [icon][icon][icon]...  │  ← Bottom nav fits better here
└────────────────────────┘
```

**Advantages:**
- ✅ Respects form factor (tablets → bottom nav is ok)
- ✅ Gradual transition from mobile → desktop

**Disadvantages:**
- ⚠️ More complex breakpoint logic
- ⚠️ Tablet edge case (640–768px range not commonly used)

---

### Option C: Always Hamburger (Consistency)

**Applies hamburger across mobile + tablet (< 1024px).**

```
Mobile & Tablet (< 1024px):  Hamburger menu
Desktop (≥ 1024px):         Sidebar
```

**Advantages:**
- ✅ Single, consistent pattern for small screens
- ✅ Unified drawer behavior

**Disadvantages:**
- ⚠️ Tablet + iPad users (usually 10–13") might prefer sidebar over hamburger
- ⚠️ Less utilization of available space on larger tablets

---

## Recommendation: **Option A + Refinement**

### Design Decision:

1. **Mobile (< 768px):** Hamburger menu with top header
   - Toggle button in header
   - Slide-out drawer (left side)
   - Persistent sticky footer: **[Add Word] [Settings]** (primary actions)
   - Dark mode toggle moved to drawer

2. **Desktop (≥ 768px):** Keep existing sidebar (no change)

3. **Rationale:**
   - 80% of users on phones benefit from reclaimed space
   - Tablets (iPad, etc.) still benefit from hamburger if they hit < 768px
   - Desktop users unaffected
   - Aligns with modern mobile UX patterns

---

## Implementation Plan

### Files to Create/Modify:

```
src/components/
├── Layout.tsx           (MODIFY) — Add header for mobile, conditional hamburger
├── MobileHeader.tsx     (NEW) — Top bar with hamburger + theme toggle
├── MobileDrawer.tsx     (NEW) — Slide-out menu (motion/react animation)
├── StickyActionBar.tsx  (NEW) — Bottom fixed bar: [Add] + [Settings]
```

### Tailwind Breakpoints:
- `sm`: 640px
- `md`: 768px ← **Breakpoint for hamburger**
- `lg`: 1024px

### Component Structure:

```tsx
// Layout.tsx
export function Layout({ children, activeTab, setActiveTab }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Mobile Header */}
      <MobileHeader drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      {/* Mobile Drawer */}
      {/* md:hidden → only show < 768px */}
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Desktop Sidebar */}
      {/* hidden md:flex → only show ≥ 768px */}
      <aside className="hidden md:flex ...">
        {/* Existing desktop nav */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Sticky Action Bar (Mobile only) */}
      <StickyActionBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
```

---

## Mockup: Mobile Hamburger Layout

```
┌─────────────────────────────┐
│ VocabFlow        ☰  🌙      │  ← MobileHeader (40px)
├─────────────────────────────┤
│                             │
│  MAIN CONTENT AREA          │
│  (Achievements, Dashboard,  │
│   etc.)                     │
│                             │  ← More real estate!
│                             │
├─────────────────────────────┤
│  [+ Add Word]  [⚙ Settings] │  ← StickyActionBar (60px)
└─────────────────────────────┘

Drawer (when ☰ clicked):
┌─────────────────────────────┐
│ ✕                           │
├─────────────────────────────┤
│ Dashboard                   │
│ My Words                    │
│ Categories                  │
│ Analytics                   │
│ Achievements                │
│ Settings                    │
└─────────────────────────────┘
```

---

## Decision Summary

| Aspect | Decision |
|--------|----------|
| **Apply hamburger on:** | Mobile (< 768px) only |
| **Desktop sidebar:** | No change |
| **Sticky footer:** | Yes, 2 primary actions ([Add], [Settings]) |
| **Drawer animation:** | Slide-in from left (motion/react) |
| **Dark mode toggle:** | Move to drawer (or header) |
| **Impact:** | ~20% screen space reclaimed, better mobile UX |

---

## Next Steps (Awaiting Approval)

1. ✅ Approve **Option A** (mobile-only hamburger)
2. ⏳ Spawn sub-agent to implement components (MobileHeader, MobileDrawer, StickyActionBar)
3. ⏳ Test on actual mobile devices (iPhone, Android)
4. ⏳ Verify animations are smooth (60fps)
5. ⏳ Update DEVELOPMENT.md with new component docs

---

**Questions for Fahmid:**
- Should "Add Word" button be prominent in sticky footer (yes/no)?
- Should Settings move to drawer, or stay in main nav?
- Drawer slide-in speed preference (normal, fast)?
