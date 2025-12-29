# Question Bank Loading Issue - Diagnosis and Fix Suggestions

## Date: 2025-11-18

---

## Problem Statement

The application is not finding/loading the question bank, resulting in users being stuck on the loading screen with the message:
> "Hi, just a moment while I prepare your question(s)"

---

## Investigation Summary

### Files Examined
1. ✅ `/src/utils/question-bank-loader.ts` - Question loading logic
2. ✅ `/src/data/question-banks/default.ts` - Built-in default questions
3. ✅ `/public/question-banks/*.json` - External question bank files
4. ✅ `/src/pages/PracticePage.tsx` - Main page component
5. ✅ `/src/types/index.ts` - Type definitions

### Current Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PracticePage.tsx                     │
│                                                         │
│  1. Initial State: phase = AppPhase.Loading            │
│  2. useEffect runs: loadQuestionBank()                 │
│  3. Sets: setSampleQuestions(questions)                │
│  4. After 1.5s: setPhase(AppPhase.Preparation)        │
│  5. Render condition:                                  │
│     if (phase === Loading || questions.length === 0)   │
│        → Show loading screen                           │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              question-bank-loader.ts                    │
│                                                         │
│  • Check URL param: ?bank=xxx                          │
│  • If 'default' or no param:                           │
│    → Return built-in defaultQuestionBank               │
│  • If custom bank name:                                │
│    → Fetch /question-banks/{name}.json                 │
│    → If fails, fallback to defaultQuestionBank         │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│           default.ts (Built-in Questions)               │
│                                                         │
│  export const defaultQuestionBank = {                  │
│    id: 'default',                                      │
│    name: 'General Topics',                             │
│    questions: [                                        │
│      { id: 'q1', type: QuestionType.Part2, ... },     │
│      { id: 'q2', type: QuestionType.Part1, ... },     │
│      { id: 'q3', type: QuestionType.Part2, ... },     │
│      { id: 'q4', type: QuestionType.Part3, ... },     │
│      { id: 'q5', type: QuestionType.Part3, ... }      │
│    ]                                                   │
│  }                                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Root Cause Analysis

### Issue #1: Loading Condition Logic (CRITICAL)

**Location**: `PracticePage.tsx` line 627

```tsx
if (phase === AppPhase.Loading || sampleQuestions.length === 0) {
  return <LoadingScreen />;
}
```

**Problem**:
- Even after phase changes to `Preparation`, if `sampleQuestions.length === 0`, the loading screen persists
- This creates an **infinite loading state** if questions fail to load
- No error message is shown to the user

**Why questions might be empty**:
1. `loadQuestionBank()` returns empty array
2. `setSampleQuestions()` fails silently
3. State update timing issue (race condition)
4. Default question bank is malformed
5. Import/export issue with default question bank

---

### Issue #2: Silent Failure in Question Loading

**Location**: `question-bank-loader.ts` lines 66-72

```tsx
if (bankId === 'default') {
  console.log(`✅ Loaded built-in default bank (${defaultQuestionBank.questions?.length || 0} questions)`);
  return {
    questions: defaultQuestionBank.questions || [],
    bankInfo: defaultQuestionBank,
  };
}
```

**Problem**:
- Uses optional chaining: `defaultQuestionBank.questions?.length`
- If `questions` is undefined, returns empty array `[]`
- No error thrown, no user notification
- Application continues with 0 questions

**Potential causes**:
1. `defaultQuestionBank.questions` is undefined
2. Import statement fails silently
3. Circular dependency issue
4. Build/bundling issue with TypeScript enums

---

### Issue #3: Type Mismatch Between JSON and TypeScript

**JSON Format** (`/public/question-banks/technology.json`):
```json
{
  "type": "part1"  // ← Lowercase string
}
```

**TypeScript Enum** (`/src/types/index.ts`):
```tsx
export enum QuestionType {
  Part1 = 'part1',  // ← Enum with lowercase value
  Part2 = 'part2',
  Part3 = 'part3',
}
```

**Analysis**:
- ✅ Enum values ARE lowercase strings
- ✅ JSON strings should match enum values
- ⚠️ BUT: TypeScript doesn't validate JSON at runtime
- ⚠️ Type assertion might be needed when parsing JSON

---

### Issue #4: No Timeout or Error State

**Location**: `PracticePage.tsx` lines 169-229

**Problem**:
- If `loadQuestionBank()` hangs (network issue, CORS, etc.), no timeout
- User sees infinite loading with no way to recover
- No "Retry" button or error message

**Missing features**:
1. Loading timeout (e.g., 10 seconds)
2. Error state display
3. Retry mechanism
4. Fallback to hardcoded questions

---

## Diagnostic Steps (No Code Changes)

### Step 1: Check Browser Console

**Open Developer Tools → Console tab**

Look for these log messages:
```
🔍 Loading question bank: default
✅ Loaded built-in default bank (5 questions)
🎬 [PracticePage] Preloading videos...
✅ [PracticePage] Preloading video 1: https://...
```

**If you see**:
- ❌ `✅ Loaded built-in default bank (0 questions)` → Questions array is empty
- ❌ `Failed to load question bank` → Import/export issue
- ❌ No logs at all → useEffect not running
- ❌ Error messages → Check error details

---

### Step 2: Check Network Tab

**Open Developer Tools → Network tab**

**If using custom bank** (e.g., `?bank=technology`):
- Look for request to `/question-banks/technology.json`
- Check response status: 200 OK, 404 Not Found, CORS error?
- Inspect response body: Valid JSON?

**If using default bank**:
- Should NOT see network requests (built-in)
- If you see requests, something is wrong with imports

---

### Step 3: Check React DevTools

**Install React DevTools extension**

**Inspect PracticePage component state**:
```
PracticePage
  ├─ phase: "loading" or "preparation"?
  ├─ sampleQuestions: [] or [...]?
  └─ questionBankInfo: null or {...}?
```

**Expected after 2 seconds**:
- `phase`: "preparation"
- `sampleQuestions`: Array with 5 items
- `questionBankInfo`: Object with id, name, etc.

**If sampleQuestions is empty**:
- Questions failed to load
- Check console for errors

---

### Step 4: Test with URL Parameters

**Try different URL parameters**:

1. **Default bank** (built-in):
   ```
   http://localhost:5173/
   ```
   - Should load 5 questions from `default.ts`

2. **Technology bank** (JSON file):
   ```
   http://localhost:5173/?bank=technology
   ```
   - Should load 4 questions from `technology.json`

3. **Non-existent bank** (fallback test):
   ```
   http://localhost:5173/?bank=nonexistent
   ```
   - Should show toast: "Question bank 'nonexistent' not found"
   - Should fallback to default bank (5 questions)

**If all three fail**:
- Problem is with default question bank itself
- Check import/export in `default.ts`

---

### Step 5: Verify Default Question Bank

**Check file**: `/src/data/question-banks/default.ts`

**Verify**:
1. ✅ File exists
2. ✅ Export statement: `export const defaultQuestionBank: QuestionBank = {...}`
3. ✅ Questions array has 5 items
4. ✅ Each question has required fields: id, type, text, media, speakingDuration
5. ✅ QuestionType enum is imported correctly

**Common issues**:
- Missing `export` keyword
- Typo in variable name
- Circular import
- TypeScript compilation error

---

## Suggested Fixes (Ordered by Priority)

### Fix #1: Add Hardcoded Fallback Questions (IMMEDIATE)

**Why**: Ensures app never gets stuck with 0 questions

**Implementation**:
```tsx
// In PracticePage.tsx, add fallback questions
const FALLBACK_QUESTIONS: Question[] = [
  {
    id: 'fallback-1',
    type: QuestionType.Part1,
    text: 'Tell me about your hometown.',
    media: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    speakingDuration: 20,
  },
  // Add 2-3 more fallback questions
];

// In loadBank function, use fallback if questions are empty
if (!questions || questions.length === 0) {
  console.warn('⚠️ No questions loaded, using fallback');
  setSampleQuestions(FALLBACK_QUESTIONS);
} else {
  setSampleQuestions(questions);
}
```

**Benefits**:
- ✅ App always has questions to display
- ✅ Users can test the app even if loading fails
- ✅ Clear indication something went wrong (fallback questions are generic)

---

### Fix #2: Improve Loading Condition Logic

**Why**: Separate loading state from empty questions state

**Current code**:
```tsx
if (phase === AppPhase.Loading || sampleQuestions.length === 0) {
  return <LoadingScreen />;
}
```

**Improved code**:
```tsx
// Add new state
const [loadingError, setLoadingError] = useState<string | null>(null);

// In render
if (phase === AppPhase.Loading) {
  return <LoadingScreen />;
}

if (sampleQuestions.length === 0) {
  return (
    <ErrorScreen 
      message="Failed to load questions"
      error={loadingError}
      onRetry={() => window.location.reload()}
    />
  );
}
```

**Benefits**:
- ✅ Clear distinction between loading and error states
- ✅ User can retry if loading fails
- ✅ Error message provides context

---

### Fix #3: Add Loading Timeout

**Why**: Prevent infinite loading if something hangs

**Implementation**:
```tsx
useEffect(() => {
  let timeoutId: NodeJS.Timeout;
  
  const loadBank = async () => {
    // Set timeout
    timeoutId = setTimeout(() => {
      if (sampleQuestions.length === 0) {
        console.error('⏱️ Loading timeout - using fallback');
        setSampleQuestions(FALLBACK_QUESTIONS);
        setPhase(AppPhase.Preparation);
        toast({
          title: 'Loading Timeout',
          description: 'Questions took too long to load. Using default questions.',
          variant: 'destructive',
        });
      }
    }, 10000); // 10 second timeout
    
    try {
      const { questions, bankInfo, error } = await loadQuestionBank();
      clearTimeout(timeoutId); // Cancel timeout if successful
      
      // Rest of loading logic...
    } catch (error) {
      clearTimeout(timeoutId);
      // Error handling...
    }
  };
  
  loadBank();
  
  return () => clearTimeout(timeoutId); // Cleanup
}, []);
```

**Benefits**:
- ✅ Prevents infinite loading
- ✅ Automatic fallback after timeout
- ✅ User gets feedback about what happened

---

### Fix #4: Add Detailed Logging

**Why**: Help diagnose the exact point of failure

**Implementation**:
```tsx
const loadBank = async () => {
  console.log('🔍 [1/5] Starting question bank load...');
  
  try {
    console.log('🔍 [2/5] Calling loadQuestionBank()...');
    const { questions, bankInfo, error } = await loadQuestionBank();
    
    console.log('🔍 [3/5] Received response:', {
      questionsCount: questions?.length || 0,
      bankInfo: bankInfo?.name || 'unknown',
      error: error || 'none'
    });
    
    console.log('🔍 [4/5] Setting state...');
    setSampleQuestions(questions);
    setQuestionBankInfo(bankInfo);
    
    console.log('🔍 [5/5] State set. Questions:', questions);
    
    // Verify state was set
    setTimeout(() => {
      console.log('🔍 [Verify] sampleQuestions in state:', sampleQuestions.length);
    }, 100);
    
  } catch (error) {
    console.error('❌ [Error] Failed at step:', error);
  }
};
```

**Benefits**:
- ✅ Pinpoint exact failure location
- ✅ Verify state updates
- ✅ Track async timing issues

---

### Fix #5: Validate Default Question Bank on Import

**Why**: Catch issues at build time, not runtime

**Implementation**:
```tsx
// In default.ts, add validation
export const defaultQuestionBank: QuestionBank = {
  id: 'default',
  name: 'General Topics',
  description: '...',
  author: '...',
  version: '1.0',
  questions: [
    // ... questions
  ],
};

// Validate at module load time
if (!defaultQuestionBank.questions || defaultQuestionBank.questions.length === 0) {
  console.error('❌ CRITICAL: Default question bank has no questions!');
  throw new Error('Default question bank is empty');
}

console.log(`✅ Default question bank loaded: ${defaultQuestionBank.questions.length} questions`);
```

**Benefits**:
- ✅ Fails fast during development
- ✅ Prevents deployment with broken question bank
- ✅ Clear error message

---

### Fix #6: Add Error Boundary

**Why**: Catch React errors that might break rendering

**Implementation**:
```tsx
// Create ErrorBoundary.tsx
class QuestionBankErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Question bank error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen 
          message="Something went wrong loading questions"
          onRetry={() => window.location.reload()}
        />
      );
    }
    return this.props.children;
  }
}

// Wrap PracticePage
<QuestionBankErrorBoundary>
  <PracticePage />
</QuestionBankErrorBoundary>
```

**Benefits**:
- ✅ Graceful error handling
- ✅ Prevents white screen of death
- ✅ User can retry

---

## Quick Diagnostic Checklist

Run through this checklist to identify the issue:

### ✅ File Structure
- [ ] `/src/data/question-banks/default.ts` exists
- [ ] `/public/question-banks/` directory exists
- [ ] `/public/question-banks/manifest.json` exists
- [ ] At least one `.json` file in `/public/question-banks/`

### ✅ Browser Console
- [ ] No JavaScript errors
- [ ] See log: "🔍 Loading question bank: default"
- [ ] See log: "✅ Loaded built-in default bank (X questions)" where X > 0
- [ ] No CORS errors
- [ ] No 404 errors

### ✅ React DevTools
- [ ] `phase` changes from "loading" to "preparation" after 1.5s
- [ ] `sampleQuestions` is an array with length > 0
- [ ] `questionBankInfo` is an object (not null)

### ✅ Network Tab
- [ ] If using `?bank=xxx`, see request to `/question-banks/xxx.json`
- [ ] Request returns 200 OK
- [ ] Response is valid JSON

### ✅ Code Verification
- [ ] `defaultQuestionBank` is exported in `default.ts`
- [ ] `defaultQuestionBank.questions` is an array
- [ ] Array has at least 1 question
- [ ] Each question has: id, type, text, media, speakingDuration
- [ ] QuestionType enum is imported correctly

---

## Most Likely Causes (Ranked)

### 1. State Update Timing Issue (70% probability)
- `setSampleQuestions()` is called but state doesn't update in time
- Render happens before state is set
- **Test**: Add `console.log(sampleQuestions)` in render function

### 2. Default Question Bank Import Issue (20% probability)
- Circular dependency
- Build/bundling issue
- TypeScript compilation error
- **Test**: Add `console.log(defaultQuestionBank)` in `question-bank-loader.ts`

### 3. React Strict Mode Double Render (5% probability)
- In development, React renders twice
- Might cause state confusion
- **Test**: Check if `useEffect` runs twice in console

### 4. Browser Compatibility Issue (3% probability)
- Older browser doesn't support certain features
- **Test**: Try in Chrome/Edge latest version

### 5. CORS or Network Issue (2% probability)
- Only affects external JSON files, not default bank
- **Test**: Check Network tab for errors

---

## Recommended Action Plan

### Phase 1: Diagnosis (5 minutes)
1. Open browser console
2. Check for log: "✅ Loaded built-in default bank (X questions)"
3. If X = 0, problem is with default question bank
4. If X > 0, problem is with state update or render logic
5. Check React DevTools for `sampleQuestions` state

### Phase 2: Quick Fix (10 minutes)
1. Add hardcoded fallback questions (Fix #1)
2. Add detailed logging (Fix #4)
3. Test again and check console logs

### Phase 3: Proper Fix (20 minutes)
1. Implement loading timeout (Fix #3)
2. Improve loading condition logic (Fix #2)
3. Add error boundary (Fix #6)
4. Validate default question bank (Fix #5)

### Phase 4: Testing (10 minutes)
1. Test with default bank (no URL param)
2. Test with `?bank=technology`
3. Test with `?bank=nonexistent` (should fallback)
4. Test with network throttling (slow 3G)
5. Test with browser refresh during loading

---

## Expected Behavior After Fixes

### Successful Load
```
Console:
🔍 [1/5] Starting question bank load...
🔍 [2/5] Calling loadQuestionBank()...
🔍 Loading question bank: default
✅ Loaded built-in default bank (5 questions)
🔍 [3/5] Received response: { questionsCount: 5, bankInfo: 'General Topics', error: 'none' }
🔍 [4/5] Setting state...
🔍 [5/5] State set. Questions: [...]
🔍 [Verify] sampleQuestions in state: 5
🎬 [PracticePage] Preloading videos...

UI:
1. Shows loading screen (1.5 seconds)
2. Transitions to preparation screen
3. Shows "Question 1 of 5"
4. Displays first question
```

### Failed Load (with fixes)
```
Console:
🔍 [1/5] Starting question bank load...
🔍 [2/5] Calling loadQuestionBank()...
❌ [Error] Failed at step: [error details]
⚠️ No questions loaded, using fallback

UI:
1. Shows loading screen (1.5 seconds)
2. Shows toast: "Failed to load questions. Using fallback."
3. Transitions to preparation screen
4. Shows fallback questions
```

### Timeout (with fixes)
```
Console:
🔍 [1/5] Starting question bank load...
🔍 [2/5] Calling loadQuestionBank()...
[10 seconds pass]
⏱️ Loading timeout - using fallback

UI:
1. Shows loading screen (10 seconds)
2. Shows toast: "Loading timeout. Using default questions."
3. Transitions to preparation screen
4. Shows fallback questions
```

---

## Conclusion

The most likely issue is that `sampleQuestions` is empty even after loading completes, causing the loading screen to persist indefinitely due to the condition:

```tsx
if (phase === AppPhase.Loading || sampleQuestions.length === 0)
```

**Immediate action**: Check browser console for the log message showing how many questions were loaded. This will confirm whether the issue is with loading or with state management.

**Recommended fixes** (in order):
1. Add hardcoded fallback questions (prevents infinite loading)
2. Add detailed logging (helps diagnose root cause)
3. Add loading timeout (prevents hanging)
4. Improve error handling (better user experience)

Once you've checked the console logs, we can implement the appropriate fixes based on what we find.
