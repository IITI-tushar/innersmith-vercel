import "./MobileSlider.css"
export default function Feel() {
  return (
    <section className="h-screen relative overflow-hidden bg-gray-50"
      id="feel"
      style={{ scrollSnapAlign: 'start' }}>
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full items-center">
        <div className="w-3/5 flex items-center px-8 xl:px-16 2xl:px-20">
          <div className="max-w-2xl space-y-6 xl:space-y-8">
            <h3 className="text-lg xl:text-xl font-normal  text-orange-400 leading-relaxed">
              Feel More You, With InnerSmith
            </h3>
            <h2 className="text-4xl xl:text-5xl 2xl:text-6xl font-light  leading-tight text-gray-900">
              InnerSmith guides you through quick, calming activities{' '}
              <span className="text-gray-500 para">
                that help you show up for your work, your people, and yourself.
              </span>
            </h2>
          </div>
        </div>
        
        <div className="w-2/5 h-full flex items-center justify-center px-8">
          <div className="w-full max-w-md aspect-square bg-black rounded-3xl overflow-hidden">
            
            <div className="w-full h-full bg-black flex items-center justify-center">
              <div className="text-white/20 text-sm">Video Content</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:flex lg:hidden h-full flex-col">
        <div className="flex-1 flex items-center justify-center px-8">
          <div className=" custom-width text-center space-y-5">
            <h3 className="text-lg font-normal text-orange-400 title leading-relaxed">
              Feel More You, With InnerSmith
            </h3>
            <h2 className="text-3xl md:text-4xl font-light para leading-tight text-gray-900">
              InnerSmith guides you through quick, calming activities{' '}
              <span className="text-gray-500 para">
                that help you show up for your work, your people, and yourself.
              </span>
            </h2>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-[60vw] h-[60vw] aspect-square bg-black rounded-3xl overflow-hidden">
            <div className="w-full h-full bg-black flex items-center justify-center">
              <div className="text-white/20 text-sm">Video Content</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-full flex flex-col py-8">
        {/* Text Content */}
        <div className="flex-1 flex items-center px-6">
          <div className="space-y-4">
            <h3 className="text-base font-normal text-orange-400 leading-relaxed">
              Feel More You, With InnerSmith
            </h3>
            <h2 className="text-2xl font-light leading-tight text-gray-900">
              InnerSmith guides you through quick, calming activities{' '}
              <span className="text-gray-500">
                that help you show up for your work, your people, and yourself.
              </span>
            </h2>
          </div>
        </div>
        
        {/* Video/Image */}
        <div className="flex-1 flex  items-center justify-center px-6">
          <div className="w-full max-w-xs aspect-square bg-black rounded-3xl overflow-hidden">
            <div className="w-full h-full bg-black flex items-center justify-center">
              <div className="text-white/20 text-sm">Video Content</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}