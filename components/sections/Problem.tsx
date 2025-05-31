"use client";
import React, { useEffect, useRef } from 'react';
import LaptopLottie from '@/components/laptopLottie';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Problem() {
  const sectionRef = useRef(null);
  const triggerRef = useRef<ScrollTrigger | undefined>(undefined);

  useEffect(() => {
    let tl: gsap.core.Timeline | undefined;

    const setupAnimations = () => {
      const section = sectionRef.current;

      // Split text for animation
      const heading = new SplitType(".problem-heading", {
        types: "words,chars",
      });

      if (!section) return;

      gsap.set(section, { clearProps: "all" });

      // Prevent words from breaking across lines
      document.querySelectorAll(".problem-heading .word").forEach((el) => {
        (el as HTMLElement).style.whiteSpace = "nowrap";
      });

      // Timeline for animation
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top-=100% center",
          end: "bottom-=100% top",
          toggleActions: "play reverse play reverse",
          markers: false,
        },
        defaults: { ease: "power2.out" },
      });

      tl.fromTo(
        ".problem-heading .char",
        { fontWeight: "300", color: "#515151" },
        {
          fontWeight: "400",
          color: "#000",
          stagger: 0.1,
          duration: 0.2,
        }
      );

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
      className="h-screen bg-white w-full flex relative justify-start max-sm:py-[3rem] items-center overflow-hidden"
      ref={sectionRef}
      id="problem"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Desktop Layout (md and above) */}
      <div className="hidden lg:grid grid-cols-2 mx-[5rem] max-sm:h-full max-sm:py-[5rem]">
        <div className="flex flex-col justify-center gap-[2rem] pr-[4rem] items-start max-sm:items-center max-sm:mb-10">
          <h2 className="text-[#525299] font-semibold text-[1.125rem] md:text-[1.25rem]">
            The Problem
          </h2>
          <p className="text-[2.25rem] md:text-[3rem] text-left text-[#515151] font-[300] max-sm:text-center leading-[1.25]">
            <span className="problem-heading font-[400] text-black">
              Stress is a lifestyle issue.
            </span>{" "}
            It builds quietly, drains you daily, but we don’t talk about it enough.
          </p>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[603px] h-auto">
            <LaptopLottie />
          </div>
        </div>
      </div>

      {/* Mobile Layout (below md) */}
      <div className="lg:hidden md:grid w-full h-full flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full flex flex-col items-center text-center gap-8">
          <h2 className="text-[#525299] font-semibold text-[1.5rem] title leading-tight">
            The Problem
          </h2>
          <p className="text-[2rem] para text-center text-[#8a8a8a] font-light leading-relaxed">
            <span className="problem-heading font-medium text-black">
              Stress is a lifestyle issue.
            </span>{" "}
            It builds quietly, drains you daily, but we don’t talk about it enough.
          </p>
          <div className="w-full mt-4">
            <LaptopLottie />
          </div>
        </div>
      </div>
    </section>
  );
}