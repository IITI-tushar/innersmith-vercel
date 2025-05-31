import React, { useEffect, useRef } from 'react';

interface DisruptProps {
  isActive?: boolean;
}

export default function Disrupt({ isActive }: DisruptProps) {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const tabletVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videos = [desktopVideoRef.current, tabletVideoRef.current, mobileVideoRef.current].filter(Boolean) as HTMLVideoElement[];
    
    videos.forEach(videoNode => {
      if (isActive) {
        if (videoNode.paused) {
          videoNode.play().catch(error => {
            console.warn("Video play prevented:", error);
          });
        }
      } else {
        if (!videoNode.paused) {
          videoNode.pause();
        }
      }
    });
  }, [isActive]);

  return (
    <section className="h-screen relative overflow-hidden bg-white"
      id="disrupt"
      style={{ scrollSnapAlign: 'start' }}>
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full items-center">
        <div className="w-3/5 flex items-center px-8 xl:px-16 2xl:px-20">
          <div className="max-w-2xl space-y-6 xl:space-y-8">
            <h3 className="text-lg xl:text-xl title font-normal text-sky-400 leading-relaxed">
              But... What if You Could Disrupt the Spiral?
            </h3>
            <h2 className="text-4xl xl:text-5xl 2xl:text-6xl font-light leading-tight text-gray-900">
              What if support showed up the moment the tension set in?{' '}
              <span className="text-gray-500">
                What if something helped you feel better in minutes?
              </span>
            </h2>
          </div>
        </div>
        
        <div className="w-2/5 h-full flex items-center justify-center px-8">
          <div className="w-full max-w-[17rem]">
            <video
              ref={desktopVideoRef}
              src="/weight_animation.mp4"
              loop
              muted
              playsInline
              className="w-full h-full"
              tabIndex={-1}
            />
          </div>
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:flex lg:hidden h-full flex-col">
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="custom-width text-center space-y-5">
            <h3 className="text-lg font-normal text-sky-400 title leading-relaxed">
              But... What if You Could Disrupt the Spiral?
            </h3>
            <h2 className="text-3xl md:text-4xl font-light leading-tight para text-gray-900">
              What if support showed up the moment the tension set in?{' '}
              <span className="text-gray-500 para">
                What if something helped you feel better in minutes?
              </span>
            </h2>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-sm">
            <video
              ref={tabletVideoRef}
              src="/weight_animation.mp4"
              loop
              muted
              playsInline
              className="w-full h-auto"
              tabIndex={-1}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-full flex flex-col py-8">
        <div className="flex-1 flex items-center px-6">
          <div className="space-y-4">
            <h3 className="text-base font-normal text-sky-400 leading-relaxed">
              But... What if You Could Disrupt the Spiral?
            </h3>
            <h2 className="text-2xl font-light leading-tight text-gray-900">
              What if support showed up the moment the tension set in?{' '}
              <span className="text-gray-500">
                What if something helped you feel better in minutes?
              </span>
            </h2>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-xs">
             <video
              ref={mobileVideoRef}
              src="/weight_animation.mp4"
              loop
              muted
              playsInline
              className="w-full h-auto"
              tabIndex={-1}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

//issue: disrupt section loaded on the top of the page, but it should be below the stats section.
