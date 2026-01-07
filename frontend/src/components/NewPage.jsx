import React, { useState } from "react";
import FeatureCard from "./FeatureCard";
import DemoSession from "./DemoSession";

const NewPage = () => {
  const [activeDemo, setActiveDemo] = useState(null);

  const handleTry = (feature) => {
    setActiveDemo(feature);
  };

  return (
    <section
      id="newpage"
      data-scroll-section
      data-scroll
      className="w-full bg-zinc-900 text-white py-8 md:py-12 lg:py-16 px-4 sm:px-8 md:px-12 lg:px-20"
    >
      <div className="max-w-6xl mx-auto">
        {!activeDemo ? (
          <>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Try the Features
            </h2>

            <p className="text-xl md:text-2xl text-gray-400 text-center mb-6 font-light">
              Click the buttons below to try out the different features.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <FeatureCard
                title="Automation"
                desc="Trigger workflows automatically."
                videoSrc="/video/demo1.mp4"
                onTry={() => handleTry("automation")}
              />

              <div className="text-center lg:px-6">
                <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed">
                  Experience the power of our cutting-edge features with interactive demos that bring innovation to life.
                </p>
              </div>

              <FeatureCard
                title="AI Insights"
                desc="Understand your data instantly."
                videoSrc="/video/demo1.mp4"
                onTry={() => handleTry("insights")}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-2xl font-semibold">
              Running Demo: {activeDemo}
            </h3>

            <DemoSession onExit={() => setActiveDemo(null)} />
          </div>
        )}
      </div>
    </section>
  );
};

export default NewPage;
