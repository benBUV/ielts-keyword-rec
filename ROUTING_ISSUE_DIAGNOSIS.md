# Routing Issue Diagnosis: URL Reversion and Query Parameter Loss

## Date: 2025-11-18

---

## Problem Statement

When accessing the application at `http://localhost:5173/ielts-speaking`, the browser address bar reverts to `http://localhost:5173/` and removes any query parameters (e.g., `?bank=technology`).

**Example**:
- User navigates to: `http://localhost:5173/ielts-speaking?bank=technology`
- Browser redirects to: `http://localhost:5173/`
- Query parameter `?bank=technology` is lost

---

## Root Cause Analysis

### Issue #1: Catch-All Route Redirect (PRIMARY CAUSE)

**Location**: `src/App.tsx` line 20

```tsx
<Route path="*" element={<Navigate to="/" replace />} />
```

**Problem**:
- This catch-all route (`path="*"`) matches ANY path that doesn't match defined routes
- Since only `/` is defined in `routes.tsx`, the path `/ielts-speaking` is unmatched
- React Router treats `/ielts-speaking` as an undefined route
- The catch-all route redirects to `/` with `replace` flag
- The `replace` flag removes the current entry from browser history
- Query parameters are NOT preserved during redirect

**Flow Diagram**:
```
User navigates to: /ielts-speaking?bank=technology
         ↓
React Router checks routes:
  - Route 1: path="/" → No match
  - Route 2: path="*" → Match! (catch-all)
         ↓
Execute: <Navigate to="/" replace />
         ↓
Browser URL becomes: /
Query params lost: ?bank=technology is removed
```

---

### Issue #2: No Route Defined for `/ielts-speaking`

**Location**: `src/routes.tsx` lines 11-17

```tsx
const routes: RouteConfig[] = [
  {
    name: 'IELTS Speaking Practice',
    path: '/',  // ← Only root path is defined
    element: <PracticePage />
  }
];
```

**Problem**:
- Only the root path `/` is defined
- No route for `/ielts-speaking` exists
- Any path other than `/` will trigger the catch-all redirect

---

### Issue #3: No Base Path Configuration

**Location**: `vite.config.ts`

```tsx
export default defineConfig({
  plugins: [react(), svgr(), miaodaDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // No base path configured
});
```

**Problem**:
- Vite's `base` option is not set
- Default base is `/` (root)
- If the app is deployed to a subdirectory (e.g., `/ielts-speaking`), assets won't load correctly
- However, this doesn't cause the redirect issue (that's from React Router)

---

## Why Query Parameters Are Lost

### Query Parameter Preservation in React Router

**Current redirect**:
```tsx
<Navigate to="/" replace />
```

**What happens**:
1. User navigates to `/ielts-speaking?bank=technology`
2. React Router matches catch-all route `*`
3. `<Navigate to="/" replace />` executes
4. Browser navigates to `/` (no query params specified)
5. Query params are NOT automatically preserved

**To preserve query params**, you need:
```tsx
import { useLocation } from 'react-router-dom';

const location = useLocation();
<Navigate to={`/${location.search}`} replace />
```

But this is a workaround - the real fix is to define proper routes.

---

## Deployment Context Analysis

### Scenario A: App Deployed at Root (`/`)

**Expected URL**: `http://localhost:5173/`

**Current behavior**: ✅ Works correctly
- User navigates to `/`
- Route matches
- App loads

**With query params**: ✅ Works correctly
- User navigates to `/?bank=technology`
- Route matches
- Query params preserved
- App loads with technology bank

---

### Scenario B: App Deployed at Subdirectory (`/ielts-speaking`)

**Expected URL**: `http://localhost:5173/ielts-speaking`

**Current behavior**: ❌ Redirects to `/`
- User navigates to `/ielts-speaking`
- No route matches
- Catch-all redirects to `/`
- App loads at wrong URL

**With query params**: ❌ Redirects and loses params
- User navigates to `/ielts-speaking?bank=technology`
- No route matches
- Catch-all redirects to `/`
- Query params lost
- App loads at wrong URL with default bank

---

### Scenario C: Canvas LMS Iframe Embedding

**Canvas LMS typically embeds apps at**: `/courses/{id}/external_tools/{tool_id}`

**If Canvas redirects to**: `/ielts-speaking`

**Current behavior**: ❌ Fails
- Canvas loads iframe with URL: `http://your-domain.com/ielts-speaking`
- React Router redirects to `/`
- Iframe shows app at wrong URL
- Canvas may show error or blank page

---

## Solution Options

### Option 1: Add Route for `/ielts-speaking` (RECOMMENDED)

**Best for**: Apps that need to support both root and subdirectory deployments

**Implementation**:

```tsx
// src/routes.tsx
const routes: RouteConfig[] = [
  {
    name: 'IELTS Speaking Practice',
    path: '/',
    element: <PracticePage />
  },
  {
    name: 'IELTS Speaking Practice',
    path: '/ielts-speaking',
    element: <PracticePage />
  }
];
```

**Pros**:
- ✅ Supports both `/` and `/ielts-speaking` URLs
- ✅ Query parameters preserved
- ✅ No redirect, direct route match
- ✅ Works in Canvas LMS iframes
- ✅ Simple implementation

**Cons**:
- ⚠️ Duplicate route definition (minor)
- ⚠️ Need to maintain both routes

---

### Option 2: Use Wildcard Route with Same Component

**Best for**: Apps that should work at any path

**Implementation**:

```tsx
// src/routes.tsx
const routes: RouteConfig[] = [
  {
    name: 'IELTS Speaking Practice',
    path: '*',  // Match any path
    element: <PracticePage />
  }
];

// src/App.tsx - Remove catch-all redirect
<Routes>
  {routes.map((route, index) => (
    <Route
      key={index}
      path={route.path}
      element={route.element}
    />
  ))}
  {/* Remove: <Route path="*" element={<Navigate to="/" replace />} /> */}
</Routes>
```

**Pros**:
- ✅ Works at any URL path
- ✅ Query parameters preserved
- ✅ Single route definition
- ✅ Maximum flexibility

**Cons**:
- ⚠️ Less explicit about supported paths
- ⚠️ May hide routing errors

---

### Option 3: Configure Base Path in Vite + Router Basename

**Best for**: Apps deployed to a fixed subdirectory

**Implementation**:

```tsx
// vite.config.ts
export default defineConfig({
  base: '/ielts-speaking/',  // Note trailing slash
  plugins: [react(), svgr(), miaodaDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

// src/App.tsx
<Router basename="/ielts-speaking">
  {/* Routes */}
</Router>

// src/routes.tsx - Keep root path
const routes: RouteConfig[] = [
  {
    name: 'IELTS Speaking Practice',
    path: '/',  // This becomes /ielts-speaking/ with basename
    element: <PracticePage />
  }
];
```

**Pros**:
- ✅ Proper subdirectory deployment
- ✅ Assets load correctly
- ✅ Clean route definitions
- ✅ Query parameters preserved

**Cons**:
- ⚠️ App ONLY works at `/ielts-speaking/`, not at root
- ⚠️ Requires rebuild for different deployment paths
- ⚠️ More complex configuration

---

### Option 4: Preserve Query Params in Redirect (WORKAROUND)

**Best for**: Temporary fix while planning proper solution

**Implementation**:

```tsx
// src/App.tsx
import { useLocation, Navigate } from 'react-router-dom';

const RedirectWithQuery = () => {
  const location = useLocation();
  return <Navigate to={`/${location.search}`} replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
            <Route path="*" element={<RedirectWithQuery />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </Router>
  );
};
```

**Pros**:
- ✅ Preserves query parameters during redirect
- ✅ Minimal code change

**Cons**:
- ❌ Still redirects (URL changes)
- ❌ Doesn't solve the root cause
- ❌ Not ideal for Canvas LMS embedding

---

## Recommended Solution

### For Your Use Case: Option 1 (Add Route for `/ielts-speaking`)

**Reasoning**:
1. **Canvas LMS Compatibility**: Canvas may embed at `/ielts-speaking`
2. **Query Parameter Support**: Need to support `?bank=technology`
3. **Flexibility**: Works at both `/` and `/ielts-speaking`
4. **Simplicity**: Easy to implement and understand

**Implementation Steps**:

1. **Update `src/routes.tsx`**:
```tsx
const routes: RouteConfig[] = [
  {
    name: 'IELTS Speaking Practice',
    path: '/',
    element: <PracticePage />
  },
  {
    name: 'IELTS Speaking Practice',
    path: '/ielts-speaking',
    element: <PracticePage />
  }
];
```

2. **Keep `src/App.tsx` unchanged** (catch-all redirect is fine now)

3. **Test URLs**:
   - ✅ `http://localhost:5173/` → Works
   - ✅ `http://localhost:5173/?bank=technology` → Works
   - ✅ `http://localhost:5173/ielts-speaking` → Works
   - ✅ `http://localhost:5173/ielts-speaking?bank=technology` → Works
   - ✅ `http://localhost:5173/invalid-path` → Redirects to `/`

---

## Alternative: If You Want App to Work at ANY Path

### Use Option 2 (Wildcard Route)

**Implementation**:

```tsx
// src/routes.tsx
const routes: RouteConfig[] = [
  {
    name: 'IELTS Speaking Practice',
    path: '*',  // Match any path
    element: <PracticePage />
  }
];

// src/App.tsx
const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
            {/* Remove catch-all redirect */}
          </Routes>
        </main>
      </div>
      <Toaster />
    </Router>
  );
};
```

**Test URLs**:
- ✅ `http://localhost:5173/` → Works
- ✅ `http://localhost:5173/ielts-speaking` → Works
- ✅ `http://localhost:5173/any/path/here` → Works
- ✅ All query params preserved

---

## Canvas LMS Integration Considerations

### Canvas External Tool Configuration

When configuring the app as a Canvas External Tool, you'll specify a **Launch URL**.

**Option A: Launch at Root**
```
Launch URL: https://your-domain.com/
```
- Works with current setup
- Query params can be added: `https://your-domain.com/?bank=technology`

**Option B: Launch at Subdirectory**
```
Launch URL: https://your-domain.com/ielts-speaking
```
- Requires Option 1 or Option 2 fix
- Query params can be added: `https://your-domain.com/ielts-speaking?bank=technology`

**Option C: Canvas Passes Custom Parameters**
```
Launch URL: https://your-domain.com/?bank=$Canvas.course.id
```
- Canvas can inject course ID or other variables
- Requires query param preservation

---

## Testing Checklist

After implementing the fix, test these scenarios:

### Basic Navigation
- [ ] Navigate to `/` → App loads
- [ ] Navigate to `/ielts-speaking` → App loads (no redirect)
- [ ] Navigate to `/invalid-path` → Redirects to `/` (if using Option 1)

### Query Parameters
- [ ] Navigate to `/?bank=technology` → Technology bank loads
- [ ] Navigate to `/ielts-speaking?bank=technology` → Technology bank loads
- [ ] Navigate to `/?bank=education` → Education bank loads
- [ ] Navigate to `/ielts-speaking?bank=education` → Education bank loads

### Browser Behavior
- [ ] URL in address bar stays as entered (no redirect)
- [ ] Query parameters remain in address bar
- [ ] Browser back button works correctly
- [ ] Refresh page maintains URL and query params

### Canvas LMS Simulation
- [ ] Embed in iframe with src="/ielts-speaking" → Works
- [ ] Embed in iframe with src="/ielts-speaking?bank=technology" → Works
- [ ] Iframe URL doesn't change after load

---

## Summary

**Problem**: 
- URL `/ielts-speaking` redirects to `/` due to catch-all route
- Query parameters are lost during redirect

**Root Cause**: 
- Only `/` route is defined
- Catch-all route redirects all other paths to `/`
- Redirect doesn't preserve query parameters

**Recommended Fix**: 
- Add explicit route for `/ielts-speaking` in `routes.tsx`
- This allows both `/` and `/ielts-speaking` to work
- Query parameters are preserved (no redirect needed)

**Alternative Fix**: 
- Use wildcard route `path="*"` to match any path
- Remove catch-all redirect
- Maximum flexibility for deployment

**Implementation Time**: 
- 2 minutes (add one route definition)

**Testing Time**: 
- 5 minutes (verify all URL patterns work)

---

## Next Steps

1. Choose solution (Option 1 recommended)
2. Implement code changes
3. Test all URL patterns
4. Test with query parameters
5. Test in Canvas LMS iframe (if applicable)
6. Document deployment URL for Canvas configuration
