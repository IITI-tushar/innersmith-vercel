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
  { id: "hero", component: Hero, title: "Hero", zIndex: 10 },
  { id: "problem", component: Problem, title: "Problem", zIndex: 8 },
  { id: "stats", component: Stats, title: "Stats", zIndex: 9 },
  { id: "disrupt", component: Disrupt, title: "Disrupt", zIndex: 10 },
  { id: "feel", component: Feel, title: "Feel", zIndex: 11 },
  { id: "journey", component: Journey, title: "Journey", zIndex: 12 },
  { id: "unbox", component: Unbox, title: "Unbox", zIndex: 13 },
  { id: "app", component: App, title: "App", zIndex: 14 },
  { id: "tools", component: Tools, title: "Tools", zIndex: 15 },
  { id: "footer", component: Footer, title: "Footer", zIndex: 16 },
]

export default function SmoothAnimatedSections() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])
  const outerWrappersRef = useRef<(HTMLDivElement | null)[]>([])
  const innerWrappersRef = useRef<(HTMLDivElement | null)[]>([])
  const backgroundsRef = useRef<(HTMLDivElement | null)[]>([])
  const currentIndexRef = useRef(0)
  const animatingRef = useRef(false)
  const observerRef = useRef<any>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [showIntro, setShowIntro] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Throttling for smoother scroll
  const lastScrollTime = useRef(0)
  const SCROLL_DELAY = 300 // 300ms delay between scroll actions

  const gotoSection = useCallback((index: number, direction: number) => {
    const sectionsElements = sectionsRef.current.filter(Boolean)
    const outerWrappers = outerWrappersRef.current.filter(Boolean)
    const innerWrappers = innerWrappersRef.current.filter(Boolean)
    const backgrounds = backgroundsRef.current.filter(Boolean)

    if (sectionsElements.length === 0) return
    if (index < 0 || index >= sectionsElements.length) return
    if (animatingRef.current || index === currentIndexRef.current) return
    
    animatingRef.current = true
    setCurrentSection(index)

    console.log(`Going to section: ${sections[index]?.title} (index: ${index})`);

    if (currentIndexRef.current === 0 && index > 0) {
      setShowIntro(false)
    }

    const fromTop = direction === -1
    const dFactor = fromTop ? -1 : 1
    
    const tl = gsap.timeline({
      defaults: { duration: 0.8, ease: "power2.inOut" }, // Faster, smoother easing
      onComplete: () => {
        animatingRef.current = false
        
        // Clean up sections that should no longer be visible
        if (index === 0) {
          // If we're at Hero, hide all other sections
          for (let i = 1; i < sectionsElements.length; i++) {
            gsap.set(sectionsElements[i], {
              opacity: 0,
              visibility: "hidden",
              zIndex: 0,
              y: "0%"
            })
          }
        } else {
          // For layered sections, hide sections beyond current index
          for (let i = index + 1; i < sectionsElements.length; i++) {
            gsap.set(sectionsElements[i], {
              opacity: 0,
              visibility: "hidden",
              zIndex: 0,
              y: "0%"
            })
          }
          
          // Reset y position for sections that were slid down during backward navigation
          for (let i = 1; i <= index; i++) {
            gsap.set(sectionsElements[i], {
              y: "0%"
            })
          }
        }
      }
    })

    // Set current section z-index and visibility
    gsap.set(sectionsElements[index], { 
      zIndex: sections[index].zIndex,
      opacity: 1,
      visibility: "visible"
    })

    // Handle layered sections (Problem onwards)
    if (index >= 1) {
      // Keep all previous sections from Problem onwards visible as background layers
      for (let i = 1; i <= index; i++) {
        if (sectionsElements[i]) {
          gsap.set(sectionsElements[i], {
            opacity: 1,
            visibility: "visible",
            zIndex: sections[i].zIndex
          })
          gsap.set([outerWrappers[i], innerWrappers[i]], { yPercent: 0 })
        }
      }
      
      // Hide sections after current index
      for (let i = index + 1; i < sectionsElements.length; i++) {
        if (sectionsElements[i]) {
          gsap.set(sectionsElements[i], {
            opacity: 0,
            visibility: "hidden",
            zIndex: 0
          })
        }
      }
    }

    // Special handling for different transitions
    if (currentIndexRef.current === 0 && index === 1) {
      // Hero to Problem - normal transition
      gsap.set(sectionsElements[0], { zIndex: 5 })
      
      tl.to(backgrounds[0], { 
        yPercent: -15 * dFactor,
        duration: 0.8,
        ease: "power2.inOut"
      })
      .to(sectionsElements[0], {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      }, 0.3)
      .fromTo([outerWrappers[1], innerWrappers[1]], {
        yPercent: 100 * dFactor
      }, {
        yPercent: 0,
        duration: 0.8,
        ease: "power2.inOut"
      }, 0)
      .fromTo(backgrounds[1], { 
        yPercent: 15 * dFactor 
      }, { 
        yPercent: 0,
        duration: 0.8,
        ease: "power2.inOut"
      }, 0)
      
    } else if (index >= 2 && direction === 1) {
      // Forward: Roll new section over the previous ones
      gsap.set(sectionsElements[index], { y: "100%" })
      gsap.set([outerWrappers[index], innerWrappers[index]], { yPercent: 0 })
      
      tl.to(sectionsElements[index], {
        y: "0%",
        duration: 0.8,
        ease: "power2.inOut"
      })
      
    } else if (index >= 1 && direction === -1) {
      // Backward: Roll current section down to reveal previous section underneath
      const currentSectionIndex = currentIndexRef.current
      
      if (currentSectionIndex > index) {
        // First, ensure all sections from Problem up to current are properly layered
        for (let i = 1; i <= currentSectionIndex; i++) {
          if (sectionsElements[i]) {
            gsap.set(sectionsElements[i], {
              opacity: 1,
              visibility: "visible",
              zIndex: sections[i].zIndex,
              y: "0%"
            })
          }
        }
        
        // Now animate the current section sliding down to reveal the target section
        tl.to(sectionsElements[currentSectionIndex], {
          y: "100%",
          duration: 0.8,
          ease: "power2.inOut"
        })
        
        // Also animate any sections above the current one
        for (let i = currentSectionIndex + 1; i < sectionsElements.length; i++) {
          if (sectionsElements[i]) {
            tl.to(sectionsElements[i], {
              y: "100%",
              duration: 0.8,
              ease: "power2.inOut"
            }, 0)
          }
        }
        
        // Ensure target section is properly positioned and visible
        gsap.set(sectionsElements[index], {
          y: "0%",
          opacity: 1,
          visibility: "visible",
          zIndex: sections[index].zIndex
        })
      }
      
    } else if (currentIndexRef.current >= 1 && index === 0) {
      // Going back to Hero from any layered section
      const currentSectionIndex = currentIndexRef.current
      
      // Animate all layered sections sliding down
      for (let i = 1; i <= currentSectionIndex; i++) {
        if (sectionsElements[i]) {
          tl.to(sectionsElements[i], {
            y: "100%",
            duration: 0.8,
            ease: "power2.inOut"
          }, 0)
        }
      }
      
      // Show Hero
      gsap.set(sectionsElements[0], { 
        zIndex: 10,
        opacity: 1,
        visibility: "visible"
      })
      gsap.set([outerWrappers[0], innerWrappers[0]], { yPercent: 0 })
      gsap.set(backgrounds[0], { yPercent: 0 })
      
      // Animate Hero entrance
      tl.fromTo(sectionsElements[0], {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      }, 0.4)
    }

    currentIndexRef.current = index
  }, [])

  const handleNavigation = useCallback((direction: 'up' | 'down') => {
    // Throttle scroll actions for smoother experience
    const now = Date.now()
    if (now - lastScrollTime.current < SCROLL_DELAY) {
      return
    }
    lastScrollTime.current = now
    
    if (animatingRef.current) return
    
    const nextIndex = direction === 'up' 
      ? currentIndexRef.current - 1 
      : currentIndexRef.current + 1

    if (nextIndex < 0 || nextIndex >= sections.length) return

    gotoSection(nextIndex, direction === 'up' ? -1 : 1)
  }, [gotoSection])

  // Initialize sections setup
  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const sectionsElements = sectionsRef.current.filter(Boolean)
      const outerWrappers = outerWrappersRef.current.filter(Boolean)
      const innerWrappers = innerWrappersRef.current.filter(Boolean)

      if (sectionsElements.length === 0) return

      console.log('Initializing sections. Total sections:', sectionsElements.length);
      console.log('Section order:', sections.map(s => s.title));

      // Initial setup
      sectionsElements.forEach((section, index) => {
        if (index === 0) {
          // Show Hero section
          gsap.set(section, { 
            opacity: 1,
            visibility: "visible",
            zIndex: sections[index].zIndex,
            y: "0%"
          })
          gsap.set([outerWrappers[0], innerWrappers[0]], { yPercent: 0 })
          console.log('Initialized Hero section as visible');
        } else {
          // Hide all other sections, but set proper z-indexes
          gsap.set(section, { 
            opacity: 0,
            visibility: "hidden",
            zIndex: sections[index].zIndex,
            y: "0%"
          })
          gsap.set([outerWrappers[index], innerWrappers[index]], { yPercent: 100 })
        }
      })

      setIsInitialized(true)

      // Create observer for scroll/touch/wheel events
      observerRef.current = Observer.create({
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        onDown: () => handleNavigation('up'),
        onUp: () => handleNavigation('down'),
        tolerance: 15, // Higher tolerance to prevent too rapid scrolling
        preventDefault: true
      })

    }, containerRef)

    return () => {
      ctx.revert()
      if (observerRef.current) {
        observerRef.current.kill()
      }
    }
  }, [handleNavigation])

  // Force initial state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'

      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);

      currentIndexRef.current = 0;
      setCurrentSection(0);
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
      }
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (animatingRef.current || !isInitialized) return
      
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
  }, [handleNavigation, gotoSection, isInitialized])

  // Auto-hide intro
  useEffect(() => {
    if (showIntro && currentSection === 0) {
      const timer = setTimeout(() => {
        setShowIntro(false)
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [showIntro, currentSection])

  // Prevent scroll events
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault()
      return false
    }

    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      return false
    }

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
      {/* Debug indicator */}
      <div className="fixed top-4 left-4 z-50 bg-black/80 text-white px-3 py-1 rounded text-sm">
        Section: {sections[currentSection]?.title} ({currentSection + 1}/{sections.length})
      </div>

      {/* Sections */}
      {sections.map((section, index) => {
        const SectionComponent = section.component
        const isActive = index === currentSection;
        return (
          <div
            key={section.id}
            ref={(el) => { sectionsRef.current[index] = el }}
            className="smooth-section absolute inset-0 w-full h-full"
            style={{ zIndex: section.zIndex }}
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
                    {(section.id === 'problem' || section.id === 'stats' || section.id === 'disrupt') ? (
                      <SectionComponent isActive={isActive} />
                    ) : (
                      <SectionComponent />
                    )}
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