"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const firstViewRef = useRef<HTMLDivElement>(null);
  const secondViewRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animations with proper delays
      gsap.fromTo(
        firstViewRef.current?.children || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          delay: 7, 
        },
      );

      gsap.fromTo(
        logoRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 7.2 },
      );

      gsap.fromTo(
        imageRef.current,
        { scale: 1 },
        {
          scale: 1.2,
          duration: 1,
          ease: "power2.out",
          delay: 2,
        },
      );

      gsap.fromTo(
        overlayRef.current,
        { scaleY: 0, transformOrigin: "center bottom" },
        {
          scaleY: 1,
          duration: 1,
          ease: "power2.out",
          delay: 2, 
        },
      );

      // Second view text reveal with scroll trigger
      gsap.fromTo(
        secondViewRef.current?.children || [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: secondViewRef.current,
            start: "top 85%",
            end: "bottom 30%",
            toggleActions: "play none none reverse",
            markers: false, 
          },
        },
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-[200vh] overflow-hidden z-10">
      {/* Background Image */}
      <div ref={imageRef} className="absolute inset-0 w-full h-full z-0" style={{ willChange: "transform" }}>
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
      <div ref={logoRef} className="absolute top-12 left-20 z-20">
       <Image
          src="/mainLogomini.svg"
          height="74"
          width="74"
          alt="logo"
          className="h-16 w-16 md:h-20 md:w-20 lg:h-20 lg:w-20 "
          style={{ willChange: "transform" }}
          priority
        />
      </div>

      {/* First view */}
      <div
        ref={firstViewRef}
        className="relative z-30 h-screen flex flex-col items-center justify-center text-white px-4"
      >
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-lg md:text-xl mb-6 opacity-90 title">Stress is a loop that keeps you stuck.</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 tracking-wide custom-margin custom-size">InnerSmith</h1>
          <p className="text-lg md:text-xl mb-12 second-custom">
            helps you break free and <em className="italic">Feel Better, Live Better.</em>
          </p>
          <div className="flex flex-col items-center">
            <div className="w-6 h-10 custom-height-and-width mb-2 border-2 border-white rounded-full flex justify-center items-start animate-bounce">
              <div className="w-1 h-2 mini-dot bg-white rounded-full mt-2"></div>
            </div>
            <p className="text-sm scroll-text uppercase tracking-wider">Scroll to Continue</p>
          </div>
        </div>
      </div>

      {/* Second view */}
      <div
        ref={secondViewRef}
        className="relative z-20 h-screen flex items-center justify-center text-white px-4"
      >
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-xl para md:text-2xl mb-8 opacity-90">
            Say hello to the <span className="font-semibold">world's first holistic wellness app</span>
          </h2>
          <p className="text-lg md:text-xl para leading-relaxed custom-margin">
            that improves your sleep, focus, and emotional balance,
            <br />
            starting on day one.
          </p>
        </div>
      </div>
    </section>
  );
}