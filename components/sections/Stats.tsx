"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./MobileSlider.css";

const affectedDataSlide = [
  { title: "970M", text: "globally experience a mental disorder." },
  { title: "77%", text: "say stress affects their body." },
  { title: "31%", text: "rank stress as their #1 health concern." },
];

const Stats = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slidesRef = useRef<Array<HTMLDivElement | null>>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const animateSlideIn = (index: number) => {
    const slide = slidesRef.current[index];
    if (slide) {
      gsap.fromTo(
        slide,
        { autoAlpha: 0, y: 100 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
          pointerEvents: "auto",
        }
      );
    }
  };

  const animateSlideOut = (index: number) => {
    const slide = slidesRef.current[index];
    if (slide) {
      gsap.to(slide, {
        autoAlpha: 0,
        y: -100,
        duration: 1,
        ease: "power4.inOut",
        pointerEvents: "none",
      });
    }
  };

  useEffect(() => {
    animateSlideIn(activeIndex);

    intervalRef.current = setInterval(() => {
      const nextIndex = (activeIndex + 1) % affectedDataSlide.length;
      animateSlideOut(activeIndex);
      setTimeout(() => {
        setActiveIndex(nextIndex);
        animateSlideIn(nextIndex);
      }, 1000); // Match animation duration
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeIndex]);

  return (
    <section
      className="h-screen bg-black w-screen overflow-hidden relative px-4 py-10 sm:py-16 md:py-20"
      id="stats"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="flex flex-col lg:flex-row justify-center items-center h-full w-full gap-10 lg:gap-20 mx-auto">
        <div className="text-white stats-text font-light text-xl lg:text-4xl text-center lg:text-left whitespace-nowrap">
          You&apos;re Not Alone—
        </div>

        <div className="relative w-full slider-state max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] overflow-hidden">
          {affectedDataSlide.map((slide, idx) => (
            <div
              key={idx}
              ref={(el) => {
                if (el) slidesRef.current[idx] = el;
              }}
              className="absolute top-0 left-0 lg:left-20 w-full h-full flex flex-col justify-center items-start px-4 text-left opacity-0 pointer-events-none"
            >
              <h1 className="text-[#FF7171] text-6xl state-heading font-bold leading-none border-b-2 border-[#FF7171] pb-2">
                {slide.title}
                <span className="uppercase text-3xl people font-normal ml-2">
                  PEOPLE
                </span>
              </h1>
              <h3 className="text-white text-2xl slide-text font-normal pt-2 leading-tight">
                {slide.text}
              </h3>
            </div>
          ))}
        </div>

        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {affectedDataSlide.map((_, idx) => (
            <span
              key={idx}
              className={`transition-all duration-300 rounded-full ${
                idx === activeIndex ? "w-12 bg-[#FF7171]" : "w-6 bg-[#FF7171]/50"
              } h-3 flex-shrink-0 cursor-pointer`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;