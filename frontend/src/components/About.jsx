const About = () => {
  return (
    <section
      id="about"
      data-scroll-section
      className="w-full bg-[#D1DCD9] text-black px-6 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wide leading-tight">
          Built by engineers.
          <br />
          Designed for humans.
        </h2>

        <p className="mt-8 md:mt-10 max-w-4xl text-base md:text-lg leading-relaxed font-medium text-zinc-700">
          We are a team of developers, designers, and engineers focused on building
          technology that works in the real world.
        </p>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-2">Human-first design</h3>
            <p className="text-zinc-800 text-sm md:text-base leading-relaxed">
              Technology should adapt to people — not the other way around.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-2">Real-world intelligence</h3>
            <p className="text-zinc-800 text-sm md:text-base leading-relaxed">
              AI must understand context, not just process data.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-2">Built with intent</h3>
            <p className="text-zinc-800 text-sm md:text-base leading-relaxed">
              Every feature exists for a reason. No noise. No gimmicks.
            </p>
          </div>
        </div>

        {/* TEAM SECTION - Exact Design Match */}
        <div className="mt-24 md:mt-32 pt-16 border-t border-black/10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wide leading-tight mb-12">
            The Team
            <br />
            <span className="text-zinc-500 text-2xl md:text-3xl lg:text-4xl normal-case font-medium tracking-normal">
              Augen by The NPCs
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
             {[
              { name: "Shriyukt Gupta", role: "Lead Architect & AI/ML Specialist" },
              { name: "Devansh Arya", role: "AI/ML Specialist & Full-stack Developer" },
              { name: "Divya Adhikari", role: "Embedded Systems Specialist & Full-stack Engineer" },
              { name: "Shubhanshi Negi", role: "AI & Backend Engineer" },
            ].map((member, index) => (
              <div key={index} className="text-center md:text-left">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-2">
                  {member.name}
                </h3>
                <p className="text-zinc-800 text-sm md:text-base leading-relaxed">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;