import Image from "next/image"

export default function Unbox() {
  return (
    <section className="relative w-full h-screen overflow-hidden"
      id="unbox"
      style={{ scrollSnapAlign: 'start' }}>
      <video 
        src="https://thescaleagency.s3.amazonaws.com/innersmith_desktop.mp4" 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
    </section>
  )
}