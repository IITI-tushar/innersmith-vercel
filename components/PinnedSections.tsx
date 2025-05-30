"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { Observer } from "gsap/Observer"
import Hero from "./sections/Hero"
import Problem from "./sections/Problem"
import Stats from "./sections/Stats"
import Disrupt from "./sections/Disrupt"
import Feel from "./sections/Feel"
import Journey from "./sections/Journey"
import Unbox from "./sections/Unbox"
import App from "./sections/App"
import Tools from "./sections/Tools"
import Footer from "./sections/Footer"

gsap.registerPlugin(Observer)

const sections = [
  { id: "hero", component: Hero, title: "Hero" },
  { id: "problem", component: Problem, title: "Problem" },
  { id: "stats", component: Stats, title: "Stats" },
  { id: "disrupt", component: Disrupt, title: "Disrupt" },
  { id: "feel", component: Feel, title: "Feel" },
  { id: "journey", component: Journey, title: "Journey" },
  { id: "unbox", component: Unbox, title: "Unbox" },
  { id: "app", component: App, title: "App" },
  { id: "tools", component: Tools, title: "Tools" },
  { id: "footer", component: Footer, title: "Footer" },
]

export default function SmoothAnimatedSections() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])
  const outerWrappersRef = useRef<(HTMLDivElement | null)[]>([])
  const innerWrappersRef = useRef<(HTMLDivElement | null)[]>([])
  const backgroundsRef = useRef<(HTMLDivElement | null)[]>([])
  const currentIndexRef = useRef(-1)
  const animatingRef = useRef(false)
  const observerRef = useRef<any>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [showIntro, setShowIntro] = useState(true)

  const gotoSection = useCallback((index: number, direction: number) => {
    const sectionsElements = sectionsRef.current.filter(Boolean)
    const outerWrappers = outerWrappersRef.current.filter(Boolean)
    const innerWrappers = innerWrappersRef.current.filter(Boolean)
    const backgrounds = backgroundsRef.current.filter(Boolean)

    if (sectionsElements.length === 0) return

    // Strict boundary checks - prevent going beyond bounds
    if (index < 0 || index >= sectionsElements.length) return
    
    if (animatingRef.current || index === currentIndexRef.current) return
    
    animatingRef.current = true
    setCurrentSection(index)

    // Hide intro after first navigation
    if (currentIndexRef.current === 0 && index > 0) {
      setShowIntro(false)
    }

    const fromTop = direction === -1
    const dFactor = fromTop ? -1 : 1
    
    const tl = gsap.timeline({
      defaults: { duration: 1.2, ease: "power1.inOut" },
      onComplete: () => {
        animatingRef.current = false
        // Ensure proper cleanup after animation
        sectionsElements.forEach((section, i) => {
          if (i !== index) {
            gsap.set(section, { 
              zIndex: 0,
              opacity: 0,
              visibility: "hidden"
            })
          } else {
            // Ensure current section is properly visible
            gsap.set(section, { 
              zIndex: 10,
              opacity: 1,
              visibility: "visible"
            })
          }
        })
      }
    })

    // Set the new section as visible immediately
    gsap.set(sectionsElements[index], { 
      zIndex: 10,
      opacity: 1,
      visibility: "visible"
    })

    // Handle previous section exit
    if (currentIndexRef.current >= 0 && currentIndexRef.current !== index) {
      // Keep previous section visible during transition
      gsap.set(sectionsElements[currentIndexRef.current], { 
        zIndex: 5,
        opacity: 1,
        visibility: "visible"
      })
      
      tl.to(backgrounds[currentIndexRef.current], { 
        yPercent: -15 * dFactor,
        duration: 1.2,
        ease: "power1.inOut"
      })
      // Fade out previous section gradually
      .to(sectionsElements[currentIndexRef.current], {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 0.4)
    }

    // Handle new section entrance
    tl.fromTo([outerWrappers[index], innerWrappers[index]], {
      yPercent: (i) => i ? -100 * dFactor : 100 * dFactor
    }, {
      yPercent: 0,
      duration: 1.2,
      ease: "power1.inOut"
    }, 0)
    .fromTo(backgrounds[index], { 
      yPercent: 15 * dFactor 
    }, { 
      yPercent: 0,
      duration: 1.2,
      ease: "power1.inOut"
    }, 0)

    currentIndexRef.current = index
  }, [])

  const handleNavigation = useCallback((direction: 'up' | 'down') => {
    if (animatingRef.current) return
    
    const nextIndex = direction === 'up' 
      ? currentIndexRef.current - 1 
      : currentIndexRef.current + 1

    // STRICT boundary checks - do not allow exiting the experience
    if (nextIndex < 0) {
      // Stay at first section, do not exit
      return
    }
    
    if (nextIndex >= sections.length) {
      // Stay at last section, do not exit
      return
    }

    gotoSection(nextIndex, direction === 'up' ? -1 : 1)
  }, [gotoSection])

  // Auto-start the experience
  useEffect(() => {
    // Prevent body scroll completely
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    
    // Initialize first section
    setTimeout(() => {
      gotoSection(0, 1)
    }, 100)

    return () => {
      // Restore body scroll on unmount
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [gotoSection])

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const sectionsElements = sectionsRef.current.filter(Boolean)
      const outerWrappers = outerWrappersRef.current.filter(Boolean)
      const innerWrappers = innerWrappersRef.current.filter(Boolean)

      if (sectionsElements.length === 0) return

      // Initial setup - hide all sections initially
      gsap.set(sectionsElements, { 
        opacity: 0,
        visibility: "hidden",
        zIndex: 0
      })
      gsap.set(outerWrappers, { yPercent: 100 })
      gsap.set(innerWrappers, { yPercent: -100 })

      // Create observer for scroll/touch/wheel events
      observerRef.current = Observer.create({
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        onDown: () => handleNavigation('up'),
        onUp: () => handleNavigation('down'),
        tolerance: 10,
        preventDefault: true // Always prevent default
      })

    }, containerRef)

    return () => {
      ctx.revert()
      if (observerRef.current) {
        observerRef.current.kill()
      }
    }
  }, [handleNavigation])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (animatingRef.current) return
      
      switch (e.key) {
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          handleNavigation('up')
          break
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          e.preventDefault()
          handleNavigation('down')
          break
        case 'Home':
          e.preventDefault()
          gotoSection(0, 1)
          break
        case 'End':
          e.preventDefault()
          gotoSection(sections.length - 1, -1)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNavigation, gotoSection])

  // Auto-hide intro after a few seconds on first section
  useEffect(() => {
    if (showIntro && currentSection === 0) {
      const timer = setTimeout(() => {
        setShowIntro(false)
      }, 4000) // Hide after 4 seconds

      return () => clearTimeout(timer)
    }
  }, [showIntro, currentSection])

  // Prevent any scroll events on the window
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault()
      return false
    }

    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      return false
    }

    // Prevent all scroll-related events
    window.addEventListener('scroll', preventScroll, { passive: false })
    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventTouchMove, { passive: false })
    document.addEventListener('scroll', preventScroll, { passive: false })
    document.addEventListener('wheel', preventScroll, { passive: false })
    document.addEventListener('touchmove', preventTouchMove, { passive: false })

    return () => {
      window.removeEventListener('scroll', preventScroll)
      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventTouchMove)
      document.removeEventListener('scroll', preventScroll)
      document.removeEventListener('wheel', preventScroll)
      document.removeEventListener('touchmove', preventTouchMove)
    }
  }, [])

  return (
    <div ref={containerRef} className="smooth-sections-container fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* Intro overlay - only show on first section */}
      {/* {showIntro && currentSection === 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center text-white">
            <div className="text-6xl font-bold mb-4 animate-pulse">
              innersmith
            </div>
            <div className="text-xl opacity-80 animate-bounce">
              Scroll to explore
            </div>
          </div>
        </div>
      )} */}

      {/* Progress indicator */}
      {/* <div className="fixed top-8 right-8 z-40 flex flex-col gap-2">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSection 
                ? 'bg-white scale-125' 
                : 'bg-white/30 hover:bg-white/60'
            }`}
            onClick={() => !animatingRef.current && gotoSection(index, index > currentSection ? 1 : -1)}
          />
        ))}
      </div> */}

      {/* Navigation hints */}
      {/* <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex gap-8 text-white/60 text-sm">
        {currentSection > 0 && (
          <div className="flex items-center gap-2">
            <span>↑</span>
            <span>Previous</span>
          </div>
        )}
        {currentSection < sections.length - 1 && (
          <div className="flex items-center gap-2">
            <span>↓</span>
            <span>Next</span>
          </div>
        )}
      </div> */}

      {/* Section indicator */}
      {/* <div className="fixed top-8 left-8 z-40 text-white/80 text-sm font-medium">
        {sections[currentSection]?.title} ({currentSection + 1}/{sections.length})
      </div> */}

      {/* Sections */}
      {sections.map((section, index) => {
        const SectionComponent = section.component
        return (
          <div
            key={section.id}
            ref={(el) => { sectionsRef.current[index] = el }}
            className="smooth-section absolute inset-0 w-full h-full"
          >
            <div
              ref={(el) => { outerWrappersRef.current[index] = el }}
              className="smooth-section-outer w-full h-full overflow-hidden"
            >
              <div
                ref={(el) => { innerWrappersRef.current[index] = el }}
                className="smooth-section-inner w-full h-full overflow-hidden"
              >
                <div
                  ref={(el) => { backgroundsRef.current[index] = el }}
                  className="smooth-section-bg w-full h-full"
                >
                  <div className="w-full h-full relative">
                    <SectionComponent />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}