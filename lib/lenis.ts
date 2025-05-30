"use client"

import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

let lenis: Lenis | null = null

export function initializeLenis() {
  lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    lerp: 0.02,
    touchMultiplier: 1.5,
    infinite: false,
  })

  lenis.on("scroll", ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });


  gsap.ticker.lagSmoothing(0)
  ScrollTrigger.refresh()

  return lenis
}

export function destroyLenis() {
  if (lenis) {
    lenis.destroy()
    lenis = null
  }
}

export function getLenis() {
  return lenis
}
