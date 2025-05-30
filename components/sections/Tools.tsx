"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const cardData = [
  {
    image: "/svgs/user.svg",
    title: "9 in 10 Feel Better in Just 14 Days",
    description: "Tailored stress relief, powered by practices old and new, proven to help you feel better.",
  },
  {
    image: "/svgs/accur.svg",
    title: "98% tool match accuracy",
    description: "Every recommendation is tuned to your mood, energy, and what actually helps you reset.",
  },
  {
    image: "/svgs/risk.svg",
    title: "healing path, one just for you.",
    description: "Explore daily journeys that shift and grow with how you feel.",
  },
  {
    image: "/svgs/journey.svg",
    title: "7 days Risk-free trial",
    description: "Experience meaningful change, or get 100% of your money back, no questions asked.",
  },
];

export default function Tools() {
  const titleRef = useRef(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const displayedCards = isMobile ? cardData.slice(0, 2) : cardData;

  useEffect(() => {
    if (titleRef.current) {
      const splitTitle = new SplitType(titleRef.current, { types: "lines" });
      gsap.fromTo(
        splitTitle.lines,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
        }
      );
    }

    cardRefs.current.forEach((card, index) => {
      if (card) {
        const cardImage = card.querySelector(".card-image");
        const cardTitleElement = card.querySelector(".card-title") as HTMLElement | null;
        const cardDescElement = card.querySelector(".card-description") as HTMLElement | null;

        if (cardTitleElement && cardDescElement) {
          const splitCardTitle = new SplitType(cardTitleElement, { types: "lines" });
          const splitCardDesc = new SplitType(cardDescElement, { types: "lines" });

          gsap.fromTo(
            card,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              delay: index * 0.2,
            }
          );
          if (cardImage) {
            gsap.fromTo(
              cardImage,
              { opacity: 0, scale: 0.8 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                delay: index * 0.2,
              }
            );
          }

          gsap.fromTo(
            splitCardTitle.lines,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.1,
              delay: index * 0.2 + 0.2,
            }
          );

          gsap.fromTo(
            splitCardDesc.lines,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.1,
              delay: index * 0.2 + 0.4,
            }
          );
        }
      }
    });
  }, []);

  return (
    <section 
      className="bg-white min-h-screen h-screen flex flex-col justify-center overflow-hidden"
      id="tools"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-center">
        <div ref={titleRef} className="text-center my-10 mb-8 sm:mb-12 lg:mb-16 flex-shrink-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 title leading-tight">
            <span className="font-semibold">500+</span> Scientifically-Backed
            <br />
            Tools, <span className="text-gray-600">Matched to You</span>
          </h2>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl mx-auto">
            {displayedCards.map((card, index) => (
              <Card
                key={index}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="rounded-2xl shadow-md text-left relative overflow-hidden min-h-[200px] sm:min-h-[220px] lg:min-h-[240px]"
              >
                <CardContent className="p-4 sm:p-6 lg:p-8 relative z-10 h-full flex flex-col">
                  <div className="w-full mb-3 sm:mb-4 flex-shrink-0">
                    <Image
                      src={card.image}
                      alt={card.title}
                      width={400}
                      height={100}
                      className="card-image h-10 sm:h-12 lg:h-16 w-full object-contain"
                    />
                  </div>
                  <h3 className="card-title font-semibold text-sm sm:text-base lg:text-lg mb-2 text-gray-900 flex-shrink-0">
                    {card.title}
                  </h3>
                  <p className="card-description text-xs sm:text-sm text-gray-600 leading-relaxed flex-1">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}