import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhyRoboMind from '../components/WhyRoboMind';
import GameSlider from '../components/GameSlider';
import ModuleSection from '../components/ModuleSection';
import ScreeningPillars from '../components/ScreeningPillars';
import Pricing from '../components/Pricing';
import NewsSection from '../components/NewsSection';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/ChatbotWidget';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollProgressBar, ScrollToTopButton, ScrollReveal } from '../components/ScrollEffects';

const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen font-outfit text-gray-800 bg-white overflow-x-hidden">
      <Navbar />
      <ScrollProgressBar />
      <main>
        <Hero />
        
        <WhyRoboMind />
        
        <ScrollReveal animation="scale-up" duration={0.9} threshold={0.15}>
          <GameSlider />
        </ScrollReveal>
        
        <ModuleSection />
        
        <ScreeningPillars />
        
        <Pricing />
        
        <NewsSection />
      </main>
      <Footer />
      <ScrollToTopButton />
      <ChatbotWidget />
    </div>
  );
};

export default LandingPage;
