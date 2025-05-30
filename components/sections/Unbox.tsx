import Image from "next/image"

export default function Unbox() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center p-4 bg-gray-50"
      id="unbox"
      style={{ scrollSnapAlign: 'start' }}>
      
      {/* Video Card Container */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 backdrop-blur-sm">
          
          {/* Video Wrapper with Proper Aspect Ratio */}
          <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden">
            <video 
              src="https://thescaleagency.s3.amazonaws.com/innersmith_desktop.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-contain rounded-3xl"
            />
            
            {/* Optional: Gradient overlay for better text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none rounded-3xl"></div>
          </div>
          
          {/* Optional: Card Footer/Info Section */}
          <div className="p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              Unbox Experience
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Discover the premium unboxing experience
            </p>
          </div>
        </div>
      </div>
      
      {/* Mobile-specific styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .video-card {
            margin: 1rem;
            border-radius: 1.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .video-card {
            margin: 0.5rem;
            border-radius: 1rem;
          }
        }
      `}</style>
    </section>
  )
}