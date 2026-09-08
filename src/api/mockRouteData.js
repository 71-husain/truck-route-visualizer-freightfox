
export const routeData = {
  stops: [
    { id: "origin", label: "Origin", x: 10, y: 80 },
    { id: "D1", label: "D1", x: 35, y: 40 },
    { id: "D2", label: "D2", x: 55, y: 55 },
    { id: "D3", label: "D3", x: 80, y: 25 },
  ],
  // Distance (in km) for each leg of the journey — used by the status panel
  legDistances: [
    { from: "origin", to: "D1", km: 4.2 },
    { from: "D1", to: "D2", km: 3.1 },
    { from: "D2", to: "D3", km: 5.6 },
  ],
}

export function fetchRouteData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(routeData), 300)
  })
}