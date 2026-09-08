import React from 'react'
import { FaTruck } from 'react-icons/fa'

function RouteMap({ stops, currentStopIndex, progress }) {
  const currentStop = stops[currentStopIndex]
  const nextStop = stops[currentStopIndex + 1] ?? currentStop

  const truckX = currentStop.x + (nextStop.x - currentStop.x) * progress
  const truckY = currentStop.y + (nextStop.y - currentStop.y) * progress

  const fullRoutePoints = stops.map((s) => `${s.x},${s.y}`).join(' ')

  const completedStops = stops.slice(0, currentStopIndex + 1)
  const completedRoutePoints =
    completedStops.map((s) => `${s.x},${s.y}`).join(' ') + ` ${truckX},${truckY}`

  return (
    <div className="relative w-full h-96 bg-blue-50 border border-blue-200 rounded-xl">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        

        <polyline       //route path
          points={fullRoutePoints}
          fill="none"
          stroke="lightgray"
          strokeWidth="0.5"
          strokeDasharray="2"
        />

        <polyline  //completed route
          points={completedRoutePoints}
          fill="none"
          stroke="green"
          strokeWidth="0.5"
        />
      </svg>

      {stops.map((stop) => (
        <div
          key={stop.id}
          className="absolute w-3 h-3 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
        >
          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">
            {stop.label}
          </span>
        </div>
      ))}

      <div
        className="absolute text-xl -translate-x-1/2 -translate-y-1/2 transition-all"
        style={{ left: `${truckX}%`, top: `${truckY}%` }}
      >
        <FaTruck />
      </div>
    </div>
  )
}

export default RouteMap