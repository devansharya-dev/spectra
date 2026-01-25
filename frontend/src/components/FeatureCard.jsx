import { useRef } from "react";

const FeatureCard = ({ title, desc, videoSrc, onTry, showButton = true }) => {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0; // restart cleanly
    videoRef.current.play();
  };

  const handleMouseLeave = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0; // reset frame
  };

  return (
    <div
      className="
        border border-white/20 rounded-xl p-1 md:p-2
        flex flex-col gap-1 md:gap-2
        transition-all duration-300 ease-out
        hover:shadow-lg hover:shadow-white/10
        hover:-translate-y-1 hover:scale-[1.03]
      "
    >
      {/* Recorded video */}
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        loop
        preload="metadata"
        playsInline
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="
          rounded-lg border border-white/10
          w-full h-auto
          transition-transform duration-300
        "
      />

      <h3 className="text-lg md:text-xl text-white">
        {title}
      </h3>

      <p className="text-[#D1DCD9] text-sm md:text-base">
        {desc}
      </p>

      {showButton && (
        <button
          onClick={onTry}
          className="
            mt-auto border border-white rounded-full
            px-4 md:px-5 py-2
            text-sm md:text-base
            transition-all duration-300
            hover:bg-white hover:text-black hover:scale-105
          "
        >
          Try Demo
        </button>
      )}
    </div>
  );
};

export default FeatureCard;
