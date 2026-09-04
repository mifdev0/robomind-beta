import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GameAppPage = () => {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-[#050a16] flex items-center justify-center text-cyan-400 font-bold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Memuat Sesi Bermain...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Build target URL with parent session info natively inside beta
  const accessToken = session?.access_token || '';
  const refreshToken = session?.refresh_token || '';
  const gameAppUrl = `/app-home.html?access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}&user_id=${user.id}&email=${encodeURIComponent(user.email)}`;

  return (
    <div className="w-screen h-screen h-[100dvh] bg-[#050a16] overflow-hidden m-0 p-0 fixed inset-0 z-50">
      <iframe
        src={gameAppUrl}
        title="RoboMind Game App"
        className="w-full h-full border-0 bg-[#050a16]"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; camera; microphone"
      />
    </div>
  );
};

export default GameAppPage;
