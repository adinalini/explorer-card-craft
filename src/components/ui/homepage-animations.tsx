import { useEffect, useState } from 'react'

interface Card {
  id: number
  x: number
  y: number
  size: number
  speed: number
}

interface QuestionMarkHorizontal {
  id: number
  x: number
  y: number
  size: number
  speed: number
  rotation: number
}

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  speed: number
}

export const FloatingCards = ({ isActive }: { isActive: boolean }) => {
  const [cards, setCards] = useState<Card[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive) {
      interval = setInterval(() => {
        // 5 cards per second
        for (let i = 0; i < 1; i++) {
          const newCard: Card = {
            id: Date.now() + Math.random() + i,
            x: -30,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 20 + 15,
            speed: Math.random() * 2 + 1
          }
          
          setCards(prev => [...prev, newCard])
        }
      }, 200) // 200ms interval = 5 per second
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive])

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setCards(prev => prev
        .map(card => ({
          ...card,
          x: card.x + card.speed
        }))
        .filter(card => card.x < window.innerWidth + 50)
      )
    }, 16)

    return () => clearInterval(animationInterval)
  }, [])

  useEffect(() => {
    if (!isActive) {
      setCards([])
    }
  }, [isActive])

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {cards.map(card => (
        <div
          key={card.id}
          className="absolute rounded-lg opacity-70 border-2"
          style={{
            left: card.x,
            top: card.y,
            width: card.size,
            height: card.size * 1.4,
            backgroundColor: 'hsl(var(--homepage-button-cards))',
            borderColor: 'hsl(var(--homepage-button-cards) / 0.3)',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  )
}

export const FloatingQuestionMarksHorizontal = ({ isActive }: { isActive: boolean }) => {
  const [questionMarks, setQuestionMarks] = useState<QuestionMarkHorizontal[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive) {
      interval = setInterval(() => {
        // 3 question marks per second
        const newQuestionMark: QuestionMarkHorizontal = {
          id: Date.now() + Math.random(),
          x: window.innerWidth + 30,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 20 + 15,
          speed: Math.random() * 2 + 1,
          rotation: Math.random() * 360
        }
        
        setQuestionMarks(prev => [...prev, newQuestionMark])
      }, 333) // 333ms interval = ~3 per second
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive])

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setQuestionMarks(prev => prev
        .map(qm => ({
          ...qm,
          x: qm.x - qm.speed
        }))
        .filter(qm => qm.x > -50)
      )
    }, 16)

    return () => clearInterval(animationInterval)
  }, [])

  useEffect(() => {
    if (!isActive) {
      setQuestionMarks([])
    }
  }, [isActive])

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {questionMarks.map(qm => (
        <div
          key={qm.id}
          className="absolute font-bold select-none opacity-80"
          style={{
            left: qm.x,
            top: qm.y,
            fontSize: qm.size + 'px',
            color: 'hsl(var(--homepage-button-random))',
            transform: `translate(-50%, -50%) rotate(${qm.rotation}deg)`
          }}
        >
          ?
        </div>
      ))}
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