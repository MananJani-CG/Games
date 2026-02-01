import React, { useState, useEffect } from 'react';

const colorGenerate = () => {
    const a = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const c = Math.floor(Math.random() * 256);
    return `rgb(${a}, ${b}, ${c})`;
};

const generateColor = (num) => {
    const arr = [];
    for (let i = 0; i < num; i++) {
        arr.push(colorGenerate());
    }
    return arr;
};

const pickGenerater = (colors) => {
    const math = Math.floor(Math.random() * colors.length);
    return colors[math];
};

function App() {
    const [numColors, setNumColors] = useState(6);
    const [colors, setColors] = useState([]);
    const [correctColor, setCorrectColor] = useState('');
    const [message, setMessage] = useState('Pick a color!');
    const [messageColor, setMessageColor] = useState('white');
    const [currentStreak, setCurrentStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [boxesState, setBoxesState] = useState([]);
    const [showVideo, setShowVideo] = useState(false);
    const [isPointerEventsNone, setIsPointerEventsNone] = useState(false);

    useEffect(() => {
        const savedBest = localStorage.getItem('highBestStreak');
        if (savedBest !== null) {
            setBestStreak(parseInt(savedBest));
        }
    }, []);

    useEffect(() => {
        setGame();
    }, [numColors]);

    const setGame = () => {
        const newColors = generateColor(numColors);
        const newCorrect = pickGenerater(newColors);
        setColors(newColors);
        setCorrectColor(newCorrect);
        
        setBoxesState(newColors.map(color => ({
            color: color,
            shake: false,
            opacity: 1,
            outline: 'none'
        })));
        setIsPointerEventsNone(false);
    };

    const handleBoxClick = (index) => {
        if (isPointerEventsNone) return;

        const clickedBox = boxesState[index];
        const rgb = clickedBox.color;

        if (correctColor === rgb) {
            // Win
            let newStreak = currentStreak + 1;
            setCurrentStreak(newStreak);
            localStorage.setItem('currentstreak', newStreak);
            
            setMessageColor('green');
            if (newStreak === 1) {
                setMessage("First Win!");
            } else if (newStreak >= 3) {
                setMessage("Streak!");
            } else {
                setMessage("Correct! You are win 🎉🎉");
            }

            setShowVideo(true);

            if (newStreak > bestStreak) {
                setBestStreak(newStreak);
                localStorage.setItem('highBestStreak', newStreak);
                setMessage("Exxelent! You have new best stereak 🎉🎉");
            }

            setBoxesState(boxesState.map((box, i) => ({
                color: correctColor,
                shake: false,
                opacity: 1,
                outline: i === index ? '4px solid yellow' : 'none'
            })));

            setIsPointerEventsNone(true);
            
            // Auto start new round after delay
            setTimeout(() => {
                newround();
            }, 1500);

        } else {
            // Lose
            setMessage("You are Lose 😔");
            setMessageColor("red");
            setCurrentStreak(0);
            
            const newBoxesState = [...boxesState];
            newBoxesState[index] = {
                ...newBoxesState[index],
                shake: true
            };
            setBoxesState(newBoxesState);
            
            setTimeout(() => {
                setBoxesState(current => {
                    const latest = [...current];
                    latest[index] = { ...latest[index], shake: false };
                    return latest;
                });
            }, 400);
        }
    };

    const resetGame = () => {
        localStorage.clear();
        setCurrentStreak(0);
        setBestStreak(0);
        setGame();
        setMessage("Your Game is Reset🔃");
        setMessageColor("#6F42C1");
        setShowVideo(false);
    };

    const newround = () => {
        setMessage("New Round Is Start! Pick a color!");
        setMessageColor("#007BFF");
        setShowVideo(false);
        setGame();
    };

    const easymode = () => {
        setNumColors(3);
        setMessage("Easy mode");
        setMessageColor("#28A745");
        setShowVideo(false);
    };

    const hardmode = () => {
        setNumColors(6);
        setMessage("Hard mode");
        setMessageColor("red");
        setShowVideo(false);
    };

    return (
        <>
            {showVideo && (
                <video 
                    src="https://assets.mixkit.co/videos/4151/4151-720.mp4" 
                    id="video" 
                    autoPlay 
                    loop 
                    muted 
                    className="w-full h-full object-cover -z-10 absolute top-0 left-0"
                ></video>
            )}

            <div className="w-full max-w-[700px] text-center p-5 z-10 relative">
                <header className="mb-[15px]">
                    <h1 className="text-[2em] font-bold uppercase tracking-[2px]">The Great</h1>
                    <h1 
                        className="bg-white text-[#232526] px-[30px] py-[10px] rounded-[10px] my-[10px] text-[1.5em] tracking-[3px] shadow-[0_5px_20px_rgba(255,255,255,0.2)] font-bold uppercase"
                    >
                        {correctColor || 'RGB Color Guessing Game'}
                    </h1>
                    <h1 className="text-[2em] font-bold uppercase tracking-[2px]">Guessing Game</h1>
                </header>

                <div 
                    className="text-[1.5em] font-bold mb-[15px] h-[40px] flex items-center justify-center transition-all duration-300 drop-shadow-md"
                    style={{ color: messageColor }}
                >
                    {message}
                </div>

                <div className="flex gap-[20px] justify-center mb-[15px] flex-col md:flex-row">
                    <div className="bg-white/10 rounded-[15px] py-[15px] px-[27px] backdrop-blur-[10px] border-2 border-white/20">
                        <h3 className="text-[1.2em] mb-[10px] opacity-80 font-medium">Current Streak</h3>
                        <div className="text-[2.4em] font-bold text-[#4ECDC4] drop-shadow-[0_0_20px_rgba(78,205,196,0.5)]">
                            {currentStreak}
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-[15px] py-[15px] px-[27px] backdrop-blur-[10px] border-2 border-white/20">
                        <h3 className="text-[1.2em] mb-[10px] opacity-80 font-medium">Best Streak</h3>
                        <div className="text-[2.4em] font-bold text-[#4ECDC4] drop-shadow-[0_0_20px_rgba(78,205,196,0.5)]">
                            {bestStreak}
                        </div>
                    </div>
                </div>

                <div className="flex gap-[15px] justify-center mb-[20px] flex-wrap md:flex-row flex-col">
                    <button onClick={newround} className="bg-[#4ECDC4] text-white hover:bg-[#45b8b0] hover:-translate-y-[2px] shadow-[0_5px_15px_rgba(78,205,196,0.4)] px-[30px] py-[12px] text-[1.1em] font-bold border-none rounded-[8px] cursor-pointer transition-all duration-300 uppercase tracking-[1px] w-full md:w-auto">
                        New Round
                    </button>
                    <button onClick={easymode} className={`px-[30px] py-[12px] text-[1.1em] font-bold border-2 rounded-[8px] cursor-pointer transition-all duration-300 uppercase tracking-[1px] w-full md:w-auto ${numColors === 3 ? 'bg-[green] text-white border-white/30' : 'bg-white/10 text-white border-white/30 hover:bg-white/20'}`}>
                        Easy
                    </button>
                    <button onClick={hardmode} className={`px-[30px] py-[12px] text-[1.1em] font-bold border-2 rounded-[8px] cursor-pointer transition-all duration-300 uppercase tracking-[1px] w-full md:w-auto ${numColors === 6 ? 'bg-white text-[#232526] border-white' : 'bg-white/10 text-white border-white/30 hover:bg-white/20'}`}>
                        Hard
                    </button>
                    <button onClick={resetGame} className="bg-[#4ECDC4] text-white hover:bg-[#45b8b0] hover:-translate-y-[2px] shadow-[0_5px_15px_rgba(78,205,196,0.4)] px-[30px] py-[12px] text-[1.1em] font-bold border-none rounded-[8px] cursor-pointer transition-all duration-300 uppercase tracking-[1px] w-full md:w-auto">
                        Reset Streak
                    </button>
                </div>

                <div 
                    className={`grid gap-[15px] md:gap-[20px] mt-[20px] ${numColors === 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3'}`}
                    style={{ pointerEvents: isPointerEventsNone ? 'none' : 'auto' }}
                >
                    {boxesState.map((box, index) => (
                        <div
                            key={index}
                            onClick={() => handleBoxClick(index)}
                            className={`aspect-square rounded-[15px] transition-all duration-300 border-[5px] border-transparent shadow-[0_5px_20px_rgba(0,0,0,0.3)] flex justify-center items-center cursor-pointer hover:scale-105 hover:border-white/50 ${box.shake ? 'shake' : ''}`}
                            style={{
                                backgroundColor: box.color,
                                border: box.outline !== 'none' ? box.outline : undefined
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default App;
