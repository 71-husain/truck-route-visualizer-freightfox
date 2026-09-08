import React from 'react'

function StatusPanel({ stops, currentStopIndex, progress, legDistances }) {
  const isArrived = currentStopIndex >= 3

  const currentLocation = progress <= 0.02
    ? `At ${stops[currentStopIndex].label}`
    : isArrived
      ? `At ${stops[currentStopIndex].label}`
      : `Between ${stops[currentStopIndex].label} → ${stops[currentStopIndex + 1].label}`

  let distanceCovered = 0
  for (let i = 0; i < currentStopIndex; i++) {
    distanceCovered += legDistances[i].km // full distance for completed legs
  }
  if (!isArrived) {
    distanceCovered += legDistances[currentStopIndex].km * progress // partial current leg
  }

  const nextStop = stops[currentStopIndex + 1]?.label ?? 'Arrived'
  const completedStops = `${currentStopIndex} / 3`

  return (
    <div className="bg-white shadow-md rounded-xl p-5 w-full lg:w-64 h-fit">
      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Truck Status</h3>
      <div className="flex flex-col gap-2 text-sm text-gray-800">
        <p><span className="text-gray-500">Current:</span> {currentLocation}</p>
        <p><span className="text-gray-500">Distance covered:</span> {distanceCovered.toFixed(1)} km</p>
        <p><span className="text-gray-500">Next stop:</span> {nextStop}</p>
        <p><span className="text-gray-500">Completed:</span> {completedStops}</p>
      </div>
    </div>
  )
}

export default StatusPanel