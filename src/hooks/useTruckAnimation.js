import { useState, useEffect } from 'react'

function useTruckAnimation() {
  const [state, setState] = useState({ currentStopIndex: 0, progress: 0 })

  useEffect(() => {
    const intervalId = setInterval(() => {
      setState((prev) => {
        if (prev.currentStopIndex >= 3) {
          return prev
        }

        const nextProgress = prev.progress + 0.01

        if (nextProgress >= 1) {
          return { currentStopIndex: prev.currentStopIndex + 1, progress: 0 }
        }

        return { ...prev, progress: nextProgress }
      })
    }, 50)

    return () => clearInterval(intervalId)
  }, [])

  const reset = () => setState({ currentStopIndex: 0, progress: 0 })


  return {...state,reset}
}

export default useTruckAnimation