import { useState, useEffect } from 'react';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Features', href: '#features' },
  { name: 'Demo', href: '#newpage' },
  { name: 'About', href: '#about' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Functionality (vahi hai jo aapne di thi)
  const scrollToSection = (id) => {
    const scroll = window.locomotiveScroll;
    if (scroll) {
      scroll.scrollTo(id, { offset: -100, duration: 800 });
    } else {
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  useEffect(() => {
    // Optimized scroll listener using passive: true
    const handleScroll = () => {
      const scrollPos = window.scrollY > 40;
      if (scrollPos !== isScrolled) {
        setIsScrolled(scrollPos);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-4 md:p-6 pointer-events-none">
      <header
        className={`
          pointer-events-auto flex items-center justify-between
          transition-all duration-300 ease-out
          bg-zinc-950 shadow-2xl border border-white/5
          /* SHRINK LOGIC - Simple CSS for max speed */
          ${isScrolled 
            ? "w-full md:w-[65%] py-2 px-8 rounded-full shadow-cyan-500/5" 
            : "w-full md:w-[95%] py-4 px-10 rounded-2xl md:rounded-full"}
        `}
      >
        {/* Logo */}
        <div 
          className="text-xl font-bold tracking-tighter text-white cursor-pointer select-none"
          onClick={() => scrollToSection('#home')}
        >
          AUGEN
        </div>

        {/* Desktop Nav - Clean & Fast */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 hover:text-white transition-colors"
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden lg:block">
          <button 
            onClick={() => scrollToSection('#newpage')}
            className={`bg-white text-black font-black uppercase tracking-widest transition-all duration-300 rounded-full hover:bg-cyan-400
              ${isScrolled ? 'px-5 py-1.5 text-[9px]' : 'px-7 py-2.5 text-[10px]'}
            `}
          >
            Explore
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-white p-2"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Mobile Menu - Non-animated for speed */}
        {isMobileMenuOpen && (
          <div className="absolute top-[120%] left-0 right-0 bg-zinc-950 border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4 shadow-3xl lg:hidden">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  scrollToSection(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className="text-2xl font-bold tracking-tighter text-zinc-400 text-left px-4"
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}