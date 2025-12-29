# Video Error Display - Visual Comparison

## Before vs After

### BEFORE: Duplicate Question Text and Separate Elements

```
┌─────────────────────────────────────────────────────────┐
│ Question 1 of 6                                         │
│                                                         │
│ How often do you go online?                             │  ← Question text (duplicate)
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ⚠️ Video unavailable - you may begin speaking       │ │  ← Error message
│ │ Video error: Failed to load video                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  ⏱️ 5  Recording will start automatically           │ │  ← Countdown timer
│ │        Get ready to speak...                        │ │  (stays visible during recording)
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [Video Player - Black Box]                              │
│ Press play to begin                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘

Issues:
❌ Question text appears twice
❌ Error message and question text are separate
❌ Countdown timer stays visible during recording
❌ Too many separate visual elements
❌ Unclear visual hierarchy
```

---

### AFTER: Consolidated Single Card with Smart Timer

```
┌─────────────────────────────────────────────────────────┐
│ Question 1 of 6                                         │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                                                     │ │
│ │  ⚠️ Whoops - video unavailable                      │ │  ← Error header
│ │                                                     │ │
│ │  Text question:                                     │ │  ← Question label
│ │  How often do you go online?                        │ │  ← Question text
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  ⏱️ 5  Recording will start automatically           │ │  ← Countdown timer
│ │        Get ready to speak...                        │ │  (disappears when recording starts)
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘

Improvements:
✅ Question text appears only once
✅ Error message and question text in single card
✅ Countdown timer disappears when recording starts
✅ Clean, consolidated visual design
✅ Clear visual hierarchy
```

---

## State Transitions

### During Prep Phase (Before Recording)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  ⚠️ Whoops - video unavailable                      │ │
│ │                                                     │ │
│ │  Text question:                                     │ │
│ │  How often do you go online?                        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  ⏱️ 5  Recording will start automatically           │ │  ← Timer visible
│ │        Get ready to speak...                        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 🔴 Recording                    ⚫⚫⚫⚫⚫⚫⚫  0:00 / 0:20 │
│                                                         │
│         [Pause]          [Next Question]                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### After Recording Starts

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  ⚠️ Whoops - video unavailable                      │ │
│ │                                                     │ │
│ │  Text question:                                     │ │
│ │  How often do you go online?                        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│                                                         │  ← Timer disappeared
│                                                         │
│                                                         │
│ 🔴 Recording                    🟢🟢🟢⚫⚫⚫⚫  0:05 / 0:20 │
│                                                         │
│         [Pause]          [Next Question]                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Layout Breakdown

### Error Card Structure

```
┌─────────────────────────────────────────────────────────┐
│ padding: 24px horizontal, 20px vertical                 │
│ background: orange-50 (light) / orange-950 (dark)       │
│ border: 2px orange-300 (light) / orange-700 (dark)      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Error Header (gap-2, horizontal flex)           │   │
│  │                                                 │   │
│  │  ⚠️ (text-2xl)                                  │   │
│  │  Whoops - video unavailable (font-semibold)    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ↓ gap-4 (16px)                                         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Question Section (w-full, text-center)         │   │
│  │                                                 │   │
│  │  Text question: (text-sm, muted-foreground)    │   │
│  │  ↓ mb-1 (4px)                                   │   │
│  │  How often do you go online?                   │   │
│  │  (text-lg, font-medium, leading-relaxed)       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Countdown Timer Structure

```
┌─────────────────────────────────────────────────────────┐
│ padding: 24px horizontal, 16px vertical                 │
│ background: primary/10                                  │
│ border: 2px primary/30                                  │
│ animation: pulse                                        │
│                                                         │
│  ┌────────┐  ┌──────────────────────────────────────┐  │
│  │        │  │ Recording will start automatically   │  │
│  │  ⏱️ 5  │  │ (font-semibold, text-base)           │  │
│  │        │  │                                      │  │
│  │ (w-12) │  │ Get ready to speak...                │  │
│  │ (h-12) │  │ (text-sm, opacity-90)                │  │
│  └────────┘  └──────────────────────────────────────┘  │
│                                                         │
│  ← gap-3 (12px) →                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Spacing Analysis

### Before (Multiple Separate Elements)

```
Question text
  ↓ (default spacing)
Error message
  ↓ (space-y-3 = 12px)
Countdown timer
  ↓ (default spacing)
Video player

Total vertical space: ~60-80px
Visual elements: 4 separate boxes
```

### After (Consolidated Design)

```
Error card (with question text inside)
  ↓ (space-y-3 = 12px)
Countdown timer (disappears when recording)
  ↓ (no extra spacing when hidden)
[Recording controls]

Total vertical space: ~40-50px (when recording)
Visual elements: 1-2 boxes (depending on state)
```

**Space Saved**: ~20-30px vertical space when recording starts

---

## Color Specifications

### Error Card

#### Light Mode
- Background: `#FFF7ED` (orange-50)
- Border: `#FDBA74` (orange-300)
- Text (header): `#C2410C` (orange-700)
- Text (label): `#6B7280` (muted-foreground)
- Text (question): `#111827` (foreground)

#### Dark Mode
- Background: `#431407` (orange-950)
- Border: `#C2410C` (orange-700)
- Text (header): `#FDBA74` (orange-300)
- Text (label): `#9CA3AF` (muted-foreground)
- Text (question): `#F9FAFB` (foreground)

### Countdown Timer

#### Light Mode
- Background: `rgba(45, 95, 159, 0.1)` (primary/10)
- Border: `rgba(45, 95, 159, 0.3)` (primary/30)
- Text: `#2D5F9F` (primary)

#### Dark Mode
- Background: `rgba(96, 165, 250, 0.1)` (primary/10)
- Border: `rgba(96, 165, 250, 0.3)` (primary/30)
- Text: `#60A5FA` (primary)

---

## Typography Hierarchy

### Error Card

```
⚠️ Whoops - video unavailable
   ↑
   text-2xl (emoji) + text-base font-semibold (text)
   Primary visual weight

Text question:
   ↑
   text-sm font-medium
   Secondary label

How often do you go online?
   ↑
   text-lg font-medium leading-relaxed
   Primary content
```

### Countdown Timer

```
5
↑
text-xl font-bold
Primary visual weight

Recording will start automatically
↑
text-base font-semibold
Primary message

Get ready to speak...
↑
text-sm opacity-90
Secondary hint
```

---

## Responsive Behavior

### Mobile (< 640px)

```
┌─────────────────────────┐
│                         │
│ ┌─────────────────────┐ │
│ │  ⚠️ Whoops -        │ │
│ │  video unavailable  │ │
│ │                     │ │
│ │  Text question:     │ │
│ │  How often do you   │ │
│ │  go online?         │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │  ⏱️ 5               │ │
│ │  Recording will     │ │
│ │  start...           │ │
│ └─────────────────────┘ │
│                         │
└─────────────────────────┘

- Full width cards
- Stacked layout
- Readable text sizes
```

### Tablet (640px - 1024px)

```
┌───────────────────────────────────┐
│                                   │
│ ┌───────────────────────────────┐ │
│ │  ⚠️ Whoops - video unavailable│ │
│ │                               │ │
│ │  Text question:               │ │
│ │  How often do you go online?  │ │
│ └───────────────────────────────┘ │
│                                   │
│ ┌───────────────────────────────┐ │
│ │  ⏱️ 5  Recording will start   │ │
│ │        automatically...       │ │
│ └───────────────────────────────┘ │
│                                   │
└───────────────────────────────────┘

- Wider cards
- More horizontal space
- Comfortable reading width
```

### Desktop (> 1024px)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  ⚠️ Whoops - video unavailable                      │ │
│ │                                                     │ │
│ │  Text question:                                     │ │
│ │  How often do you go online?                        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  ⏱️ 5  Recording will start automatically           │ │
│ │        Get ready to speak...                        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘

- Maximum width cards
- Optimal reading experience
- Balanced spacing
```

---

## Animation Behavior

### Countdown Timer Appearance
```
State: Not Recording + Countdown Active
Animation: animate-pulse (continuous)
Transition: opacity 300ms ease-in-out
```

### Countdown Timer Disappearance
```
State: Recording Started
Animation: Fade out (via conditional rendering)
Transition: Smooth removal from DOM
Layout: No shift (space collapses naturally)
```

### Error Card
```
State: Always visible when mediaError exists
Animation: None (static display)
Transition: Appears immediately on error
```

---

## Accessibility Annotations

### Error Card
```html
<div 
  role="alert"           ← Announces immediately
  aria-live="assertive"  ← High priority announcement
>
  ⚠️ Whoops - video unavailable
  Text question: How often do you go online?
</div>
```

**Screen Reader Output**:
"Alert: Whoops - video unavailable. Text question: How often do you go online?"

### Countdown Timer
```html
<div 
  role="status"         ← Announces updates
  aria-live="polite"    ← Low priority announcement
>
  5 Recording will start automatically. Get ready to speak...
</div>
```

**Screen Reader Output**:
"Status: 5. Recording will start automatically. Get ready to speak..."

### Question Text Fallback
```html
<div 
  className="sr-only"   ← Hidden visually, available to screen readers
  role="region"
  aria-label="Question text content"
  aria-live="polite"
>
  How often do you go online?
</div>
```

**Screen Reader Output**:
"Region: Question text content. How often do you go online?"

---

## Summary

### Key Improvements
1. ✅ **Eliminated Duplication**: Question text appears only once
2. ✅ **Consolidated Display**: Single error card with all information
3. ✅ **Smart Timer**: Disappears when recording starts
4. ✅ **Cleaner Design**: Reduced visual clutter
5. ✅ **Better UX**: Friendlier error message ("Whoops")
6. ✅ **Clear Context**: "Text question:" label
7. ✅ **Maintained Accessibility**: All ARIA attributes preserved
8. ✅ **Responsive**: Works on all screen sizes
9. ✅ **Dark Mode**: Proper color variants
10. ✅ **Smooth Transitions**: No layout shifts

### User Benefits
- **Faster Comprehension**: All information in one place
- **Less Confusion**: No duplicate text
- **Better Focus**: Timer disappears when not needed
- **Professional Appearance**: Clean, polished design
- **Reduced Anxiety**: Friendly error message tone
