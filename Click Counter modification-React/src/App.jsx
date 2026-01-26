import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const GAME_DURATION = 10;

function App() {
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Click "Start Game" to begin!');
  const [showVideo, setShowVideo] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [clickScale, setClickScale] = useState(1);
  const [buttonText, setButtonText] = useState("Click Me!");
  const [bgStyle, setBgStyle] = useState('bg-gradient-to-br from-[#667eea] to-[#764ba2]');
  
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const scoreRef = useRef(currentScore);

  useEffect(() => {
    scoreRef.current = currentScore;
  }, [currentScore]);

  useEffect(() => {
    const saved = localStorage.getItem('clickGameModHighScore');
    if (saved) setHighScore(parseInt(saved));
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const startGame = () => {
    clearInterval(timerRef.current);
    setCurrentScore(0);
    setTimeRemaining(GAME_DURATION);
    setIsGameActive(true);
    setIsPaused(false);
    setHasPlayed(true);
    setClickScale(1);
    setStatusMessage('Game in progress... Click fast!');
    setShowVideo(false);
    setButtonText("Click Me!");
    
    setBgStyle('bg-gradient-to-br from-[#667eea] to-[#764ba2]');

    if (videoRef.current) {
      videoRef.current.style.display = 'none';
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIsGameActive(false);
    setIsPaused(false);
    setButtonText("Click Me!");

    const finalScore = scoreRef.current;
    const cps = (finalScore / GAME_DURATION).toFixed(2);
    
    if (finalScore > highScore) {
      localStorage.setItem('clickGameModHighScore', finalScore.toString());
      setHighScore(finalScore);
      setStatusMessage(`🎉 New High Score: ${finalScore} | Your CPS: ${cps} clicks/s!`);
      
      setBgStyle('bg-[#ffd700]'); // gold
      setTimeout(() => {
          setBgStyle('bg-gradient-to-br from-[#667eea] to-[#764ba2]');
      }, 1000);

      setShowVideo(true);
      if (videoRef.current) {
        videoRef.current.style.display = 'block';
        videoRef.current.play();
        setTimeout(() => {
          setShowVideo(false);
          if (videoRef.current) {
              videoRef.current.style.display = 'none';
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
          }
        }, 5000);
      }
    } else {
      setStatusMessage(`Game Over! Your score: ${finalScore} | Your CPS: ${cps} clicks/s.`);
    }
  };

  const pauseGame = () => {
    if (!isGameActive || isPaused) return;
    clearInterval(timerRef.current);
    setIsPaused(true);
    setStatusMessage('⏸ Game Paused');
  };

  const resumeGame = () => {
    if (!isGameActive || !isPaused) return;
    setIsPaused(false);
    setStatusMessage('▶ Game Resumed! Click fast!');
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClick = (e) => {
    if (!isGameActive || isPaused) return;
    if (e.button === 0 || e.button === 2) {
      setCurrentScore((prev) => {
        const next = prev + 1;
        setClickScale((oldScale) => Math.min(oldScale + 0.1, 2.0));
        return next;
      });
    }
  };

  const resetHighScore = () => {
    if (window.confirm('Are you sure you want to reset your high score?')) {
      localStorage.removeItem('clickGameModHighScore');
      setHighScore(0);
      setStatusMessage('High score has been reset!');
    }
  };

  return (
    <div className={`font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif] min-h-screen flex justify-center items-center p-5 relative transition-colors duration-500 ${bgStyle}`}>
      <div className="bg-white rounded-[20px] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-[600px] w-full text-center z-10 transition-transform">
          <h1 className="text-[#667eea] text-[2.5em] font-bold mb-[10px] leading-tight">Click Counter Game</h1>
          <p className="text-[#666] text-[1.1em] mb-[30px]">Click as fast as you can!</p>

          <div className="flex gap-5 mb-[30px]">
              <div className="flex-1 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-[15px] p-5 text-white">
                  <h2 className="text-[1em] mb-[10px] font-bold opacity-90">Current Score</h2>
                  <div 
                    className="text-[3em] font-bold drop-shadow-[2px_2px_4px_rgba(0,0,0,0.2)]"
                    style={{ color: currentScore > 20 ? 'red' : 'white' }}
                  >
                      {currentScore}
                  </div>
              </div>
              <div className="flex-1 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-[15px] p-5 text-white">
                  <h2 className="text-[1em] mb-[10px] font-bold opacity-90">High Score</h2>
                  <div className="text-[3em] font-bold drop-shadow-[2px_2px_4px_rgba(0,0,0,0.2)]">{highScore}</div>
              </div>
          </div>

          <div className="bg-[#f8f9fa] rounded-[15px] p-5 mb-[30px]">
              <h2 className="text-[#333] text-[1.1em] mb-[10px] font-bold">Time Remaining</h2>
              <div className="text-[3.5em] font-bold text-[#667eea] font-mono leading-none">{timeRemaining}</div>
          </div>

          <div className="flex flex-col gap-[15px] mb-[20px]">
              <button 
                  className={`w-full rounded-[15px] p-[30px] text-[1.8em] font-bold transition-all duration-300
                             ${(!isGameActive || isPaused) 
                                ? 'bg-[#ccc] cursor-not-allowed shadow-none text-white opacity-80' 
                                : 'bg-gradient-to-br from-[#f093fb] to-[#f5576c] text-white cursor-pointer shadow-[0_5px_15px_rgba(245,87,108,0.4)] hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(245,87,108,0.6)] active:translate-y-0 active:shadow-[0_3px_10px_rgba(245,87,108,0.4)]'}`}
                  style={{ transform: (!isGameActive || isPaused) ? 'none' : `scale(${clickScale})` }}
                  disabled={!isGameActive || isPaused} 
                  onMouseDown={handleClick}
              >
                  {buttonText}
              </button>
              
              <button 
                  className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-[10px] py-[15px] px-[30px] text-[1.2em] font-bold cursor-pointer transition-all shadow-[0_4px_10px_rgba(102,126,234,0.4)] hover:-translate-y-[2px] hover:shadow-[0_6px_15px_rgba(102,126,234,0.6)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed" 
                  onClick={startGame} 
                  disabled={isGameActive && !isPaused}>
                  {hasPlayed && !isGameActive ? "Play Again" : "Start Game"}
              </button>
              
              <div className="flex gap-[15px]">
                  <button 
                      className="flex-1 flex justify-center items-center h-[40px] bg-[#ff9900] hover:bg-gradient-to-br hover:from-[#bd3200] hover:via-[#ff9900] hover:to-[#bd3200] text-white rounded-[10px] py-[15px] px-[30px] text-[1.2em] font-bold cursor-pointer transition-all shadow-[0_4px_10px_rgba(255,0,0,0.277)] hover:-translate-y-[2px]" 
                      onClick={pauseGame}>
                      Pause Game
                  </button>
                  <button 
                      className="flex-1 flex justify-center items-center h-[40px] bg-[#ff9900] hover:bg-gradient-to-br hover:from-[#bd3200] hover:via-[#ff9900] hover:to-[#bd3200] text-white rounded-[10px] py-[15px] px-[30px] text-[1.2em] font-bold cursor-pointer transition-all shadow-[0_4px_10px_rgba(255,0,0,0.277)] hover:-translate-y-[2px]" 
                      onClick={resumeGame}>
                      Resume Game
                  </button>
              </div>
              
              <button 
                  className="bg-[#ff6b6b] hover:bg-[#ee5a5a] text-white rounded-[10px] py-[12px] px-[25px] text-[1em] font-bold cursor-pointer transition-all h-[40px] hover:-translate-y-[2px]" 
                  onClick={resetHighScore}>
                  Reset High Score
              </button>
          </div>

          <div className="text-[1.2em] font-bold p-[15px] rounded-[10px] bg-[#f8f9fa] text-[#333]">
              {statusMessage}
          </div>
      </div>

      <video 
        ref={videoRef}
        src="/854341-hd_1280_720_25fps.mp4" 
        autoPlay
        muted 
        loop 
        className="absolute object-cover left-0 top-0 w-full h-full -z-10"
        style={{ display: showVideo ? 'block' : 'none' }}
      />
    </div>
  );
}

export default App;
