import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParentDashboard from '../components/ParentDashboard';
import ChatbotWidget from '../components/ChatbotWidget';
import { ScrollProgressBar, ScrollToTopButton } from '../components/ScrollEffects';

const DashboardPage = () => {
  return (
    <div className="min-h-screen font-outfit text-gray-800 bg-white dark:bg-slate-950 overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <ScrollProgressBar />
      
      <main className="flex-grow pt-4">
        <ParentDashboard />
      </main>

      <Footer />
      <ScrollToTopButton />
      <ChatbotWidget />
    </div>
  );
};

export default DashboardPage;
