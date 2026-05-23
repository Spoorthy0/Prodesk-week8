import { useRef, useCallback } from 'react'

export function useInfiniteScroll(onLoadMore, isLoading, hasMore) {
  const observer = useRef(null)

  const sentinelRef = useCallback(
    (node) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            onLoadMore()
          }
        },
        { threshold: 0.1, rootMargin: '200px' }
      )

      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore, onLoadMore]
  )

  return sentinelRef
}
