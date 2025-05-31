"use client";
import React, { useEffect, useRef } from 'react';
import LaptopLottie from '@/components/laptopLottie';
import { gsap } from 'gsap';
import SplitType from 'split-type';

interface ProblemProps {
  isActive?: boolean;
}

export default function Problem({ isActive }: ProblemProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const splitTextRef = useRef<SplitType | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Initialize SplitType
    const headings = section.querySelectorAll(".problem-heading");
    if (headings.length > 0) {
      splitTextRef.current = new SplitType(Array.from(headings) as HTMLElement[], {
        types: "words,chars",
      });

      // Prevent words from breaking across lines
      section.querySelectorAll(".problem-heading .word").forEach((el) => {
        (el as HTMLElement).style.whiteSpace = "nowrap";
      });

      // Set initial state
      if (splitTextRef.current.chars) {
        gsap.set(splitTextRef.current.chars, { 
          fontWeight: "300", 
          color: "#515151" 
        });
      }
    }

    return () => {
      // Cleanup
      if (splitTextRef.current && headings.length > 0) {
        splitTextRef.current.revert();
      }
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    if (!splitTextRef.current?.chars) return;

    // Kill previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    if (isActive) {
      // Animate in when section becomes active
      timelineRef.current = gsap.timeline({ defaults: { ease: "power2.out" } });
      timelineRef.current.to(splitTextRef.current.chars, {
        fontWeight: "400",
        color: "#000",
        stagger: 0.03,
        duration: 0.3,
        delay: 0.5 // Small delay after section transition
      });
    } else {
      // Reset to initial state when section becomes inactive
      gsap.set(splitTextRef.current.chars, { 
        fontWeight: "300", 
        color: "#515151" 
      });
    }
  }, [isActive]);

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
            It builds quietly, drains you daily, but we don't talk about it enough.
          </p>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[603px] h-auto">
            <LaptopLottie />
          </div>
        </div>
      </div>

      {/* Mobile Layout (below md) */}
      <div className="lg:hidden w-full h-full flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full flex flex-col items-center text-center gap-8">
          <h2 className="text-[#525299] font-semibold text-[1.5rem] title leading-tight">
            The Problem
          </h2>
          <p className="text-[2rem] para text-center text-[#8a8a8a] font-light leading-relaxed">
            <span className="problem-heading font-medium text-black">
              Stress is a lifestyle issue.
            </span>{" "}
            It builds quietly, drains you daily, but we don't talk about it enough.
          </p>
          <div className="w-full mt-4">
            <LaptopLottie />
          </div>
        </div>
      </div>
    </section>
  );
}