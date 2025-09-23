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

interface PaintSplash {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  splashRadius: number
}

interface QuestionMark {
  id: number
  x: number
  y: number
  size: number
  opacity: number
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
        // 5 bubbles per second - add multiple bubbles each interval
        for (let i = 0; i < 1; i++) {
          const newBubble: Bubble = {
            id: Date.now() + Math.random() + i,
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 20,
            size: Math.random() * 30 + 10,
            speed: Math.random() * 2 + 1
          }
          
          setBubbles(prev => [...prev, newBubble])
        }
      }, 200) // 200ms interval = 5 per second
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
    <div className="fixed inset-0 pointer-events-none z-20">
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

export const PaintSplashes = ({ isActive }: { isActive: boolean }) => {
  const [splashes, setSplashes] = useState<PaintSplash[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive) {
      interval = setInterval(() => {
        // Get button positions to avoid spawning paint centers on them
        const buttonMargin = 100 // Margin around buttons
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight * 0.65 // Roughly where buttons are
        
        let x, y
        do {
          x = Math.random() * window.innerWidth
          y = Math.random() * window.innerHeight
        } while (
          // Avoid button area centers
          (x > centerX - window.innerWidth/4 - buttonMargin && 
           x < centerX + window.innerWidth/4 + buttonMargin &&
           y > centerY - window.innerHeight/8 - buttonMargin &&
           y < centerY + window.innerHeight/8 + buttonMargin)
        )
        
        const newSplash: PaintSplash = {
          id: Date.now() + Math.random(),
          x,
          y,
          size: Math.random() * 20 + 15,
          opacity: 0,
          splashRadius: Math.random() * 30 + 20
        }
        
        setSplashes(prev => [...prev, newSplash])
      }, 500) // 2 per second
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive])

  // Animate splashes appearing and disappearing
  useEffect(() => {
    const interval = setInterval(() => {
      setSplashes(prev => prev
        .map(splash => ({
          ...splash,
          opacity: isActive ? Math.min(splash.opacity + 0.1, 1) : Math.max(splash.opacity - 0.15, 0)
        }))
        .filter(splash => splash.opacity > 0)
      )
    }, 16)

    return () => clearInterval(interval)
  }, [isActive])

  useEffect(() => {
    if (!isActive) {
      // Clear all splashes when not active
      const timeout = setTimeout(() => {
        setSplashes([])
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [isActive])

  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      {splashes.map(splash => (
        <div key={splash.id}>
          {/* Main paint blob */}
          <div
            className="absolute rounded-full"
            style={{
              left: splash.x,
              top: splash.y,
              width: splash.size,
              height: splash.size,
              backgroundColor: 'hsl(var(--homepage-button-draft))',
              opacity: splash.opacity,
              transform: 'translate(-50%, -50%)'
            }}
          />
          {/* Splash droplets */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 60) * (Math.PI / 180)
            const distance = splash.splashRadius
            const dropletX = splash.x + Math.cos(angle) * distance
            const dropletY = splash.y + Math.sin(angle) * distance
            const dropletSize = Math.random() * 8 + 4
            
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: dropletX,
                  top: dropletY,
                  width: dropletSize,
                  height: dropletSize,
                  backgroundColor: 'hsl(var(--homepage-button-draft))',
                  opacity: splash.opacity * 0.7,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

export const FloatingQuestionMarks = ({ isActive }: { isActive: boolean }) => {
  const [questionMarks, setQuestionMarks] = useState<QuestionMark[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive) {
      interval = setInterval(() => {
        // Get button positions to avoid spawning question mark centers on them
        const buttonMargin = 80
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight * 0.65
        
        let x, y
        do {
          x = Math.random() * window.innerWidth
          y = Math.random() * window.innerHeight
        } while (
          // Avoid button area centers but allow spillover
          (x > centerX - window.innerWidth/4 - buttonMargin && 
           x < centerX + window.innerWidth/4 + buttonMargin &&
           y > centerY - window.innerHeight/8 - buttonMargin &&
           y < centerY + window.innerHeight/8 + buttonMargin)
        )
        
        const newQuestionMark: QuestionMark = {
          id: Date.now() + Math.random(),
          x,
          y,
          size: Math.random() * 20 + 15,
          opacity: 0
        }
        
        setQuestionMarks(prev => [...prev, newQuestionMark])
      }, 300) // Roughly 3 per second
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive])

  // Animate question marks appearing and disappearing
  useEffect(() => {
    const interval = setInterval(() => {
      setQuestionMarks(prev => prev
        .map(qm => ({
          ...qm,
          opacity: isActive ? Math.min(qm.opacity + 0.08, 1) : Math.max(qm.opacity - 0.12, 0)
        }))
        .filter(qm => qm.opacity > 0)
      )
    }, 16)

    return () => clearInterval(interval)
  }, [isActive])

  useEffect(() => {
    if (!isActive) {
      // Clear all question marks when not active
      const timeout = setTimeout(() => {
        setQuestionMarks([])
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [isActive])

  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      {questionMarks.map(qm => (
        <div
          key={qm.id}
          className="absolute font-bold select-none"
          style={{
            left: qm.x,
            top: qm.y,
            fontSize: qm.size + 'px',
            color: 'hsl(var(--homepage-button-random))',
            opacity: qm.opacity,
            transform: 'translate(-50%, -50%)'
          }}
        >
          ?
        </div>
      ))}
    </div>
  )
}