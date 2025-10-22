import { useEffect, useRef } from 'react'

export function useImagePreloader(urls: string[], enabled: boolean = true) {
  const cacheRef = useRef<HTMLImageElement[]>([])

  useEffect(() => {
    if (!enabled || !urls || urls.length === 0) return

    const imgs: HTMLImageElement[] = []
    urls.forEach((url) => {
      if (!url) return
      const img = new Image()
      ;(img as any).fetchPriority = 'low'
      img.decoding = 'async'
      img.src = url
      imgs.push(img)
    })

    // keep references to avoid GC during preloading
    cacheRef.current = imgs

    return () => {
      // allow GC later
      cacheRef.current = []
    }
  }, [enabled, JSON.stringify(urls)])
}
