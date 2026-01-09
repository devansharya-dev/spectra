import { useState, useRef } from "react";
import FeatureCard from "./FeatureCard";

const Featured = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [muted, setMuted] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
  };

  return (
    <section
      id="features"
      data-scroll-section
      className="w-full bg-[#D1DCD9] text-black py-12 md:py-16 lg:py-24 px-4 sm:px-8 md:px-12 lg:px-20"
    >
      {/* Header */}
      <div className="mb-12 md:mb-16">
        <p className="uppercase text-xs md:text-sm tracking-widest text-[#9AA8A4]">
          Featured
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl mt-4">
          See it. Then try it live.
        </h2>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-20">
        <FeatureCard
          title="Automation"
          desc="Trigger workflows automatically."
          videoSrc="/video/demo1.mp4"
          onTry={() => setActiveFeature("automation")}
          showButton={false}
        />
        <FeatureCard
          title="AI Insights"
          desc="Understand your data instantly."
          videoSrc="/video/demo1.mp4"
          onTry={() => setActiveFeature("insights")}
          showButton={false}
        />
        <FeatureCard
          title="Real-time Sync"
          desc="Everything updates live."
          videoSrc="/video/demo1.mp4"
          onTry={() => setActiveFeature("sync")}
          showButton={false}
        />
        <FeatureCard
          title="Security"
          desc="Safe by design."
          videoSrc="/video/demo1.mp4"
          onTry={() => setActiveFeature("security")}
          showButton={false}
        />
      </div>

      {/* Demo Video Section */}
      <div className="mt-12">
        <h3 className="text-2xl md:text-3xl mb-6">
          Here is the demo video
        </h3>

        <div className="flex justify-center">
          <div
            className={`relative w-full md:w-3/4 lg:w-1/2 overflow-hidden rounded-lg transition-all duration-300
              ${expanded ? "max-h-[80vh]" : "max-h-[360px]"}
            `}
          >
            {/* Blurred background video */}
            <video
              src="/video/demo1.mp4"
              loop
              muted
              preload="metadata"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-40"
            />

            {/* Foreground video (FULL, NOT CROPPED) */}
            <video
              ref={videoRef}
              src="/video/demo1.mp4"
              loop
              muted={muted}
              preload="metadata"
              loading="lazy"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="relative z-10 w-full h-full object-contain bg-transparent"
            />

            {/* Play/Pause Button */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center z-20"
              >
                <svg
                  className="w-16 h-16 text-white bg-black/50 rounded-full"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            )}

            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 z-20 bg-black/70 text-white px-3 py-2 rounded-full hover:bg-black/90 transition"
            >
              {muted ? "🔇" : "🔊"}
            </button>

            {/* Expand Button */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="absolute bottom-4 right-4 z-20 bg-black/70 text-white px-4 py-2 rounded-full hover:bg-black/90 transition"
            >
              {expanded ? "Collapse" : "Expand"}
            </button>
          </div>
        </div>
      </div>

      {/* Active Feature Message */}
      {activeFeature && (
        <div className="text-center text-gray-600 mt-8">
          Live demo coming soon for: {activeFeature}
        </div>
      )}
    </section>
  );
};

export default Featured;
