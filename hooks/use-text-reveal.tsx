import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface UseTextRevealOptions {
  trigger?: string | HTMLElement
  delay?: number
  duration?: number
  stagger?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  ease?: string
}

export function useTextReveal(options: UseTextRevealOptions = {}) {
  const textRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!textRef.current) return

    const {
      delay = 0,
      duration = 1,
      stagger = 0.02,
      direction = 'up',
      ease = 'power2.out'
    } = options

    const element = textRef.current
    const text = element.textContent || ''
    
    // Split text into spans for each character
    const chars = text.split('').map((char, index) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char // Use non-breaking space
      span.style.display = 'inline-block'
      span.style.opacity = '0'
      
      // Set initial transform based on direction
      switch (direction) {
        case 'up':
          span.style.transform = 'translateY(100%)'
          break
        case 'down':
          span.style.transform = 'translateY(-100%)'
          break
        case 'left':
          span.style.transform = 'translateX(100%)'
          break
        case 'right':
          span.style.transform = 'translateX(-100%)'
          break
      }
      
      return span
    })

    // Replace original text with spans
    element.innerHTML = ''
    chars.forEach(char => element.appendChild(char))

    // Animate characters
    gsap.to(chars, {
      opacity: 1,
      transform: 'translate(0, 0)',
      duration,
      ease,
      stagger: {
        each: stagger,
        from: 'start'
      },
      delay
    })

    return () => {
      // Cleanup: restore original text
      element.textContent = text
    }
  }, [options])

  return textRef
}

// Higher-order component for easy text reveal
export function TextReveal({ 
  children, 
  className = '', 
  as: Component = 'div',
  ...options 
}: {
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
} & UseTextRevealOptions) {
  const textRef = useTextReveal(options)

  return (
    <Component ref={textRef} className={className}>
      {children}
    </Component>
  )
}