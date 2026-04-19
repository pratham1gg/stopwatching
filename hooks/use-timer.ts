"use client"

import { useState, useRef, useCallback, useEffect } from "react"

interface UseTimerReturn {
  elapsed: number
  isRunning: boolean
  start: () => void
  stop: () => { finalElapsed: number }
  reset: () => void
}

export function useTimer(): UseTimerReturn {
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const startTimeRef = useRef(0)
  const accumulatedRef = useRef(0)
  const rafRef = useRef<number>(0)

  const tick = useCallback(() => {
    setElapsed(accumulatedRef.current + (Date.now() - startTimeRef.current))
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  function start() {
    startTimeRef.current = Date.now()
    setIsRunning(true)
    rafRef.current = requestAnimationFrame(tick)
  }

  function stop(): { finalElapsed: number } {
    cancelAnimationFrame(rafRef.current)
    const finalElapsed = accumulatedRef.current + (Date.now() - startTimeRef.current)
    accumulatedRef.current = finalElapsed
    setElapsed(finalElapsed)
    setIsRunning(false)
    return { finalElapsed }
  }

  function reset() {
    cancelAnimationFrame(rafRef.current)
    setIsRunning(false)
    setElapsed(0)
    accumulatedRef.current = 0
    startTimeRef.current = 0
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return { elapsed, isRunning, start, stop, reset }
}
