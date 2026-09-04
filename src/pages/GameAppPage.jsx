const GameAppPage = () => {
  return (
    <div className="w-screen h-screen h-[100dvh] bg-[#050a16] overflow-hidden m-0 p-0 fixed inset-0 z-50">
      <iframe
        src="https://robomind-coba.vercel.app"
        title="RoboMind Game App"
        className="w-full h-full border-0 bg-[#050a16]"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; camera; microphone"
      />
    </div>
  );
};

export default GameAppPage;
