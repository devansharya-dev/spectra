import { motion } from "framer-motion";

const Hero = () => {
  const scrollToFeatures = () => {
    document.querySelector('#features')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section
      id="home"
      data-scroll-section
      className="relative w-full h-screen flex items-end justify-center bg-black overflow-hidden pb-20 md:pb-32"
    >
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity duration-1000"
        src="/video/Smart_Glasses_Change_Future_Video.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />

      {/* Advanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />

      {/* Main Content - Positioned at Bottom for better visibility */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 text-center">
        
        {/* Animated Subheading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="w-8 h-[1px] bg-cyan-500/50"></div>
          <span className="uppercase tracking-[0.6em] text-[9px] font-bold text-cyan-400 font-mono">
            Augen Pro-X Intelligence
          </span>
          <div className="w-8 h-[1px] bg-cyan-500/50"></div>
        </motion.div>

        {/* Updated Font: Bebas Neue for Smart Vision */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl sm:text-8xl md:text-[9rem] font-['BebasNeue'] not-italic tracking-tight leading-[0.85] text-white uppercase italic"
        >
          Smart Vision <br />
          <span className="text-zinc-600 not-italic">Reimagined</span>
        </motion.h1>

        {/* Description - Using Modern Sans-Serif */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-8 text-sm md:text-lg text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed tracking-wider"
        >
          Precision-engineered optics meets proactive context awareness. <br className="hidden md:block" />
          The future of professional workflow, delivered through 
          <span className="text-white"> Augmented Reality.</span>
        </motion.p>

        {/* Buttons UI */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row gap-5 justify-center items-center"
        >
          <button 
            onClick={() => document.querySelector('#newpage')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-10 py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-full overflow-hidden transition-all duration-500"
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Explore Capabilities</span>
            <div className="absolute inset-0 bg-cyan-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </button>

          <button 
            onClick={scrollToFeatures}
            className="px-10 py-4 border border-zinc-800 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-black transition-all duration-500 shadow-xl"
          >
            View Demonstration
          </button>
        </motion.div>
      </div>

      {/* Decorative Side Text */}
      <div className="absolute left-10 bottom-10 hidden lg:block opacity-20 hover:opacity-100 transition-opacity">
        <span className="text-[10px] text-white uppercase tracking-[1em] font-light vertical-text" style={{ writingMode: 'vertical-rl' }}>
          Future is Visionary
        </span>
      </div>
    </section>
  );
};

export default Hero;