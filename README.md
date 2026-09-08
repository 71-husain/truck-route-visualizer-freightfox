# Logistics Truck Route Visualizer

A frontend simulation of a truck moving through delivery locations, with a live-updating status panel tracking its progress in real time.

## Problem Statement

Build a frontend application that simulates a truck moving through delivery locations, showing:
- A map with an origin point and 3 delivery points (D1, D2, D3)
- An animated truck marker moving through the route: Origin → D1 → D2 → D3
- A live status panel showing current location, distance covered, next stop, and completed stops

## Key Assumptions

- **The "map" is a stylized, custom-built visualization — not a real-world geographic map.** The assignment's own reference mockup shows a plain grid background with abstract point placement, explicitly labeled "Mock map." Based on that, coordinates for Origin/D1/D2/D3 are arbitrary percentage-based (x, y) positions on a 0–100 grid — not real latitude/longitude. This was a deliberate choice: it matches what was actually shown in the brief, avoids unnecessary dependency on a third-party maps API (and any associated API key/billing setup), and keeps the focus on the skills actually being tested — state management, animation, and component design — rather than map-library configuration.
- **Distances (in km) between stops are mock/sample values**, defined in the simulated API response, used purely to demonstrate the "distance covered" calculation logic.
- **The truck moves at a constant, fixed animation speed** (not based on real-world time/speed) — chosen for a smooth, predictable, easily-demoable animation within a short assignment window.

## Architecture & Approach

### 1. Single source of truth for animation state
`hooks/useTruckAnimation.js` is a custom hook that owns **one combined state object**: `{ currentStopIndex, progress }`.//

- `currentStopIndex` — which leg of the journey the truck is currently on (0 = Origin→D1, 1 = D1→D2, 2 = D2→D3). Once it reaches 3, the truck has arrived at the final stop.
- `progress` — a value from 0 to 1 representing how far along the *current* leg the truck has travelled.

A `setInterval` inside `useEffect` advances `progress` by a small step roughly every 50ms. When `progress` reaches 1, it resets to 0 and `currentStopIndex` increments — moving to the next leg. Once `currentStopIndex` reaches 3, further updates become a no-op (the truck stays parked at the final stop).

**Why one combined state object instead of two separate `useState` calls:** Reading state directly inside a `setInterval` callback risks a classic React pitfall — a "stale closure," where the callback keeps referencing the value of state *as it was when the interval was first created*, not its current live value. Using the functional update form (`setState(prev => ...)`) with a single object guarantees every update always sees the true latest state, avoiding that bug entirely.

Every other value shown on screen (truck's visual position, current/next stop labels, distance covered) is **derived** from this one state on every render — nothing else is tracked as separate state, so nothing can ever get out of sync.

### 2. Truck position via linear interpolation
`components/RouteMap/RouteMap.jsx` calculates the truck's live (x, y) position by interpolating between its current stop and next stop, based on `progress`:

truckX = currentStop.x + (nextStop.x - currentStop.x) * progress
truckY = currentStop.y + (nextStop.y - currentStop.y) * progress

This is what makes the truck appear to move smoothly along each leg, rather than jumping instantly from stop to stop.

### 3. Map rendering with SVG
The map is built with plain SVG:
- `<polyline>` for the full planned route (dashed, light gray) — built once from all 4 stops' coordinates
- A second `<polyline>` for the completed route (solid, green) — built from stops already passed **plus the truck's current live position** as the final point, so this line visibly grows as the truck moves
- Each stop is a positioned marker with a label
- The truck itself is rendered using a `react-icons` truck icon, positioned the same way as the stop markers, and horizontally flipped via CSS depending on travel direction (so it visually faces the way it's moving)

### 4. Simulated API layer
`api/mockRouteData.js` exports a `fetchRouteData()` function returning a `Promise` with an artificial network delay — mirroring how a real API call would behave (loading state, async resolution), even though the data itself is hardcoded. `App.jsx` calls this inside a `useEffect` + `useState` pattern, with a loading guard shown while data hasn't resolved yet.

### 5. Status panel — derived, not duplicated
`components/StatusPanel/StatusPanel.jsx` computes all four displayed values directly from props on every render:
- **Current location** — the current stop's label, or "Between X → Y" if actively moving
- **Distance covered** — sum of fully completed legs' distances + (current leg's distance × progress)
- **Next stop** — the next stop's label, or "Arrived" once at the final stop
- **Completed stops** — `currentStopIndex / 3`

No separate state is kept for any of these — they're recalculated from `currentStopIndex`/`progress`/`legDistances` every time the component re-renders, which is standard React practice for derived values (no `useEffect` needed, since this isn't a side effect).

### 6. Responsive layout
- On small screens: the status panel sits as a normal block below the map (stacked layout)
- On larger screens (`lg:` breakpoint and up): the status panel becomes an absolutely-positioned overlay in the map's bottom-right corner, matching the assignment's reference mockup layout
- Handled entirely with Tailwind's responsive utility classes — no JavaScript/conditional rendering needed

## Features
- Animated truck marker moving Origin → D1 → D2 → D3
- Live status panel: current location, distance covered, next stop, completed stops
- Dual route lines: full dashed planned route + solid growing completed route
- Truck icon flips direction based on travel direction
- Restart button to replay the animation from the beginning
- Fully responsive layout (mobile: stacked, desktop: floating overlay panel)

## Tech Stack
- React + Vite
- Tailwind CSS
- react-icons (for the truck icon)
- Plain SVG (no third-party map library or API key required)


## How to Run
```bash
npm install
npm run dev
```
