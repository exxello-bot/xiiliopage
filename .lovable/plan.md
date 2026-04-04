

## Make It a Mobile-First App Experience

### Overview
Transform the app so login/signup is the first thing users see (like a native mobile app), with a bottom tab navigation for the main app experience after authentication. The landing page content moves behind auth, and the UI gets mobile-app styling (bottom nav bar, no desktop navbar, safe area insets).

### Step 1: Auth-First Routing
- Change `/` to redirect to `/login` if not authenticated, or to the main app shell if authenticated
- Keep the landing page content accessible at `/explore` or similar for marketing (optional)
- Add an auth guard wrapper component that checks session state and redirects unauthenticated users to `/login`

### Step 2: Redesign Login & Signup for Mobile
- Make login/signup pages full-screen, mobile-native feeling with the Xiilio brand logo at top
- Add smooth transitions between login ↔ signup
- Remove the admin/customer toggle from login (simplify — role detection happens automatically after login)
- Add "Continue as Guest" option to browse the landing page without logging in

### Step 3: Create App Shell with Bottom Tab Navigation
After login, users land in a mobile app shell with 4 bottom tabs:
- **Home** — Dashboard/portal showing inquiry status cards
- **Chat** — AI chat with Aria + message threads
- **Services** — Browse Xiilio's service offerings
- **Profile** — Account settings, sign out, app info

### Step 4: Mobile-Optimized UI
- Add a `MobileAppShell` layout component with bottom `TabBar`
- Use `safe-area-inset` padding for notch/home-indicator devices
- Hide the desktop `Navbar` when inside the app shell
- Add page transition animations for a native feel
- Ensure all pages use mobile-friendly touch targets (min 44px)

### Step 5: Update Capacitor Config
- Set the server URL for hot-reload during development
- Ensure splash screen flows into the auth screen

### Technical Details
- **New components**: `AppShell.tsx` (bottom tab layout), `AuthGuard.tsx` (route protection), `BottomTabBar.tsx`
- **Modified**: `App.tsx` (restructure routes), `Login.tsx` & `Signup.tsx` (mobile redesign), `capacitor.config.ts` (add server URL)
- **New pages**: Refactored tab pages for Home, Chat, Services, Profile
- **No database changes needed** — all existing tables and auth work as-is

