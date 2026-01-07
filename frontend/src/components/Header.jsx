import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Home', href: '#' },
  { name: 'Features', href: '#features' },
  { name: 'New Page', href: '#newpage' },
  { name: 'About', href: '#about' },
];

export function Header() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  const scrollToSection = (id) => {
    // Use Locomotive Scroll if available, fallback to native scrolling
    const scroll = window.locomotiveScroll;
    if (scroll) {
      scroll.scrollTo(id, {
        offset: -100,
        duration: 800,
      });
    } else {
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Simple fake loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className=' bg-zinc-900  font-normal flex  items-center justify-center '>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-2xl border-b border-white/10 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
         

          {/* Logo/Brand */}
          <div className="flex items-center">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            >
              Spectra
            </motion.h1>
          </div>

          {/* Desktop Navigation - centered */}
          <nav className="hidden lg:flex items-center space-x-10 flex-1 justify-center">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                onHoverStart={() => setHovered(item.name)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ y: -2 }}
                className="relative flex items-center px-5 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white transition-all duration-300 hover:bg-white/10 backdrop-blur-sm cursor-pointer"
              >
                <span>{item.name}</span>

                {/* Animated background glow */}
                {hovered === item.name && (
                  <motion.div
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.a>
            ))}
          </nav>

        

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white text-2xl focus:outline-none p-3 rounded-lg hover:bg-white/10 transition-colors backdrop-blur-sm"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-black/90 backdrop-blur-xl border-t border-white/10"
            >
              <div className="px-6 py-4 space-y-3">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  >
                    <span className="font-medium">{item.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer */}
      <div className="h-20" />
    </div>
  );
}