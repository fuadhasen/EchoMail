const LoadingScreen = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#f8f9ff]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0b1c30] border-t transparent"></div>

      <p className="mt-4 text-sm text-gray-500">Loading Echomail...</p>
    </div>
  );
};

export default LoadingScreen;
