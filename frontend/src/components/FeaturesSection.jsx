import { useState, useRef, memo } from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

const FeatureCard = memo(({ feature, index }) => {
  const isSecurity = feature.title === "Security";

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeInUp}
      /* HEIGHT FIX: Security card ke liye h-[450px] apply kiya hai */
      className={`${feature.size} group relative overflow-hidden rounded-[2rem] bg-white border border-zinc-100 transition-all duration-500 hover:shadow-2xl ${
        isSecurity ? "h-[350px] md:h-[450px]" : "h-[280px] md:h-[350px]"
      }`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={feature.img}
          alt={feature.title}
          loading="lazy"
          className={`w-full h-full transition-all duration-1000 ease-out 
            grayscale-0 md:grayscale md:group-hover:grayscale-0 
            opacity-100 md:opacity-40 md:group-hover:opacity-100 
            scale-105 group-hover:scale-100
            ${isSecurity ? "object-cover object-center bg-zinc-50" : "object-cover"}
          `}
        />
        <div className={`absolute inset-0 transition-opacity duration-700 
          ${isSecurity 
            ? "bg-gradient-to-r from-white/70 via-transparent to-transparent" 
            : "bg-white/20 md:bg-gradient-to-b md:from-white/80 md:via-white/20 md:to-transparent md:group-hover:opacity-0"}
        `} />
      </div>

      <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-between pointer-events-none">
        <div className="transform group-hover:-translate-y-2 transition-transform duration-500">
          <h3 className="text-3xl md:text-4xl font-['BebasNeue'] tracking-wider text-zinc-900 italic uppercase leading-none">
            {feature.title}
          </h3>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mt-3 font-bold group-hover:text-black transition-colors">
            {feature.desc}
          </p>
        </div>
        <div className="hidden md:flex w-12 h-12 rounded-full border border-zinc-200 group-hover:border-black items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <span className="text-zinc-900 text-xl font-light">↗</span>
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
    { title: "Automation", desc: "Intelligent workflows.", img: "/images/echo.png", size: "md:col-span-2" },
    { title: "AI Insights", desc: "Instant data clarity.", img: "/images/obj.jpeg", size: "md:col-span-1" },
    { title: "Real-time Sync", desc: "Live updates.", img: "/images/gg.jpeg", size: "md:col-span-1" },
    { title: "Security", desc: "Safe by design.", img: "/images/echo3.jpeg", size: "md:col-span-4" },
  ];

  return (
    <section id="features" data-scroll-section className="w-full bg-[#fcfcfc] py-20 md:py-32 px-5 md:px-16 lg:px-24 overflow-hidden">
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mb-20"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-[2px] bg-zinc-800"></div>
          <span className="uppercase tracking-[0.4em] text-[10px] font-black text-zinc-500">Capabilities</span>
        </div>
        <h2 className="text-7xl md:text-9xl font-['BebasNeue'] tracking-tight leading-none uppercase text-zinc-900">
          Augen <span className="text-zinc-400 italic">Vision</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-32 items-end">
        {features.map((f, i) => (
          <FeatureCard key={i} feature={f} index={i} />
        ))}
      </div>

      {/* Video Section remains same as per your logic */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full flex flex-col items-center"
      >
        <div className="w-full flex items-center gap-8 mb-16">
           <div className="h-[1px] flex-1 bg-zinc-200"></div>
           <div className="flex flex-col items-center gap-2">
             <span className="font-['BebasNeue'] text-4xl md:text-6xl tracking-[0.1em] text-zinc-900">Demo Video</span>
             <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold">Watch Augen in action</span>
           </div>
           <div className="h-[1px] flex-1 bg-zinc-200"></div>
        </div>

        <div 
          onClick={togglePlay}
          className="relative w-full max-w-[320px] md:max-w-[420px] aspect-[9/16] bg-black rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl cursor-pointer group border-[8px] md:border-[12px] border-white ring-1 ring-zinc-200"
        >
          <video
            ref={videoRef}
            src="/video/demo2.mp4"
            loop
            muted={muted}
            playsInline
            className={`w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'scale-100 opacity-100' : 'scale-105 opacity-70 blur-[1px]'}`}
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center transition-transform group-hover:scale-110">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
              </div>
            </div>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
            className="absolute bottom-10 right-1/2 translate-x-1/2 bg-white/90 backdrop-blur-md px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-black shadow-xl z-20"
          >
            {muted ? "Unmute" : "Mute"}
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Featured;