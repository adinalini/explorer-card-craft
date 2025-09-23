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
      
      // Leaf spawning (5 leaves per second when branches are at phase complete)
      const leafInterval = setInterval(() => {
        setBranches(prev => prev.map(branch => {
          if (branch.phase === 'complete' && branch.leaves.length < 5) {
            const lastLeaf = branch.leaves[branch.leaves.length - 1]
            const position = lastLeaf ? Math.min(lastLeaf.position + 0.1 + Math.random() * 0.1, 1) : 0.2
            
            if (position <= 1) {
              const newLeaf: TreeLeaf = {
                id: Date.now() + Math.random(),
                branchId: branch.id,
                position,
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
      }, 200) // 5 per second
      
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
          if (branch.leaves.length === 5 && branch.leaves.every(leaf => leaf.opacity >= 1)) {
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
                opacity={branch.progress}
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

export const FloatingFlowers = ({ isActive }: { isActive: boolean }) => {
  const [flowers, setFlowers] = useState<Flower[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive) {
      interval = setInterval(() => {
        // Get button positions to avoid spawning flower centers on them
        const buttonMargin = 100
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight * 0.65
        
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
        
        const newFlower: Flower = {
          id: Date.now() + Math.random(),
          x,
          y,
          centerSize: Math.random() * 10 + 8,
          petals: [],
          opacity: 0,
          phase: 'growing',
          phaseStartTime: Date.now()
        }
        
        setFlowers(prev => [...prev, newFlower])
      }, 2000) // 1 ball every 2 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive])

  // Animate flower growth and petal spawning
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowers(prev => prev
        .map(flower => {
          const now = Date.now()
          const elapsed = now - flower.phaseStartTime
          
          if (flower.phase === 'growing') {
            // Fade in flower center
            const newOpacity = Math.min(flower.opacity + 0.1, 1)
            
            // Add petals at 1/0.7 sec rate (roughly every 700ms)
            const shouldAddPetal = flower.petals.length < 8 && Math.random() < 0.05
            let newPetals = flower.petals
            
            if (shouldAddPetal) {
              const newPetal: FlowerPetal = {
                id: Date.now() + Math.random(),
                angle: (flower.petals.length * 45) + Math.random() * 20 - 10, // Spread around circle
                size: Math.random() * 8 + 4,
                opacity: 0
              }
              newPetals = [...flower.petals, newPetal]
            }
            
            // Fade in existing petals
            newPetals = newPetals.map(petal => ({
              ...petal,
              opacity: Math.min(petal.opacity + 0.08, 1)
            }))
            
            // Check if flower is complete (8 petals all visible)
            const isComplete = newPetals.length === 8 && newPetals.every(petal => petal.opacity >= 1)
            
            return {
              ...flower,
              opacity: newOpacity,
              petals: newPetals,
              phase: (isComplete ? 'complete' : 'growing') as 'complete' | 'growing',
              phaseStartTime: isComplete ? now : flower.phaseStartTime
            }
          } else if (flower.phase === 'complete') {
            // Wait 2 seconds then start fading
            if (elapsed > 2000) {
            return {
              ...flower,
              phase: 'fading' as const,
              phaseStartTime: now
            }
            }
            return flower
          } else if (flower.phase === 'fading') {
            // Fade out
            const newOpacity = Math.max(flower.opacity - 0.08, 0)
            const newPetals = flower.petals.map(petal => ({
              ...petal,
              opacity: Math.max(petal.opacity - 0.08, 0)
            }))
            
            return {
              ...flower,
              opacity: newOpacity,
              petals: newPetals
            }
          }
          
          return flower
        })
        .filter(flower => flower.opacity > 0 || flower.petals.some(petal => petal.opacity > 0))
      )
    }, 16)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isActive) {
      // Clear all flowers when not active
      const timeout = setTimeout(() => {
        setFlowers([])
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [isActive])

  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      {flowers.map(flower => (
        <div key={flower.id}>
          {/* Flower center */}
          <div
            className="absolute rounded-full"
            style={{
              left: flower.x,
              top: flower.y,
              width: flower.centerSize,
              height: flower.centerSize,
              backgroundColor: 'hsl(var(--homepage-button-draft))',
              opacity: flower.opacity,
              transform: 'translate(-50%, -50%)'
            }}
          />
          {/* Flower petals */}
          {flower.petals.map(petal => {
            const petalX = flower.x + Math.cos(petal.angle * Math.PI / 180) * (flower.centerSize + 4)
            const petalY = flower.y + Math.sin(petal.angle * Math.PI / 180) * (flower.centerSize + 4)
            
            return (
              <div
                key={petal.id}
                className="absolute rounded-full"
                style={{
                  left: petalX,
                  top: petalY,
                  width: petal.size,
                  height: petal.size,
                  backgroundColor: 'hsl(var(--homepage-button-draft))',
                  opacity: petal.opacity * 0.8,
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
