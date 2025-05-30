"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from "next/image";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const firstViewRef = useRef<HTMLDivElement>(null);
  const secondViewRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const triggerRef = useRef<ScrollTrigger | undefined>(undefined);

  useEffect(() => {
    let tl: gsap.core.Timeline | undefined;

    const setupAnimations = () => {
      const section = sectionRef.current;
      if (!section) return;

      gsap.set(section, { clearProps: "all" });

      // Timeline for animation
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          toggleActions: "play none none reverse",
          markers: false,
        },
        defaults: { ease: "power2.out" },
      });

      // Logo animation - keeps visible
      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8 }
      );

      // Background image scale animation
      tl.fromTo(
        imageRef.current,
        { scale: 1 },
        { scale: 1.1, duration: 1.5 },
        "-=0.5"
      );

      // Overlay animation
      tl.fromTo(
        overlayRef.current,
        { scaleY: 0, transformOrigin: "center bottom" },
        { scaleY: 1, duration: 1 },
        "-=1.2"
      );

      // First view content animation - with persistent text
      tl.fromTo(
        firstViewRef.current?.children || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
        },
        "-=0.5"
      );

      // Main title and subtitle movement on scroll (but stays visible)
      tl.to(
        mainTitleRef.current,
        {
          y: window.innerWidth < 640 ? -10 : -20, // Less movement on mobile
          duration: 1,
          ease: "power2.out"
        },
        "+=0.3"
      );

      tl.to(
        subtitleRef.current,
        {
          y: window.innerWidth < 640 ? -8 : -15, // Less movement on mobile
          duration: 1,
          ease: "power2.out"
        },
        "-=0.8"
      );

      // Second view content animation (delayed)
      tl.fromTo(
        secondViewRef.current?.children || [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
        },
        "-=0.5"
      );

      // Additional scroll-based parallax effect for persistent elements
      gsap.to(mainTitleRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom top",
          scrub: 1,
        },
        y: window.innerWidth < 640 ? -25 : -50, // Less movement on mobile
        ease: "none"
      });

      gsap.to(subtitleRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom top",
          scrub: 1,
        },
        y: window.innerWidth < 640 ? -15 : -30, // Less movement on mobile
        ease: "none"
      });

      triggerRef.current = tl.scrollTrigger;
    };

    requestAnimationFrame(() => {
      setTimeout(setupAnimations, 100);
    });

    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      tl?.kill();
      triggerRef.current?.kill();
    };
  }, []);

  return (
    <section
      className="h-screen bg-gradient-to-b from-slate-900 to-slate-800 w-full flex relative justify-center items-center overflow-hidden"
      ref={sectionRef}
      id="hero"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Background Image */}
      <div 
        ref={imageRef} 
        className="absolute inset-0 w-full h-full z-0" 
        style={{ willChange: "transform" }}
      >
        <Image
          src="/images/heroFullbg.png"
          alt="Mountain landscape background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={75}
        />
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black/40"
          style={{ transformOrigin: "center bottom", willChange: "transform" }}
        />
      </div>

      {/* Logo */}
      <div ref={logoRef} className="absolute top-4 left-4 sm:top-8 sm:left-8 md:top-12 md:left-20 z-20">
        <Image
          src="/mainLogomini.svg"
          height="74"
          width="74"
          alt="logo"
          className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20"
          style={{ willChange: "transform" }}
          priority
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* First View */}
        <div
          ref={firstViewRef}
          className="flex-1 flex flex-col items-center justify-center text-white px-4 sm:px-6 md:px-8"
        >
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 opacity-90 title leading-relaxed">
              Stress is a loop that keeps you stuck.
            </p>
            <h1 
              ref={mainTitleRef}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light mb-6 sm:mb-8 tracking-wide custom-margin custom-size leading-none"
              style={{ willChange: "transform" }}
            >
              InnerSmith
            </h1>
            <p 
              ref={subtitleRef}
              className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 second-custom leading-relaxed px-2 sm:px-0"
              style={{ willChange: "transform" }}
            >
              helps you break free and <em className="italic">Feel Better, Live Better.</em>
            </p>
            <div className="flex flex-col items-center">
              <div className="w-5 h-8 sm:w-6 sm:h-10 custom-height-and-width mb-2 border-2 border-white rounded-full flex justify-center items-start animate-bounce">
                <div className="w-1 h-1.5 sm:w-1 sm:h-2 mini-dot bg-white rounded-full mt-1.5 sm:mt-2"></div>
              </div>
              <p className="text-xs sm:text-sm scroll-text uppercase tracking-wider">Scroll to Continue</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}