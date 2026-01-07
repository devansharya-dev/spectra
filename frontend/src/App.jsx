import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import About from './components/About';
import Features from './components/FeaturesSection';
import Footer from './components/Footer';
import { Header } from './components/Header';
import Hero from './components/Hero';
import NewPage from './components/NewPage';
function App() {
  const scrollRef = useRef(null);

  useEffect(() => {
    let scroll;

    // Small delay to ensure DOM is ready
    const initScroll = () => {
      scroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        lerp: 0.08,
        direction: 'vertical',
        smartphone: {
          smooth: true,
          lerp: 0.08
        },
        tablet: {
          smooth: true,
          lerp: 0.08
        }
      });

      // Make scroll instance globally available
      window.locomotiveScroll = scroll;
    };

    // Initialize after a short delay
    setTimeout(initScroll, 100);

    // Update scroll on window resize
    const handleResize = () => {
      if (scroll) {
        scroll.update();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (scroll) {
        scroll.destroy();
      }
      window.removeEventListener('resize', handleResize);
      if (window.locomotiveScroll) {
        delete window.locomotiveScroll;
      }
    };
  }, []);

  return (
    <div ref={scrollRef} data-scroll-container className="bg-zinc-900 text-gray-100">
      <Header />
      <Hero />
      <Features />
      <NewPage />
      <About />
      <Footer />
    </div>
  );
}
export default App;