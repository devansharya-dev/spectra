import React, { useState } from "react";
import FeatureCard from "./FeatureCard";
import DemoSession from "./DemoSession";

const NewPage = ({ activeDemo, setActiveDemo }) => {
  const handleTry = (feature) => {
    setActiveDemo(feature);
    setTimeout(() => {
      if (window.locomotiveScroll) {
        window.locomotiveScroll.scrollTo('#newpage', {
          offset: 0,
          duration: 100, // Fast scroll
          disableLerp: true 
        });
      } else {
        const element = document.getElementById("newpage");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 100);
  };

  return (
    <section
      id="newpage"
      data-scroll-section
      /* Deep charcoal to black gradient for depth */
      className="w-full min-h-screen bg-[#080808] text-white py-24 md:py-40 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {!activeDemo ? (
          <div className="flex flex-col">
            {/* Header: Ultra-Wide Branding */}
            <div className="mb-32">
              <div className="flex items-center gap-6 mb-10 opacity-40">
                <div className="w-16 h-[1px] bg-white"></div>
                <span className="uppercase tracking-[0.6em] text-[9px] font-black">Interactive Intelligence</span>
              </div>
              
              <h2 className="text-[14vw] md:text-[10vw] font-['BebasNeue'] tracking-tighter leading-[0.75] uppercase italic">
                Experience <br />
                <span className="text-zinc-800 not-italic">The Future</span>
              </h2>
              
              <div className="mt-12 flex flex-col md:flex-row md:items-center justify-between gap-10">
                <p className="max-w-md text-zinc-500 text-sm md:text-base leading-relaxed font-medium uppercase tracking-widest opacity-80">
                  Select a core module to initialize a real-time proactive context simulation.
                </p>
                {/* Visual Accent */}
                <div className="hidden md:block w-32 h-32 rounded-full border border-white/5 flex items-center justify-center animate-spin-slow">
                   <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_15px_cyan]"></div>
                </div>
              </div>
            </div>

            {/* Premium Grid: Spacing is everything */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 md:gap-32">
              <FeatureCard
                title="Live Demo"
                desc="Self-executing workflow logic."
                videoSrc="/video/demo3.mp4"
                onTry={() => handleTry("Live Demo")}
              />

              {/* Center Tech Card: Minimalist & Clean */}
              <div className="hidden lg:flex flex-col items-center justify-center text-center">
                <h4 className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-black mb-6">Core Engine</h4>
                <p className="text-2xl font-light italic text-zinc-400 leading-snug">
                  "Visualizing <span className="text-white">Neural Pathways</span> in real-time."
                </p>
                <div className="mt-10 flex gap-2">
                  {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-zinc-800"></div>)}
                </div>
              </div>

              <FeatureCard
                title="AI Insights"
                desc="Proactive data visualization."
                videoSrc="/video/demo1.mp4"
                onTry={() => handleTry("AI Insights")}
              />
            </div>
          </div>
        ) : (
          /* --- The "Control Center" Active UI --- */
          <div className="flex flex-col items-center gap-12 w-full animate-in fade-in zoom-in-95 duration-1000">
            
            {/* Minimalist Status Header */}
            <div className="w-full max-w-5xl flex items-center justify-between border-b border-white/5 pb-10">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_cyan] animate-pulse"></div>
                  <span className="text-[10px] uppercase tracking-[0.5em] font-black text-zinc-600">Simulation Active</span>
                </div>
                <h3 className="text-5xl md:text-7xl font-['BebasNeue'] tracking-widest uppercase">
                  {activeDemo} <br />
                  <span className="text-zinc-800 italic text-3xl md:text-5xl normal-case">of SMART GLASSES</span>
                </h3>
              </div>

              {/* Terminate Button: Apple Style Minimalist */}
              <button 
                onClick={() => setActiveDemo(null)}
                className="group relative h-16 w-16 md:h-20 md:w-20 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 hover:border-red-500/50 hover:bg-red-500"
              >
                <span className="text-lg md:text-xl group-hover:scale-125 transition-transform duration-500">✕</span>
                {/* Tooltip */}
                <span className="absolute -bottom-10 opacity-0 group-hover:opacity-100 text-[8px] uppercase tracking-[0.4em] text-red-500 transition-opacity font-black">Exit</span>
              </button>
            </div>

            {/* Simulation Canvas: Clean Borders, No Clutter */}
            <div className="w-full max-w-6xl bg-[#0c0c0c] rounded-[2rem] md:rounded-[4rem] border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden relative flex flex-col">
               {/* Decorative corner accents */}
               <div className="absolute top-10 left-10 w-4 h-4 border-t border-l border-white/20 z-20 pointer-events-none"></div>
               <div className="absolute bottom-10 right-10 w-4 h-4 border-b border-r border-white/20 z-20 pointer-events-none"></div>
               
               {/* Logic remains safe here */}
               <DemoSession mode={activeDemo} onExit={() => setActiveDemo(null)} />
            </div>

            <div className="opacity-20 flex gap-12 items-center">
              <span className="text-[9px] uppercase tracking-[0.8em] font-bold italic">Augen Glasses Simulation</span>
              <div className="w-20 h-[1px] bg-white"></div>
              <span className="text-[9px] uppercase tracking-[0.8em] font-bold italic">By THE NPC'S</span>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}} />
    </section>
  );
};

export default NewPage;