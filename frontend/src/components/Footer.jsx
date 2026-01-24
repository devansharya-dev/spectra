const Footer = () => {
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

  return (
    <footer
      id="contact"
      data-scroll-section
      data-scroll
      className="w-full bg-zinc-950 text-white px-4 md:px-8 lg:px-12 xl:px-20 py-28"
    >
      <div className="flex flex-col md:flex-row justify-between gap-24">
        <div className="md:w-1/2">
          <h1 className="text-[6vw] leading-none uppercase font-['BebasNeue'] tracking-wider">
            Augen
          </h1>

          <p className="mt-6 max-w-md text-gray-400 text-lg">
            AI-powered smart glasses designed to enhance human perception
            through real-time vision, voice, and intelligence.
          </p>
        </div>

        <div className="md:w-1/2 flex gap-8 md:gap-12 lg:gap-16 xl:gap-24">
          <div>
            <p className="mb-6 text-gray-500 uppercase tracking-wide text-sm">
              Pages
            </p>
            <ul className="space-y-3 text-lg capitalize">
              <li
                onClick={() => scrollToSection("#home")}
                className="cursor-pointer hover:text-white/80"
              >
                Home
              </li>
              <li
                onClick={() => scrollToSection("#features")}
                className="cursor-pointer hover:text-white/80"
              >
                Features
              </li>
              <li
                onClick={() => scrollToSection("#newpage")}
                className="cursor-pointer hover:text-white/80"
              >
                Demo
              </li>
              <li
                onClick={() => scrollToSection("#about")}
                className="cursor-pointer hover:text-white/80"
              >
                About
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-24 pt-6 border-t border-white/10 flex justify-between text-sm text-gray-500">
        <p>© 2025 Augen</p>
        <p>Designed for the future.</p>
      </div>
    </footer>
  );
};

export default Footer;