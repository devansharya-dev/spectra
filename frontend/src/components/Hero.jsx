

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
      className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden"
    >
      {/* Video Background - subtle, not dominating */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-60 sm:block"
        src="/video/Smart_Glasses_Change_Future_Video.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        loading="lazy"
      />

      {/* Strong but elegant overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Main content - centered, generous spacing */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-16 text-center">
        <h1 
          className="
            text-5xl sm:text-6xl md:text-7xl lg:text-8xl 
            font-medium leading-none tracking-tight 
            text-white
          "
          style={{ fontFamily: "'Helvetica Neue', 'Arial', sans-serif" }} // Clean, timeless choice
        >
          Smart Vision
          <br className="sm:hidden" />
          Reimagined
        </h1>

        <p className="
          mt-8 md:mt-12 
          text-xl sm:text-2xl md:text-3xl 
          text-gray-300 font-light max-w-3xl mx-auto leading-relaxed
        ">
          Augmented reality glasses engineered for clarity, precision, 
          and seamless integration into professional workflows.
        </p>

        {/* Buttons - understated, high-end */}
        <div className="
          mt-12 md:mt-16 
          flex flex-col sm:flex-row 
          gap-6 justify-center items-center
        ">
          <button 
            className="
              px-10 py-5 
              bg-white text-black 
              font-medium text-lg 
              rounded-full 
              hover:bg-gray-200 
              transition-colors duration-300
              min-w-[220px]
            "
          >
            Explore Capabilities
          </button>

          <button 
            onClick={scrollToFeatures}
            className="
              px-10 py-5 
              border border-gray-500 text-white 
              font-medium text-lg 
              rounded-full 
              hover:border-gray-300 
              hover:bg-white/5 
              transition-all duration-300
              min-w-[220px]
            "
          >
            View Demonstration
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;