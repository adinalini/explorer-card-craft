import { useEffect, useState } from 'react'

interface TreeBranch {
  id: number
  startX: number
  startY: number
  angle: number
  length: number
  progress: number
  phase: 'growing-20' | 'growing-80' | 'complete'
  phaseStartTime: number
  leaves: TreeLeaf[]
}

interface TreeLeaf {
  id: number
  branchId: number
  position: number // 0-1 along the branch
  side: 'left' | 'right'
  opacity: number
}

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  speed: number
}

interface Flower {
  id: number
  x: number
  y: number
  centerSize: number
  petals: FlowerPetal[]
  opacity: number
  phase: 'growing' | 'complete' | 'fading'
  phaseStartTime: number
}

interface FlowerPetal {
  id: number
  angle: number
  size: number
  opacity: number
}

interface QuestionMark {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  rotation: number
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
            progress: 0,
            phase: 'growing-20',
            phaseStartTime: Date.now(),
            leaves: []
          })
        }
      })
      
      setBranches(newBranches)
      
      // Animation loop
      const interval = setInterval(() => {
        setBranches(prev => prev.map(branch => {
          const now = Date.now()
          const elapsed = now - branch.phaseStartTime
          
          if (branch.phase === 'growing-20') {
            const progress = Math.min(elapsed / 2000, 1) // 2 seconds for 20%
            if (progress >= 1) {
              return {
                ...branch,
                progress: 0.2,
                phase: 'growing-80',
                phaseStartTime: now
              }
            }
            return { ...branch, progress: progress * 0.2 }
          } else if (branch.phase === 'growing-80') {
            const progress = Math.min(elapsed / 3000, 1) // 3 seconds for 80%
            if (progress >= 1) {
              return {
                ...branch,
                progress: 1,
                phase: 'complete',
                phaseStartTime: now
              }
            }
            return { ...branch, progress: 0.2 + (progress * 0.8) }
          }
          
          return branch
        }))
      }, 16)
      
      // Leaf spawning - spawn leaves at specific positions alternating sides
      const leafInterval = setInterval(() => {
        setBranches(prev => prev.map(branch => {
          if (branch.phase === 'complete' && branch.leaves.length < 9) { // 9 leaves: 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%, 100%
            const positions = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
            const nextPosition = positions[branch.leaves.length]
            
            if (nextPosition) {
              const newLeaf: TreeLeaf = {
                id: Date.now() + Math.random(),
                branchId: branch.id,
                position: nextPosition,
                side: branch.leaves.length % 2 === 0 ? 'left' : 'right',
                opacity: 0
              }
              
              return {
                ...branch,
                leaves: [...branch.leaves, newLeaf]
              }
            }
          }
          return branch
        }))
      }, 200) // 5 per second, but limited by positions
      
      // Leaf opacity animation
      const leafOpacityInterval = setInterval(() => {
        setBranches(prev => prev.map(branch => ({
          ...branch,
          leaves: branch.leaves.map(leaf => ({
            ...leaf,
            opacity: Math.min(leaf.opacity + 0.1, 1)
          }))
        })))
      }, 16)
      
      // Fade leaves and restart after all leaves are visible
      const fadeInterval = setInterval(() => {
        setBranches(prev => prev.map(branch => {
          if (branch.leaves.length === 9 && branch.leaves.every(leaf => leaf.opacity >= 1)) {
            // Start fading after 2 seconds
            return {
              ...branch,
              leaves: branch.leaves.map(leaf => ({
                ...leaf,
                opacity: Math.max(leaf.opacity - 0.05, 0)
              }))
            }
          }
          
          // If all leaves faded, reset branch
          if (branch.leaves.length > 0 && branch.leaves.every(leaf => leaf.opacity <= 0)) {
            return {
              ...branch,
              progress: 0,
              phase: 'growing-20',
              phaseStartTime: Date.now(),
              leaves: []
            }
          }
          
          return branch
        }))
      }, 50)
      
      return () => {
        clearInterval(interval)
        clearInterval(leafInterval)
        clearInterval(leafOpacityInterval)
        clearInterval(fadeInterval)
      }
    } else {
      // Animate branches retreating
      const interval = setInterval(() => {
        setBranches(prev => {
          const updated = prev.map(branch => ({
            ...branch,
            progress: Math.max(branch.progress - 0.1, 0),
            leaves: branch.leaves.map(leaf => ({
              ...leaf,
              opacity: Math.max(leaf.opacity - 0.1, 0)
            }))
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
            <g key={branch.id}>
              <line
                x1={branch.startX}
                y1={branch.startY}
                x2={endX}
                y2={endY}
                stroke="hsl(var(--homepage-button-cards))"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="1"
              />
              {/* Render leaves */}
              {branch.leaves.map(leaf => {
                const leafX = branch.startX + Math.cos(branch.angle * Math.PI / 180) * branch.length * leaf.position
                const leafY = branch.startY + Math.sin(branch.angle * Math.PI / 180) * branch.length * leaf.position
                const leafOffsetX = leaf.side === 'left' ? -8 : 8
                const leafOffsetY = leaf.side === 'left' ? -8 : 8
                
                return (
                  <circle
                    key={leaf.id}
                    cx={leafX + leafOffsetX}
                    cy={leafY + leafOffsetY}
                    r="4"
                    fill="hsl(var(--homepage-button-cards))"
                    opacity={leaf.opacity}
                  />
                )
              })}
            </g>
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

export const FloatingBubblesDown = ({ isActive }: { isActive: boolean }) => {
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
            y: -20,
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
          y: bubble.y + bubble.speed
        }))
        .filter(bubble => bubble.y < window.innerHeight + 50)
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
            backgroundColor: 'hsl(var(--homepage-button-draft))',
            border: '2px solid hsl(var(--homepage-button-draft) / 0.3)',
            transform: 'translate(-50%, -50%)'
          }}
        />
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
          opacity: 0,
          rotation: Math.random() * 360 // Random rotation
        }
        
        setQuestionMarks(prev => {
          const updated = [...prev, newQuestionMark]
          // Keep max 20, remove oldest
          if (updated.length > 20) {
            return updated.slice(1)
          }
          return updated
        })
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
          opacity: isActive ? Math.min(qm.opacity + 0.08, 0.8) : Math.max(qm.opacity - 0.12, 0) // 80% opacity (reduced by 20%)
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
            transform: `translate(-50%, -50%) rotate(${qm.rotation}deg)`
          }}
        >
          ?
        </div>
      ))}
    </div>
  )
}
