const FeatureCard = ({
  title,
  desc,
  videoSrc,
  imageSrc,
  onTry,
  showButton = true,
  className = "",
}) => {
  const showVideo = Boolean(videoSrc);
  const showImage = !showVideo && Boolean(imageSrc);

  return (
    <div className={`border border-white/20 rounded-xl p-1 md:p-2 flex flex-col gap-1 md:gap-2 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 hover:scale-105 ${className}`}>
      {showVideo && (
        <video
          src={videoSrc}
          muted
          loop
          preload="metadata"
          onMouseOver={(event) => event.target.play()}
          onMouseOut={(event) => event.target.pause()}
          className="rounded-lg border border-white/10 w-full h-auto"
        />
      )}

      {showImage && (
        <img
          src={imageSrc}
          alt={title}
          loading="lazy"
          className="rounded-lg border border-white/10 w-full h-auto object-cover"
        />
      )}

      <h3 className="text-lg md:text-xl">{title}</h3>

      <p className="text-[#D1DCD9] text-sm md:text-base">
        {desc}
      </p>

      {showButton && (
        <button
          onClick={onTry}
          className="mt-auto border border-white rounded-full px-4 md:px-5 py-2 text-sm md:text-base hover:bg-white hover:text-black transition"
        >
          Try Demo
        </button>
      )}

    </div>
  );
};

export default FeatureCard;
