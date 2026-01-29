import React, { useState, useEffect } from 'react';

const changeColor = () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgb(${red}, ${green}, ${blue})`;
};

const generateColors = (num) => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(changeColor());
  }
  return arr;
};

const pickGenerator = (colors) => {
  const idx = Math.floor(Math.random() * colors.length);
  return colors[idx];
};

function App() {
  const [numColors, setNumColors] = useState(6);
  const [colors, setColors] = useState([]);
  const [correctColor, setCorrectColor] = useState('');
  const [message, setMessage] = useState('Pick a color !');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [boxesState, setBoxesState] = useState([]);
  
  useEffect(() => {
    const savedBest = localStorage.getItem('bestStreak');
    if (savedBest) {
      setBestStreak(parseInt(savedBest));
    }
  }, []);

  useEffect(() => {
    setGame();
  }, [numColors]);

  const setGame = () => {
    const newColors = generateColors(numColors);
    const newCorrect = pickGenerator(newColors);
    setColors(newColors);
    setCorrectColor(newCorrect);
    setMessage('Pick a color !');
    
    setBoxesState(newColors.map(color => ({
      color: color,
      opacity: 1,
      disabled: false,
      visible: true
    })));
  };

  const handleBoxClick = (index) => {
    const clickedBox = boxesState[index];
    if (clickedBox.disabled || !clickedBox.visible) return;

    if (clickedBox.color === correctColor) {
      // Win
      setMessage('You Win Bro!');
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      
      let newBest = bestStreak;
      if (newStreak > bestStreak) {
        newBest = newStreak;
        setBestStreak(newBest);
        localStorage.setItem('bestStreak', newBest);
      }

      setBoxesState(boxesState.map(() => ({
        color: correctColor,
        opacity: 1,
        disabled: false,
        visible: true
      })));

      setTimeout(() => {
        setGame();
      }, 500);
      
    } else {
      // Lose
      setMessage('Try Again Bruh');
      setCurrentStreak(0);
      const newBoxesState = [...boxesState];
      newBoxesState[index] = {
        ...newBoxesState[index],
        opacity: 0.3,
        disabled: true
      };
      setBoxesState(newBoxesState);
    }
  };

  const resetStreak = () => {
    setCurrentStreak(0);
    setBestStreak(0);
    localStorage.removeItem('bestStreak');
    setMessage('Streaks reset!');
    setGame();
  };

  return (
    <div className="w-full max-w-[800px] text-center p-5">
      <header className="mb-[30px]">
        <h1 className="text-[1.8em] md:text-[2.5em] font-bold uppercase tracking-[2px] mb-4">The Great</h1>
        <h1 className="bg-white text-[#232526] px-[20px] md:px-[30px] py-[10px] md:py-[15px] rounded-[10px] my-[15px] text-[1.5em] md:text-[2em] tracking-[3px] shadow-[0_5px_20px_rgba(255,255,255,0.2)] font-bold uppercase">
          {correctColor || 'RGB Color Guessing Game'}
        </h1>
        <h1 className="text-[1.8em] md:text-[2.5em] font-bold uppercase tracking-[2px]">Guessing Game</h1>
      </header>

      <div className="text-[1.4em] md:text-[1.8em] font-bold mb-[25px] h-[50px] flex items-center justify-center transition-all duration-300">
        {message}
      </div>

      <div className="flex gap-[15px] md:gap-[20px] justify-center mb-[30px] flex-col md:flex-row">
        <div className="bg-white/10 rounded-[15px] py-[15px] md:py-[20px] px-[30px] md:px-[40px] backdrop-blur-[10px] border-2 border-white/20">
          <h3 className="text-[1em] mb-[10px] opacity-80 font-medium">Current Streak</h3>
          <div className="text-[2.5em] md:text-[3em] font-bold text-[#4ECDC4] drop-shadow-[0_0_20px_rgba(78,205,196,0.5)]">
            {currentStreak}
          </div>
        </div>
        <div className="bg-white/10 rounded-[15px] py-[15px] md:py-[20px] px-[30px] md:px-[40px] backdrop-blur-[10px] border-2 border-white/20">
          <h3 className="text-[1em] mb-[10px] opacity-80 font-medium">Best Streak</h3>
          <div className="text-[2.5em] md:text-[3em] font-bold text-[#4ECDC4] drop-shadow-[0_0_20px_rgba(78,205,196,0.5)]">
            {bestStreak}
          </div>
        </div>
      </div>

      <div className="flex gap-[15px] justify-center mb-[30px] flex-col md:flex-row flex-wrap">
        <button onClick={setGame} className="bg-[#4ECDC4] text-white hover:bg-[#45b8b0] hover:-translate-y-[2px] shadow-[0_5px_15px_rgba(78,205,196,0.4)] px-[30px] py-[12px] text-[1.1em] font-bold border-none rounded-[8px] cursor-pointer transition-all duration-300 uppercase tracking-[1px] w-full md:w-auto">
          NEW ROUND
        </button>
        <button onClick={() => setNumColors(3)} className={`px-[30px] py-[12px] text-[1.1em] font-bold border-2 border-white/30 rounded-[8px] cursor-pointer transition-all duration-300 uppercase tracking-[1px] w-full md:w-auto ${numColors === 3 ? 'bg-white text-[#232526] border-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
          EASY
        </button>
        <button onClick={() => setNumColors(6)} className={`px-[30px] py-[12px] text-[1.1em] font-bold border-2 border-white/30 rounded-[8px] cursor-pointer transition-all duration-300 uppercase tracking-[1px] w-full md:w-auto ${numColors === 6 ? 'bg-white text-[#232526] border-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
          HARD
        </button>
        <button onClick={resetStreak} className="bg-[#4ECDC4] text-white hover:bg-[#45b8b0] hover:-translate-y-[2px] shadow-[0_5px_15px_rgba(78,205,196,0.4)] px-[30px] py-[12px] text-[1.1em] font-bold border-none rounded-[8px] cursor-pointer transition-all duration-300 uppercase tracking-[1px] w-full md:w-auto">
          RESET STREAK
        </button>
      </div>

      <div className={`grid gap-[15px] md:gap-[20px] mt-[30px] ${numColors === 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3'}`}>
        {boxesState.map((box, index) => (
          <div
            key={index}
            onClick={() => handleBoxClick(index)}
            className={`aspect-square rounded-[15px] transition-all duration-300 border-[5px] border-transparent shadow-[0_5px_20px_rgba(0,0,0,0.3)] ${box.disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105 hover:border-white/50'}`}
            style={{
              backgroundColor: box.color,
              opacity: box.opacity,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default App;
