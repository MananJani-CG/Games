import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [bestScore, setBestScore] = useState(0);
  const [playGame, setPlayGame] = useState(false);
  const [paused, setPaused] = useState(false);
  
  // Each hole state: { up: boolean, bonked: boolean }
  const [holes, setHoles] = useState(Array(6).fill({ up: false, bonked: false }));

  const gameTimerRef = useRef(null);
  const popTimerRef = useRef(null);
  
  const stateRef = useRef({ playGame: false, paused: false, score: 0 });

  useEffect(() => {
    stateRef.current = { playGame, paused, score };
  }, [playGame, paused, score]);

  useEffect(() => {
    const temp = localStorage.getItem('highScoreMole');
    if (temp !== null) {
      setBestScore(parseInt(temp, 10));
    }
    
    // Cleanup on unmount
    return () => {
      clearInterval(gameTimerRef.current);
      clearTimeout(popTimerRef.current);
    };
  }, []);

  const randomTime = (min, max) => Math.floor(Math.random() * (max - min) + min);

  const popGame = () => {
    if (!stateRef.current.playGame || stateRef.current.paused) return;

    const timer = randomTime(1000, 1500);
    const holeIndex = Math.floor(Math.random() * 6);

    // Reset all holes up state, but pop the selected one
    setHoles(prev => prev.map((h, i) => i === holeIndex ? { up: true, bonked: false } : { ...h, up: false }));

    popTimerRef.current = setTimeout(() => {
      setHoles(prev => {
        const next = [...prev];
        next[holeIndex] = { ...next[holeIndex], up: false };
        return next;
      });

      if (stateRef.current.playGame && !stateRef.current.paused) {
        popGame();
      }
    }, timer);
  };

  const handleGameEnd = () => {
    setPlayGame(false);
    setPaused(false);
    setHoles(Array(6).fill({ up: false, bonked: false }));
    
    const finalScore = stateRef.current.score;
    let newBest = null;
    
    // Using setTimeout to allow state flush before alert
    setTimeout(() => {
        // Need to read bestScore from state, using a setter callback avoids closure issues
        setBestScore(prevBest => {
             if (finalScore > prevBest) {
                localStorage.setItem('highScoreMole', finalScore);
                alert(`🎉 New High Score: ${finalScore}`);
                return finalScore;
             } else {
                alert(`Your Score: ${finalScore}`);
                return prevBest;
             }
        });
        setScore(0);
    }, 100);
  };

  const startGame = () => {
    setTime(30);
    setScore(0);
    setPlayGame(true);
    setPaused(false);
    setHoles(Array(6).fill({ up: false, bonked: false }));
    
    clearInterval(gameTimerRef.current);
    clearTimeout(popTimerRef.current);

    setTimeout(() => {
       popGame();
    }, 100);

    gameTimerRef.current = setInterval(() => {
      setTime(prevTime => {
        if (!stateRef.current.paused) {
            const nextTime = Math.max(0, prevTime - 1);
            if (nextTime <= 0) {
              clearInterval(gameTimerRef.current);
              clearTimeout(popTimerRef.current);
              handleGameEnd();
              return 0;
            }
            return nextTime;
        }
        return prevTime;
      });
    }, 1000);
  };

  const pauseGame = () => {
    setPaused(true);
  };

  const resumeGame = () => {
    setPaused(false);
    setTimeout(() => popGame(), 100);
  };

  const bonk = (e, index) => {
    if (!stateRef.current.playGame || stateRef.current.paused) return;
    
    // Only register bonk if clicking exactly on the mole
    if (holes[index].up) {
      setScore(s => s + 1);
      
      setHoles(prev => {
         const next = [...prev];
         next[index] = { up: false, bonked: true };
         return next;
      });
      
      setTimeout(() => {
         setHoles(prev => {
             const next = [...prev];
             // Make sure we only remove bonked, not override up if it was triggered again immediately
             next[index] = { ...next[index], bonked: false };
             return next;
         });
      }, 300);
    }
  };

  return (
    <div className="bg-white rounded-[20px] p-[30px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-[700px] w-full mx-[20px]">
      <h1 className="text-center text-[#667eea] text-[2.5em] mb-[20px] font-bold">🔨 Whack-a-Mole 🔨</h1>
      
      <div className="flex gap-[15px] justify-center mb-[20px]">
        <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-[30px] py-[15px] rounded-[10px] text-center w-[120px]">
          <h3 className="text-[0.9em] mb-[5px] opacity-90 font-medium">Score</h3>
          <div className="text-[2em] font-bold">{score}</div>
        </div>
        <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-[30px] py-[15px] rounded-[10px] text-center w-[120px]">
          <h3 className="text-[0.9em] mb-[5px] opacity-90 font-medium">Time</h3>
          <div className="text-[2em] font-bold">{time}</div>
        </div>
        <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-[30px] py-[15px] rounded-[10px] text-center w-[120px]">
          <h3 className="text-[0.9em] mb-[5px] opacity-90 font-medium">Best</h3>
          <div className="text-[2em] font-bold">{bestScore}</div>
        </div>
      </div>
      
      <button 
        onClick={startGame}
        disabled={playGame && !paused} // Only disable if truly playing
        className="block w-full p-[15px] text-[1.5em] font-bold bg-[#4ECDC4] text-white border-none rounded-[10px] cursor-pointer mb-[20px] transition-all duration-300 hover:bg-[#45b8b0] hover:-translate-y-[2px] disabled:bg-[#ccc] disabled:cursor-not-allowed disabled:transform-none"
      >
        Start Game
      </button>

      <div className="flex justify-center gap-[10px] mb-[22px]">
        <button 
           onClick={pauseGame}
           disabled={!playGame || paused}
           className="px-[15px] py-[15px] mr-[10px] text-[1.2em] font-bold bg-[#ff6b6b] hover:bg-[#ff5252] text-white border-none rounded-[10px] cursor-pointer transition-all duration-300 disabled:bg-[#ccc] disabled:cursor-not-allowed w-[150px]"
        >
           Pause
        </button>
        <button 
           onClick={resumeGame}
           disabled={!playGame || !paused}
           className="px-[15px] py-[15px] ml-[10px] text-[1.2em] font-bold bg-[#45b8b0] hover:bg-[#35a69f] text-white border-none rounded-[10px] cursor-pointer transition-all duration-300 disabled:bg-[#ccc] disabled:cursor-not-allowed w-[150px]"
        >
           Resume
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-[20px]">
        {holes.map((holeData, index) => (
          <div key={index} className="hole">
             <div 
               className={`mole ${holeData.up ? 'up' : ''} ${holeData.bonked ? 'bonked' : ''}`}
               onClick={(e) => { bonk(e, index); }}
             ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
