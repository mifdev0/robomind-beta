import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/ChatbotWidget';
import { ScrollProgressBar, ScrollToTopButton } from '../components/ScrollEffects';

const GameAppPage = () => {
  return (
    <div className="min-h-screen font-outfit text-gray-800 bg-slate-950 overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <ScrollProgressBar />
      
      <main className="flex-grow flex flex-col w-full h-[calc(100vh-80px)] min-h-[680px]">
        <iframe
          src="https://robomind-coba.vercel.app"
          title="RoboMind Game App"
          className="w-full h-full border-0 flex-grow bg-[#050a16]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; camera; microphone"
        />
      </main>

      <Footer />
      <ScrollToTopButton />
      <ChatbotWidget />
    </div>
  );
};

export default GameAppPage;
