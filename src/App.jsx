import { useState, useEffect } from 'react'
import { fetchRouteData } from './api/mockRouteData'
import useTruckAnimation from './hooks/useTruckAnimation'
import RouteMap from './components/RouteMap/RouteMap'
import StatusPanel from './components/StatusPanel/StatusPanel'

function App() {
  const [routeData, setRouteData] = useState(null)
  const { currentStopIndex, progress ,reset} = useTruckAnimation()

  useEffect(() => {
    fetchRouteData().then((data) => setRouteData(data))
  }, [])

  if (!routeData) {
    return <div className="p-8 text-gray-500">Loading route...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button
  onClick={reset}
  className="mb-4 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
>
  Restart
</button>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Logistics Truck Route Visualizer
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative">
          <RouteMap
            stops={routeData.stops}
            currentStopIndex={currentStopIndex}
            progress={progress}
          />

          <div className='mt-4 md:mt-0 md:absolute md:bottom-4 md:right-4'>
         <StatusPanel
          stops={routeData.stops}
          legDistances={routeData.legDistances}
          currentStopIndex={currentStopIndex}
          progress={progress}
        />
       </div>
        </div>
      </div>
    </div>
  )
}

export default App