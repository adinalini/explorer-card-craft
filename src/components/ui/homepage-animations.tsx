import { useEffect, useState } from 'react'

interface TreeBranch {
  id: number
  startX: number
  startY: number
  angle: number
  length: number
  progress: number
}

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  speed: number
}

interface Dot {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  delay: number
}

interface Bird {
  id: number
  x: number
  y: number
  speed: number
  isPerched: boolean
  perchTarget?: { x: number; y: number }
}

export const TreeBranches = ({ isActive }: { isActive: boolean }) => {
  const [branches, setBranches] = useState<TreeBranch[]>([])

  useEffect(() => {
    if (isActive) {
      const newBranches: TreeBranch[] = []
      const sides = ['top', 'bottom', 'left', 'right']
      
      sides.forEach((side, sideIndex) => {
        for (let i = 0; i < 8; i++) {
          let startX, startY, angle
          
          switch (side) {
            case 'top':
              startX = (window.innerWidth / 8) * i
              startY = 0
              angle = Math.random() * 60 + 60 // 60-120 degrees
              break
            case 'bottom':
              startX = (window.innerWidth / 8) * i
              startY = window.innerHeight
              angle = Math.random() * 60 + 240 // 240-300 degrees
              break
            case 'left':
              startX = 0
              startY = (window.innerHeight / 8) * i
              angle = Math.random() * 60 + 330 // 330-30 degrees (wrapping)
              break
            case 'right':
              startX = window.innerWidth
              startY = (window.innerHeight / 8) * i
              angle = Math.random() * 60 + 150 // 150-210 degrees
              break
            default:
              startX = 0
              startY = 0
              angle = 0
          }
          
          newBranches.push({
            id: sideIndex * 8 + i,
            startX,
            startY,
            angle,
            length: Math.random() * 200 + 100,
            progress: 0
          })
        }
      })
      
      setBranches(newBranches)
      
      // Animate branches growing
      const interval = setInterval(() => {
        setBranches(prev => prev.map(branch => ({
          ...branch,
          progress: Math.min(branch.progress + 0.05, 1)
        })))
      }, 16)
      
      return () => clearInterval(interval)
    } else {
      // Animate branches retreating
      const interval = setInterval(() => {
        setBranches(prev => {
          const updated = prev.map(branch => ({
            ...branch,
            progress: Math.max(branch.progress - 0.1, 0)
          }))
          
          if (updated.every(branch => branch.progress === 0)) {
            clearInterval(interval)
            return []
          }
          
          return updated
        })
      }, 16)
      
      return () => clearInterval(interval)
    }
  }, [isActive])

  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      <svg width="100%" height="100%" className="absolute inset-0">
        {branches.map(branch => {
          const endX = branch.startX + Math.cos(branch.angle * Math.PI / 180) * branch.length * branch.progress
          const endY = branch.startY + Math.sin(branch.angle * Math.PI / 180) * branch.length * branch.progress
          
          return (
            <line
              key={branch.id}
              x1={branch.startX}
              y1={branch.startY}
              x2={endX}
              y2={endY}
              stroke="hsl(var(--homepage-button-cards))"
              strokeWidth="3"
              strokeLinecap="round"
              opacity={branch.progress}
            />
          )
        })}
      </svg>
    </div>
  )
}

export const FloatingBubbles = ({ isActive }: { isActive: boolean }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive) {
      interval = setInterval(() => {
        const shouldAddBubble = Math.random() < 0.5 // 50% chance per second (adjusted for 500ms interval)
        
        if (shouldAddBubble) {
          const newBubble: Bubble = {
            id: Date.now() + Math.random(),
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 20,
            size: Math.random() * 30 + 10,
            speed: Math.random() * 2 + 1
          }
          
          setBubbles(prev => [...prev, newBubble])
        }
      }, 500)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive])

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setBubbles(prev => prev
        .map(bubble => ({
          ...bubble,
          y: bubble.y - bubble.speed
        }))
        .filter(bubble => bubble.y > -50)
      )
    }, 16)

    return () => clearInterval(animationInterval)
  }, [])

  useEffect(() => {
    if (!isActive) {
      setBubbles([])
    }
  }, [isActive])

  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full opacity-70"
          style={{
            left: bubble.x,
            top: bubble.y,
            width: bubble.size,
            height: bubble.size,
            backgroundColor: 'hsl(var(--homepage-button-decks))',
            border: '2px solid hsl(var(--homepage-button-decks) / 0.3)',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  )
}

export const FloatingDots = ({ isActive }: { isActive: boolean }) => {
  const [dots, setDots] = useState<Dot[]>([])

  useEffect(() => {
    if (isActive) {
      const newDots: Dot[] = []
      
      for (let i = 0; i < 50; i++) {
        newDots.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 8 + 2,
          opacity: 0,
          delay: i * 20 // Stagger appearance
        })
      }
      
      setDots(newDots)
      
      // Animate dots appearing
      const interval = setInterval(() => {
        setDots(prev => prev.map(dot => ({
          ...dot,
          opacity: dot.delay <= 0 ? Math.min(dot.opacity + 0.1, 1) : (dot.delay -= 20, dot.opacity),
        })))
      }, 16)
      
      return () => clearInterval(interval)
    } else {
      // Animate dots disappearing in reverse order at double speed
      const interval = setInterval(() => {
        setDots(prev => {
          const updated = prev.map((dot, index) => ({
            ...dot,
            opacity: Math.max(dot.opacity - 0.2, 0),
            delay: (prev.length - index - 1) * 10 // Reverse delay
          }))
          
          if (updated.every(dot => dot.opacity === 0)) {
            clearInterval(interval)
            return []
          }
          
          return updated
        })
      }, 16)
      
      return () => clearInterval(interval)
    }
  }, [isActive])

  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      {dots.map(dot => (
        <div
          key={dot.id}
          className="absolute rounded-full transition-opacity duration-100"
          style={{
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            backgroundColor: 'hsl(var(--homepage-button-draft))',
            opacity: dot.opacity,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  )
}

export const FlyingBirds = ({ isActive }: { isActive: boolean }) => {
  const [birds, setBirds] = useState<Bird[]>([])

  useEffect(() => {
    if (isActive) {
      const newBirds: Bird[] = []
      
      for (let i = 0; i < 15; i++) {
        const isPerched = Math.random() < 0.3
        newBirds.push({
          id: i,
          x: -50,
          y: Math.random() * window.innerHeight,
          speed: Math.random() * 3 + 2,
          isPerched,
          perchTarget: isPerched ? {
            x: Math.random() * window.innerWidth,
            y: Math.random() * (window.innerHeight * 0.6) + (window.innerHeight * 0.2)
          } : undefined
        })
      }
      
      setBirds(newBirds)
    } else {
      // All birds fly off screen
      setBirds(prev => prev.map(bird => ({
        ...bird,
        isPerched: false,
        perchTarget: undefined,
        speed: bird.speed * 2
      })))
      
      // Clean up after they've flown off
      setTimeout(() => {
        setBirds([])
      }, 3000)
    }
  }, [isActive])

  useEffect(() => {
    if (birds.length === 0) return

    const interval = setInterval(() => {
      setBirds(prev => prev
        .map(bird => {
          if (bird.isPerched && bird.perchTarget) {
            // Move towards perch target
            const dx = bird.perchTarget.x - bird.x
            const dy = bird.perchTarget.y - bird.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < 5) {
              return { ...bird, x: bird.perchTarget.x, y: bird.perchTarget.y }
            }
            
            return {
              ...bird,
              x: bird.x + (dx / distance) * bird.speed,
              y: bird.y + (dy / distance) * bird.speed
            }
          } else {
            // Fly across screen
            return {
              ...bird,
              x: bird.x + bird.speed
            }
          }
        })
        .filter(bird => bird.x < window.innerWidth + 100)
      )
    }, 16)

    return () => clearInterval(interval)
  }, [birds])

  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      {birds.map(bird => (
        <div
          key={bird.id}
          className="absolute text-xl"
          style={{
            left: bird.x,
            top: bird.y,
            color: 'hsl(var(--homepage-button-random))',
            transform: 'translate(-50%, -50%)'
          }}
        >
          🐦
        </div>
      ))}
    </div>
  )
}