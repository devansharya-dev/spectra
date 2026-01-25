import { useEffect, useRef, useState } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import About from './components/About';
import Features from './components/FeaturesSection';
import Footer from './components/Footer';
import { Header } from './components/Header';
import Hero from './components/Hero';
import NewPage from './components/NewPage';

function App() {
  const scrollRef = useRef(null);
  const [activeDemo, setActiveDemo] = useState(null);

  useEffect(() => {
    let scroll;
    const scrollElement = scrollRef.current;

    const initScroll = () => {
      scroll = new LocomotiveScroll({
        el: scrollElement,
        smooth: true,
        lerp: 0.08,
        direction: 'vertical',
        smartphone: {
          smooth: true,
          lerp: 0.1, // Slower lerp for mobile
        },
        tablet: {
          smooth: true,
          lerp: 0.1, // Slower lerp for tablet
        },
      });

      window.locomotiveScroll = scroll;
    };

    // Initialize after all content is loaded
    window.addEventListener('load', initScroll);

    // Update scroll on resize using ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (scroll) {
        scroll.update();
      }
    });

    if (scrollElement) {
      resizeObserver.observe(scrollElement);
    }

    return () => {
      window.removeEventListener('load', initScroll);
      if (scroll) {
        scroll.destroy();
      }
      if (scrollElement) {
        resizeObserver.unobserve(scrollElement);
      }
      if (window.locomotiveScroll) {
        delete window.locomotiveScroll;
      }
    };
  }, []);

  return (
    <div ref={scrollRef} data-scroll-container className="bg-zinc-900 text-gray-100">
      <div><Header setActiveDemo={setActiveDemo} /></div>
      <Hero setActiveDemo={setActiveDemo} />
      <Features />
      <NewPage activeDemo={activeDemo} setActiveDemo={setActiveDemo} />
      <About />
      <Footer />
    </div>
  );
}
export default App;