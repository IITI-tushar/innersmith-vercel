"use client"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation } from "swiper/modules"
import type { Swiper as swp } from "swiper/types"

gsap.registerPlugin(ScrollTrigger)

const AppSlides = [
  {
    title: "Wellness, simplified.",
    content: "Holistic and personalized tools designed to help you feel better, anytime, anywhere.",
    imgLink: "/images/app-section.png",
  },
  {
    title: "Feel Supported",
    content: "A community that reminds you that you're never in this alone.",
    imgLink: "/svgs/mobileSlider/feelSupport.svg",
  },
  {
    title: "Shift Your Mindset",
    content: "Psychologically proven techniques like CBT & EFT to rewire negative thinking.",
    imgLink: "/svgs/mobileSlider/ShiftMind.svg",
  },
  {
    title: "Quiet Your Mind",
    content: "Powerful meditations & sensory resets for instant relief and balance.",
    imgLink: "/svgs/mobileSlider/QueitMind.svg",
  },
  {
    title: "Heal Creatively",
    content: "Art-based therapy, music, movement, and other expressive outlets for when words aren't enough.",
    imgLink: "/svgs/mobileSlider/Heal.svg",
  },
  {
    title: "Let It Out",
    content: "Venting spaces & guided reflections to process and heal, judgment-free.",
    imgLink: "/svgs/mobileSlider/LetitOut.svg",
  },
]

export default function App() {
  const isMobile = useIsMobile()
  const swiperRef = useRef<swp>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const textContentRef = useRef<HTMLDivElement>(null)
  const phoneFrameRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, subtitleRef.current, descriptionRef.current, dotsRef.current], {
        opacity: 0,
        y: 30,
      })
      gsap.set(phoneFrameRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 20,
      })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      })

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6",
        )
        .to(
          descriptionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6",
        )
        .to(
          dotsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6",
        )
        .to(
          phoneFrameRef.current,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out",
          },
          "-=0.8",
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (titleRef.current && subtitleRef.current && descriptionRef.current) {
      gsap.to([titleRef.current, descriptionRef.current], {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          gsap.to([titleRef.current, descriptionRef.current], {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          })
        },
      })
    }
  }, [activeIndex])

  const handleDotClick = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index)
    }
  }

  return (
    <section ref={sectionRef} className="min-h-screen w-full bg-[#f8f9fa] relative overflow-hidden flex items-center py-4 sm:py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 h-full max-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center h-full">
        
          <div ref={textContentRef} className="flex flex-col justify-center text-center lg:text-left order-2 lg:order-1 min-h-0 flex-shrink overflow-hidden">
            <h3 ref={titleRef} className="text-sm sm:text-base lg:text-xl text-[#7dd3fc] font-medium tracking-wide uppercase mb-2 sm:mb-4 flex-shrink-0">
              INSIDE THE APP
            </h3>
            <h2
              ref={subtitleRef}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-tight text-gray-900 mb-2 sm:mb-4 flex-shrink-0"
            >
              {AppSlides[activeIndex].title}
            </h2>
            <p
              ref={descriptionRef}
              className="text-sm sm:text-[10px] lg:text-lg xl:text-xl text-center lg:text-left leading-relaxed para text-gray-600 mb-4 sm:mb-8 w-full lg:max-w-lg flex-shrink min-h-0 line-clamp-3 sm:line-clamp-none font-light sm:font-normal"
            >
              {AppSlides[activeIndex].content}
            </p>

            <div ref={dotsRef} className="flex justify-center lg:justify-start space-x-3 flex-shrink-0 mt-auto">
              {AppSlides.map((_, index) => ( 
                <button
                  key={index}
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out cursor-pointer hover:scale-110 ${
                    index === activeIndex ? "w-8 sm:w-10 bg-teal-600" : "w-2 sm:w-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

        
          <div ref={phoneFrameRef} className="flex justify-center items-center order-1 lg:order-2 flex-shrink-0">
            <div className="relative">
              <div className="frame-size relative h-[60vh] w-[30vh] sm:h-[65vh] sm:w-[32vh] md:h-[70vh] md:w-[35vh] lg:w-[19vw] lg:h-[36vw] xl:w-[260px] xl:h-[520px] max-h-[520px]">
               
                <div className="absolute inset-0 z-20">
                  <Image
                    src="/svgs/mobileScreen.svg"
                    alt="Phone frame"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>

                <div className="absolute inset-0 z-10">
                  <div className="absolute top-[1.5%] left-[7%] right-[7%] bottom-[1.5%] rounded-[20px] sm:rounded-[28px] lg:rounded-[12px] xl:rounded-[12px] overflow-hidden">
                    <Swiper
                      modules={[Autoplay, Navigation]}
                      slidesPerView={1}
                      spaceBetween={0}
                      speed={1000}
                      navigation={false}
                      centeredSlides={true}
                      autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }}
                      onSwiper={(swiper) => {
                        swiperRef.current = swiper
                      }}
                      onSlideChange={(swiper) => {
                        setActiveIndex(swiper.realIndex)
                      }}
                      loop={true}
                      className="w-full h-full"
                    >
                      {AppSlides.map((slide, index) => (
                        <SwiperSlide key={index} className="relative">
                          <div className="relative w-full h-full">
                            <Image
                              src={slide.imgLink || "/placeholder.svg"}
                              alt={slide.title}
                              fill
                              className="object-cover object-center"
                              sizes="(max-width: 1024px) 340px, (max-width: 1280px) 280px, 420px"
                              priority={index === 0}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}