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
  const fixedContainerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])
  const outerWrappersRef = useRef<(HTMLDivElement | null)[]>([])
  const innerWrappersRef = useRef<(HTMLDivElement | null)[]>([])
  const backgroundsRef = useRef<(HTMLDivElement | null)[]>([])
  
  const currentIndexRef = useRef(-1) 
  const animatingRef = useRef(false)
  const observerRef = useRef<Observer | null>(null)
  
  const [currentSection, setCurrentSection] = useState(0) 
  const [showIntro, setShowIntro] = useState(true) 
  const problemRef = useRef<HTMLDivElement>(null)

  const gsapSections = sections.slice(2)

  const gotoSection = useCallback((gsapIndex: number, direction: number) => {
    if (animatingRef.current) return;
    if (gsapIndex < 0 || gsapIndex >= gsapSections.length) {
      return;
    }

    const sectionsElements = sectionsRef.current.filter(Boolean) as HTMLDivElement[];
    const outerWrappers = outerWrappersRef.current.filter(Boolean) as HTMLDivElement[];
    const innerWrappers = innerWrappersRef.current.filter(Boolean) as HTMLDivElement[];
    const backgrounds = backgroundsRef.current.filter(Boolean) as HTMLDivElement[];

    if (sectionsElements.length === 0 || gsapIndex >= sectionsElements.length || !outerWrappers[gsapIndex] || !innerWrappers[gsapIndex] || !backgrounds[gsapIndex]) {
        console.error("GSAP target elements not found for index:", gsapIndex);
        return;
    }
    
    const prevGsapIndex = currentIndexRef.current;
    if (gsapIndex === prevGsapIndex && currentSection === gsapIndex + 2) return;

    // --- Special case: Transitioning TO Stats (gsapIndex 0) FROM Problem (prevGsapIndex -1) ---
    if (gsapIndex === 0 && prevGsapIndex === -1 && direction === 1) {
      animatingRef.current = true;
      setCurrentSection(2); // Global section is Stats

      gsap.set(sectionsElements[0], { // Stats section itself
        zIndex: 10,
        opacity: 1,
        visibility: "visible"
      });

      // Animate outer/inner wrappers of Stats in
      const dFactor = 1; // Coming from bottom
      gsap.timeline({
        onComplete: () => {
          animatingRef.current = false;
        }
      })
      .fromTo([outerWrappers[0], innerWrappers[0]], {
        yPercent: (i) => i ? -100 * dFactor : 100 * dFactor 
      }, {
        yPercent: 0,
        duration: 1.2,
        ease: "power1.inOut",
      }, 0)
      .fromTo(backgrounds[0], { 
        yPercent: 15 * dFactor 
      }, { 
        yPercent: 0,
        duration: 1.2,
        ease: "power1.inOut",
      }, 0);

      currentIndexRef.current = 0;
      return; 
    }

    // --- Default GSAP section-to-section transition ---
    animatingRef.current = true;
    setCurrentSection(gsapIndex + 2);

    const fromTop = direction === -1;
    const dFactor = fromTop ? -1 : 1;
    
    const tl = gsap.timeline({
      defaults: { duration: 1.2, ease: "power1.inOut" },
      onComplete: () => {
        animatingRef.current = false;
        sectionsElements.forEach((section, i) => {
          gsap.set(section, { 
            zIndex: i === gsapIndex ? 10 : 0,
            opacity: i === gsapIndex ? 1 : 0,
            visibility: i === gsapIndex ? "visible" : "hidden"
          });
        });
      }
    });

    // Incoming section (gsapIndex)
    gsap.set(sectionsElements[gsapIndex], { 
      zIndex: 10, 
      opacity: 1, 
      visibility: "visible"
    });

    // Outgoing section (prevGsapIndex)
    if (prevGsapIndex >= 0 && prevGsapIndex < gsapSections.length && prevGsapIndex !== gsapIndex) {
      if (outerWrappers[prevGsapIndex] && innerWrappers[prevGsapIndex] && backgrounds[prevGsapIndex]) {
        gsap.set(sectionsElements[prevGsapIndex], { 
          zIndex: 5, 
          opacity: 1, 
          visibility: "visible"
        });
        
        tl.to([outerWrappers[prevGsapIndex], innerWrappers[prevGsapIndex]], {
          yPercent: (i) => i ? 100 * dFactor : -100 * dFactor, 
        }, 0)
        .to(backgrounds[prevGsapIndex], { 
          yPercent: -15 * dFactor,
        }, 0);
      }
    }

    // Animate incoming section's wrappers
    tl.fromTo([outerWrappers[gsapIndex], innerWrappers[gsapIndex]], {
      yPercent: (i) => i ? -100 * dFactor : 100 * dFactor
    }, {
      yPercent: 0,
    }, 0)
    .fromTo(backgrounds[gsapIndex], { 
      yPercent: 15 * dFactor 
    }, { 
      yPercent: 0,
    }, 0);

    currentIndexRef.current = gsapIndex;
  }, [gsapSections.length, currentSection]);

  useEffect(() => {
    if (currentSection < 2) { 
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (observerRef.current) {
        observerRef.current.kill();
        observerRef.current = null;
      }

      if (fixedContainerRef.current) {
        // When in native scroll mode, ensure the fixed container is fully hidden and non-interactive.
        // The opacity animation to 0 is primarily handled by the exitTimeline when coming from Stats.
        // This `gsap.set` ensures the final state.
        gsap.set(fixedContainerRef.current, { 
          opacity: 0, 
          pointerEvents: 'none', 
          zIndex: -1 
        });
      }

    } else { // GSAP Mode 
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      if (fixedContainerRef.current) {
         // When entering GSAP mode, ensure the fixed container is visible and interactive.
         // The opacity animation to 1 can be quick or instant.
         gsap.set(fixedContainerRef.current, { // Changed from gsap.to for immediacy if preferred
           opacity: 1, 
           pointerEvents: 'auto', 
           zIndex: 50 
          });
      }

      const targetGsapIndex = currentSection - 2;
      if (currentIndexRef.current === -1 && currentSection === 2) {
        setTimeout(() => gotoSection(0, 1), 50); 
      } else if (currentIndexRef.current !== targetGsapIndex && targetGsapIndex >= 0 && targetGsapIndex < gsapSections.length) {
        setTimeout(() => gotoSection(targetGsapIndex, targetGsapIndex > currentIndexRef.current ? 1 : -1), 50);
      }

      if (!observerRef.current && fixedContainerRef.current) {
        observerRef.current = Observer.create({
          target: fixedContainerRef.current, 
          type: "wheel,touch,pointer",
          wheelSpeed: -1, 
          onDown: () => { 
            if (animatingRef.current) return;
            const currentGsapIdx = currentIndexRef.current;
            if (currentGsapIdx > 0) {
              gotoSection(currentGsapIdx - 1, -1);
            } else if (currentGsapIdx === 0) { // At Stats, trying to go up to Problem
              animatingRef.current = true;
              const statsOuter = outerWrappersRef.current[0];
              const statsInner = innerWrappersRef.current[0];
              const statsBg = backgroundsRef.current[0];
              const statsSectionEl = sectionsRef.current[0];

              const exitTimeline = gsap.timeline({
                onComplete: () => {
                  if (statsSectionEl) {
                      gsap.set(statsSectionEl, { opacity: 0, visibility: "hidden", zIndex: 0 });
                  }
                  if (statsOuter) gsap.set(statsOuter, { yPercent: 100 });
                  if (statsInner) gsap.set(statsInner, { yPercent: -100 });
                  
                  setCurrentSection(1); 
                  currentIndexRef.current = -1; 
                  animatingRef.current = false;
                }
              });

              if (statsOuter && statsInner && statsBg) {
                exitTimeline.to([statsOuter, statsInner], {
                  yPercent: (i) => i ? -100 : 100, 
                  duration: 1.0,
                  ease: "power1.inOut",
                }, 0)
                .to(statsBg, {
                  yPercent: 15, 
                  duration: 1.0,
                  ease: "power1.inOut",
                }, 0);
              }

              if (fixedContainerRef.current) {
                exitTimeline.to(fixedContainerRef.current, {
                  opacity: 0,
                  duration: 1.0, 
                  ease: "power1.inOut"
                }, 0); 
              }
              
              if (exitTimeline.getChildren().length === 0) {
                console.warn("Stats exit: No animations added to timeline. Completing manually.");
                if (statsSectionEl) gsap.set(statsSectionEl, { opacity: 0, visibility: "hidden", zIndex: 0 });
                if (statsOuter) gsap.set(statsOuter, { yPercent: 100 });
                if (statsInner) gsap.set(statsInner, { yPercent: -100 });
                if (fixedContainerRef.current) gsap.set(fixedContainerRef.current, { opacity: 0 }); // Ensure container is hidden in fallback
                setCurrentSection(1);
                currentIndexRef.current = -1;
                animatingRef.current = false;
              }
            }
          },
          onUp: () => { 
            if (animatingRef.current) return;
            const currentGsapIdx = currentIndexRef.current;
            if (currentGsapIdx < gsapSections.length - 1) {
              gotoSection(currentGsapIdx + 1, 1);
            }
          },
          tolerance: 10,
          preventDefault: true
        });
      }
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.kill();
        observerRef.current = null;
      }
    };
  }, [currentSection, gotoSection, gsapSections.length]);

  useEffect(() => {
    const onScroll = () => {
      if (currentSection >= 2) return; 

      if (problemRef.current) {
        const rect = problemRef.current.getBoundingClientRect();
        if (rect.bottom <= window.innerHeight + 50) { 
          setCurrentSection(2);
        }
      }
    };
    if (currentSection < 2) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [currentSection]);

  useEffect(() => {
    const sectionsElements = sectionsRef.current.filter(Boolean);
    const outerWrappers = outerWrappersRef.current.filter(Boolean);
    const innerWrappers = innerWrappersRef.current.filter(Boolean);

    if (sectionsElements.length > 0) {
      gsap.set(sectionsElements, { 
        opacity: 0,
        visibility: "hidden",
        zIndex: 0 
      });
      gsap.set(outerWrappers, { yPercent: 100 });
      gsap.set(innerWrappers, { yPercent: -100 });
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentSection < 2) { // Native scroll mode
        let scrolled = false;
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
          e.preventDefault();
          if (problemRef.current && currentSection === 1) { 
            const rect = problemRef.current.getBoundingClientRect();
            if (rect.bottom <= window.innerHeight + 100) { 
              setCurrentSection(2); 
              scrolled = true;
            }
          }
          if(!scrolled) window.scrollBy({ top: window.innerHeight / 2, behavior: 'smooth' });
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          e.preventDefault();
           if (currentSection === 0 && window.scrollY === 0) { /* at top */ }
           else window.scrollBy({ top: -window.innerHeight / 2, behavior: 'smooth' });
        } else if (e.key === 'Home') {
          e.preventDefault();
          setCurrentSection(0);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else { // GSAP mode
        if (animatingRef.current) return;
        const currentGsapIdx = currentIndexRef.current;
        switch (e.key) {
          case 'ArrowUp':
          case 'PageUp':
            e.preventDefault();
            if (currentGsapIdx > 0) {
              gotoSection(currentGsapIdx - 1, -1);
            } else if (currentGsapIdx === 0) { // At Stats, trying to go up to Problem
              animatingRef.current = true;
              const statsOuter = outerWrappersRef.current[0];
              const statsInner = innerWrappersRef.current[0];
              const statsBg = backgroundsRef.current[0];
              const statsSectionEl = sectionsRef.current[0];

              const exitTimeline = gsap.timeline({
                onComplete: () => {
                  if (statsSectionEl) {
                      gsap.set(statsSectionEl, { opacity: 0, visibility: "hidden", zIndex: 0 });
                  }
                  if (statsOuter) gsap.set(statsOuter, { yPercent: 100 });
                  if (statsInner) gsap.set(statsInner, { yPercent: -100 });
                  
                  setCurrentSection(1); 
                  currentIndexRef.current = -1; 
                  animatingRef.current = false;
                }
              });

              if (statsOuter && statsInner && statsBg) {
                exitTimeline.to([statsOuter, statsInner], { yPercent: (i) => i ? -100 : 100, duration: 1.0, ease: "power1.inOut" }, 0)
                .to(statsBg, { yPercent: 15, duration: 1.0, ease: "power1.inOut" }, 0);
              }
              
              if (fixedContainerRef.current) {
                exitTimeline.to(fixedContainerRef.current, { opacity: 0, duration: 1.0, ease: "power1.inOut" }, 0);
              }

              if (exitTimeline.getChildren().length === 0) {
                if (statsSectionEl) gsap.set(statsSectionEl, { opacity: 0, visibility: "hidden", zIndex: 0 });
                if (statsOuter) gsap.set(statsOuter, { yPercent: 100 });
                if (statsInner) gsap.set(statsInner, { yPercent: -100 });
                setCurrentSection(1);
                currentIndexRef.current = -1;
                animatingRef.current = false;
              }
            }
            break;
          case 'ArrowDown':
          case 'PageDown':
          case ' ':
            e.preventDefault();
            if (currentGsapIdx < gsapSections.length - 1) {
              gotoSection(currentGsapIdx + 1, 1);
            }
            break;
          case 'Home':
            e.preventDefault();
            setCurrentSection(0); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
          case 'End':
            e.preventDefault();
            if (gsapSections.length > 0) {
              gotoSection(gsapSections.length - 1, 1);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, gotoSection, gsapSections.length]);

  useEffect(() => {
    if (showIntro && currentSection === 0) {
      const timer = setTimeout(() => setShowIntro(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showIntro, currentSection]);

  return (
    <div className="min-h-screen w-full bg-black">
      <div>
        <div id="hero" className="relative w-full h-full">
          <Hero />
        </div>
        <div id="problem" className="relative w-full h-full" ref={problemRef}>
          <Problem />
        </div>
      </div>
      <div
        ref={fixedContainerRef}
        className="smooth-sections-container fixed inset-0 w-full h-full overflow-hidden bg-black"
        style={{
          opacity: 0, 
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        {gsapSections.map((section, index) => {
          const SectionComponent = section.component;
          return (
            <div
              key={section.id}
              ref={el => { sectionsRef.current[index] = el; }} 
              className="smooth-section absolute inset-0 w-full h-full"
            >
              <div ref={el => { outerWrappersRef.current[index] = el; }} className="w-full h-full overflow-hidden">
                <div ref={el => { innerWrappersRef.current[index] = el; }} className="w-full h-full overflow-hidden">
                  <div ref={el => { backgroundsRef.current[index] = el; }} className="w-full h-full">
                    <div className="w-full h-full relative">
                      <SectionComponent />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}