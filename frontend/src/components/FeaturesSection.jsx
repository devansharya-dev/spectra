import { useState, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FeatureCard = memo(({ feature, index }) => {
  const isSecurity = feature?.title === "Security";
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`${feature?.size || ""} group relative overflow-hidden rounded-[3.5rem] bg-white border border-zinc-100 transition-all duration-700 hover:shadow-[0_80px_100px_-20px_rgba(0,0,0,0.15)] ${
        isSecurity ? "h-[400px] md:h-[500px]" : "h-[300px] md:h-[380px]"
      }`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={feature?.img}
          alt={feature?.title}
          className={`w-full h-full transition-all duration-1000 ease-[0.22,1,0.36,1] grayscale-0 md:grayscale md:group-hover:grayscale-0 opacity-100 md:opacity-40 md:group-hover:opacity-100 scale-110 group-hover:scale-100 ${isSecurity ? "object-cover object-center" : "object-cover"}`}
        />
        <div className={`absolute inset-0 transition-opacity duration-700 ${isSecurity ? "bg-gradient-to-r from-white/90 via-white/20 to-transparent" : "bg-white/10 md:bg-gradient-to-b md:from-white/95 md:via-white/10 md:to-transparent md:group-hover:opacity-0"}`} />
      </div>
      
      <div className="relative z-10 p-12 h-full flex flex-col justify-between pointer-events-none">
        <div className="transform group-hover:-translate-y-2 transition-transform duration-700">
          <h3 className="text-4xl md:text-5xl font-['BebasNeue'] tracking-wider text-zinc-900 italic uppercase leading-[0.8]">{feature?.title}</h3>
          <p className="text-zinc-400 text-[9px] md:text-[10px] uppercase tracking-[0.5em] mt-5 font-black group-hover:text-black transition-colors">{feature?.desc}</p>
        </div>
      </div>
    </motion.div>
  );
});

const Featured = () => {
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const features = [
    { title: "Automation", desc: "Intelligent workflows.", img: "/images/automation.png", size: "md:col-span-2 lg:col-span-2" },
    { title: "AI Insights", desc: "Instant data clarity.", img: "/images/AI_Insights_2.png", size: "md:col-span-1 lg:col-span-1" },
    { title: "Real-time Sync", desc: "Live updates.", img: "/images/real-time-sync.png", size: "md:col-span-1 lg:col-span-1" },
    { title: "Security", desc: "Safe by design.", img: "/images/security.png", size: "md:col-span-2 lg:col-span-4" },
  ];

  return (
    <section id="features" data-scroll-section className="w-full bg-[#f8f8f8] py-32 md:py-56 px-6 md:px-16 lg:px-24 overflow-hidden font-sans">
      
      <div className="max-w-7xl mx-auto mb-32">
        <h2 className="text-[18vw] md:text-[14vw] font-['BebasNeue'] tracking-tighter leading-[0.7] uppercase text-zinc-900 italic">
          Augen <span className="text-zinc-200 not-italic">Vision</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-64 items-end max-w-7xl mx-auto">
        {features.map((f, i) => (
          <FeatureCard key={i} feature={f} index={i} />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full flex flex-col items-center"
      >
        <div className="flex flex-col items-center gap-6 mb-24 text-center">
          <h3 className="text-6xl md:text-9xl font-['BebasNeue'] text-zinc-900 uppercase italic leading-none">Visual Showcase</h3>
        </div>

        {/* --- VIDEO CONTAINER WITH SIDE SHADOWS & GLOW --- */}
        <div className="relative w-full max-w-[380px] md:max-w-[450px]">
          
          {/* Side Neon Shadow/Glow (Left & Right) */}
          <div className={`absolute -inset-x-12 inset-y-20 bg-cyan-500/20 blur-[100px] transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className={`absolute -inset-x-4 inset-y-10 bg-black/10 blur-3xl transition-opacity duration-700`}></div>

          <div 
            onClick={togglePlay}
            /* Premium Shadow for the Box itself */
            className="relative z-10 w-full h-[600px] md:h-[780px] bg-black rounded-[4rem] overflow-hidden shadow-[0_100px_100px_-50px_rgba(0,0,0,0.6)] border-[12px] border-white ring-1 ring-zinc-200 cursor-pointer"
          >
            <video
              ref={videoRef}
              src="/video/demo2.mp4"
              loop
              muted={muted}
              playsInline
              className={`w-full h-full object-contain transition-all duration-700 ${isPlaying ? 'opacity-100' : 'opacity-80 blur-[2px]'}`}
            />

            <AnimatePresence>
              {!isPlaying && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[4px] z-30"
                >
                  <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[18px] border-t-transparent border-l-[30px] border-l-white border-b-[18px] border-b-transparent ml-3"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-10 left-0 right-0 px-10 z-40">
               <button 
                  onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
                  className="w-full py-5 bg-white/95 backdrop-blur-3xl rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-black shadow-2xl active:scale-95 transition-all hover:bg-cyan-500 hover:text-white"
               >
                  {muted ? "Activate Audio" : "Silence Feed"}
               </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Featured;