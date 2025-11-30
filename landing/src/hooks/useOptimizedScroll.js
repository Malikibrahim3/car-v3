import { useEffect, useRef, useCallback } from 'react'
import throttle from 'lodash.throttle'

/**
 * Custom hook for optimized scroll handling using requestAnimationFrame
 * and throttling to prevent jank and layout thrashing
 */
export function useOptimizedScroll(callback, deps = [], throttleMs = 16) {
  const rafId = useRef(null)
  const ticking = useRef(false)

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      rafId.current = requestAnimationFrame(() => {
        callback()
        ticking.current = false
      })
      ticking.current = true
    }
  }, [callback])

  const throttledScroll = useCallback(
    throttle(handleScroll, throttleMs, { leading: true, trailing: true }),
    [handleScroll, throttleMs]
  )

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll, { passive: true })
    // Initial call
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', throttledScroll)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      throttledScroll.cancel()
    }
  }, [throttledScroll, handleScroll, ...deps])
}

/**
 * Hook for intersection observer based animations
 * More performant than scroll-based for visibility detection
 */
export function useIntersectionObserver(ref, options = {}) {
  const { threshold = 0.1, rootMargin = '0px', onIntersect } = options

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (onIntersect) {
            onIntersect(entry)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref, threshold, rootMargin, onIntersect])
}

/**
 * Batch DOM reads and writes to prevent layout thrashing
 */
export function batchDOMUpdates(reads, writes) {
  // Read phase - all DOM reads
  const values = reads()
  
  // Write phase - all DOM writes in rAF
  requestAnimationFrame(() => {
    writes(values)
  })
}
