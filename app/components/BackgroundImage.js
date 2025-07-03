export default function BackgroundImage() {
  return (
    <div className="absolute inset-0">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900" />
      
      {/* Overlay Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      {/* Floating Book Icons */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-8 h-8 text-white/10 animate-float-slow">
          📖
        </div>
        <div className="absolute top-32 right-20 w-6 h-6 text-white/10 animate-float-medium">
          📚
        </div>
        <div className="absolute bottom-40 left-20 w-10 h-10 text-white/10 animate-float-fast">
          📝
        </div>
        <div className="absolute top-1/3 right-1/4 w-7 h-7 text-white/10 animate-float-slow">
          📓
        </div>
        <div className="absolute bottom-20 right-10 w-9 h-9 text-white/10 animate-float-medium">
          📕
        </div>
      </div>
      
      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
    </div>
  );
} 