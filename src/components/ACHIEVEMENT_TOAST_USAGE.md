# AchievementToast Component Usage Guide

## Overview
The `AchievementToast` component provides a celebratory notification system for badge unlocks and achievements. It features smooth animations, auto-dismiss functionality, manual dismissal, confetti effects, and full dark mode support.

## Setup

### 1. Wrap your app with the provider
In your main App.tsx or root component:

```tsx
import { AchievementToastProvider } from './components/AchievementToast';

export function App() {
  return (
    <AchievementToastProvider>
      {/* Your app content */}
    </AchievementToastProvider>
  );
}
```

### 2. Use the hook anywhere in your component tree
```tsx
import { useAchievementToast } from '../components/AchievementToast';
import { Trophy } from 'lucide-react';

export function MyComponent() {
  const { show } = useAchievementToast();

  const handleBadgeUnlock = () => {
    show({
      id: 'first-100-words',
      icon: <Trophy className="w-8 h-8" />,
      name: '100 Words Mastered!',
      message: 'You\'ve mastered 100 words. You\'re on fire! 🔥',
    });
  };

  return <button onClick={handleBadgeUnlock}>Unlock Badge</button>;
}
```

## Component Features

### ✨ Animation & Behavior
- **Entrance**: Slides in from bottom-right with scale animation (0.4s)
- **Auto-dismiss**: Toast automatically disappears after 5 seconds
- **Manual dismiss**: Users can click the X button to close immediately
- **Exit animation**: Smooth fade and slide out effect
- **Confetti**: 12 animated particles with rotation and fade effects

### 🎨 Styling
- Clean, modern card design with shadow and border
- Emerald accent bar at the bottom
- Pulsing gradient background on badge icon
- Full Tailwind dark mode support (dark: classes)
- Responsive layout with max-width constraint

### 📱 Accessibility
- Close button with aria-label
- Proper z-index layering (z-50)
- Non-blocking: pointer-events-auto only on toast container

## Props (Achievement Interface)

```typescript
interface Achievement {
  id: string;           // Unique identifier for the toast
  icon: React.ReactNode; // Icon to display in the badge circle
  name: string;          // Achievement title (e.g., "First Word!")
  message: string;       // Description/message (e.g., "You added...")
}
```

## Styling Customization

The component uses Tailwind classes. To customize:

### Colors
- Badge background: `from-emerald-400 to-emerald-600`
- Accent bar: `from-emerald-400 via-emerald-500 to-emerald-600`
- Confetti particles: `#10b981`, `#059669`, `#047857`, `#34d399`

Modify the color values in `AchievementToastContainer` to match your brand.

### Animation timing
- Toast entrance/exit: 0.4s (adjustable in `initial`/`animate`/`exit` transitions)
- Auto-dismiss delay: 5000ms (adjustable in `useEffect`)
- Confetti duration: 2.5s (adjustable in Confetti's `animate`)

### Size
- Icon size: `w-16 h-16` in the badge circle
- Toast max-width: `max-w-sm` (336px)
- Min-width: `min-w-80` (320px)

## Example Badges

```tsx
// Achievement unlocked
show({
  id: 'first-review-streak',
  icon: <Flame className="w-8 h-8" />,
  name: 'On Fire! 🔥',
  message: 'You\'ve reviewed words for 7 days straight!',
});

// Category mastery
show({
  id: 'category-complete',
  icon: <CheckCircle className="w-8 h-8" />,
  name: 'Category Complete',
  message: 'You\'ve mastered all words in Business English!',
});

// Milestone
show({
  id: '1000-total-reviews',
  icon: <Target className="w-8 h-8" />,
  name: '1,000 Reviews!',
  message: 'Incredible dedication. You\'ve reviewed 1,000 words!',
});
```

## Dependencies
- `react` (hooks, context)
- `motion/react` (animations via motion library)
- `lucide-react` (X icon for close button)
- `tailwindcss` (styling)

All dependencies are already in vocabflow's package.json.

## Dark Mode
Automatically respects the system/app dark mode setting through Tailwind's `dark:` class variants:
- `dark:bg-zinc-900` - Dark background
- `dark:text-zinc-50` - Light text
- `dark:border-zinc-700` - Dark border
- `dark:shadow-black/50` - Darker shadow

No additional setup needed!
