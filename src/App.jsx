import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ChatbotPage from './pages/ChatbotPage';
import ScreeningPage from './pages/ScreeningPage';
import FeaturesPage from './pages/FeaturesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CommunityPage from './pages/CommunityPage';
import TreatmentPage from './pages/TreatmentPage';
import ResearchPage from './pages/ResearchPage';
import InsightPage from './pages/InsightPage';
import DashboardPage from './pages/DashboardPage';
import GameAppPage from './pages/GameAppPage';
import DownloadPage from './pages/DownloadPage';
import RobotCursor from './components/RobotCursor';

function App() {
  return (
    <Router>
      <RobotCursor />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/play" element={<GameAppPage />} />
        <Route path="/game-dashboard" element={<GameAppPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/screening" element={<ScreeningPage />} />
        <Route path="/games" element={<FeaturesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/treatment" element={<TreatmentPage />} />
        <Route path="/the-research" element={<ResearchPage />} />
        <Route path="/insight" element={<InsightPage />} />
      </Routes>
    </Router>
  );
}

export default App;
