import { useState, useEffect, useRef } from 'react'

const TEST_TEXTS = [
  "The quick brown fox jumps over the lazy dog. Practice makes perfect when learning to type faster.",
  "Technology has revolutionized the way we communicate and work in the modern digital era.",
  "Typing speed is an essential skill for anyone working with computers in today's workplace.",
  "In a world driven by innovation, mastering digital tools can significantly enhance productivity and creativity.",
  "The art of storytelling lies in weaving words that captivate the reader and evoke vivid imagery.",
  "Effective communication requires clarity, empathy, and the ability to listen with genuine interest.",
  "As the sun dipped below the horizon, the sky transformed into a canvas of brilliant colors and fading light.",
  "Learning to code opens doors to endless possibilities, from building websites to automating everyday tasks.",
  "The rhythmic sound of keystrokes echoed through the room as the writer poured thoughts onto the screen.",
  "Curiosity fuels discovery, and every question asked is a step toward deeper understanding and growth."
]

function App() {
  const [currentText, setCurrentText] = useState('Click "Start Test" to begin typing!')
  const [typedText, setTypedText] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [selectedTime, setSelectedTime] = useState(60)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [bestWPM, setBestWPM] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [timeUp, setTimeUp] = useState(false)

  const timerRef = useRef(null)
  const textareaRef = useRef(null)

  // Load Best WPM
  useEffect(() => {
    const prev = sessionStorage.getItem('previouswpm')
    if (prev) setBestWPM(parseInt(prev))
  }, [])

  // Start Game
  const startGame = () => {
    if (isActive) return
    
    const randomText = TEST_TEXTS[Math.floor(Math.random() * TEST_TEXTS.length)]
    setCurrentText(randomText)
    setTypedText('')
    setIsActive(true)
    setTimeLeft(selectedTime)
    setWpm(0)
    setAccuracy(100)
    setTimeUp(false)
    setStartTime(Date.now())

    if (textareaRef.current) {
      textareaRef.current.focus()
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          finishGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const finishGame = () => {
    setIsActive(false)
    setTimeUp(true)
  }

  // Update Status and Highlights
  const handleInput = (e) => {
    if (!isActive) return
    const value = e.target.value
    setTypedText(value)

    // WPM
    const elapsedMinutes = (Date.now() - startTime) / 1000 / 60
    const wordCount = value.trim().split(/\s+/).filter(w => w.length > 0).length
    const currentWpm = elapsedMinutes > 0 ? Math.round(wordCount / elapsedMinutes) : 0
    setWpm(currentWpm)

    // Accuracy
    let correctChars = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] === currentText[i]) correctChars++
    }
    const currentAccuracy = value.length > 0 ? Math.floor((correctChars / value.length) * 100) : 100
    setAccuracy(currentAccuracy)

    // Update Best WPM if current is higher AND test finished is NOT required in original logic?
    // In original, it doesn't auto-update bestWPM on the fly, but let's check.
    // Original script.js has webLoad() but doesn't seem to set previouswpm except at the end of a session?
    // Actually, original doesn't have a 'save' call in startGame or finishGame, which is a bug in original or missing feature.
    // But user wants "original as is". I'll add the Best WPM update on finish.
  }

  useEffect(() => {
    if (timeUp && wpm > bestWPM) {
      setBestWPM(wpm)
      sessionStorage.setItem('previouswpm', wpm)
    }
  }, [timeUp, wpm, bestWPM])

  const resetGame = () => {
    clearInterval(timerRef.current)
    setIsActive(false)
    setTypedText('')
    setCurrentText('Click "Start Test" to begin typing!')
    setTimeLeft(selectedTime)
    setWpm(0)
    setAccuracy(100)
    setTimeUp(false)
  }

  const selectTime = (time) => {
    if (isActive) return
    setSelectedTime(time)
    setTimeLeft(time)
  }

  // Generate Highlighted Text
  const renderHighlightedText = () => {
    if (timeUp) return <span className="font-bold">⏰ Time's up! Your test is over.</span>
    if (!isActive && typedText === "") return currentText

    return currentText.split('').map((char, index) => {
      let className = ""
      if (index < typedText.length) {
        className = typedText[index] === char ? "text-[green]" : "text-[red] bg-[#ffcccc]"
      } else if (index === typedText.length && isActive) {
        className = "bg-[#667eea] text-white"
      }
      return <span key={index} className={className}>{char}</span>
    })
  }

  return (
    <div className="bg-white rounded-[15px] p-10 max-w-[800px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
      <h1 className="text-center text-[#667eea] mb-[30px] font-mono text-[2.5rem] font-bold">
        ⌨ Typing Speed Test
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-[15px] mb-[30px]">
        {/* Time Box */}
        <div className="bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white p-[15px] rounded-[10px] text-center">
          <h3 className="text-[0.9em] mb-2 opacity-90">Time</h3>
          <div className="flex justify-center gap-1">
            {[60, 30, 15].map(t => (
              <button 
                key={t}
                onClick={() => selectTime(t)}
                className={`timer w-auto min-w-[35px] h-8 text-[14px] font-normal rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedTime === t 
                  ? "bg-[linear-gradient(135deg,#9b58ce_0%,#372569_100%)] scale-110" 
                  : "bg-[linear-gradient(135deg,#53ddbc_0%,#1179a9_100%)]"
                } ${isActive && selectedTime !== t ? 'hidden' : 'inline-block'}`}
              >
                {isActive ? timeLeft : t}
              </button>
            ))}
          </div>
        </div>

        {/* WPM Box */}
        <div className="bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white p-[15px] rounded-[10px] text-center">
          <h3 className="text-[0.9em] mb-2 opacity-90">WPM</h3>
          <div className="text-[2em] font-bold">{wpm}</div>
        </div>

        {/* Accuracy Box */}
        <div className="bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white p-[15px] rounded-[10px] text-center">
          <h3 className="text-[0.9em] mb-2 opacity-90">Accuracy</h3>
          <div className="text-[2em] font-bold">{accuracy}%</div>
        </div>

        {/* Best WPM Box */}
        <div className="bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white p-[15px] rounded-[10px] text-center">
          <h3 className="text-[0.9em] mb-2 opacity-90">Best WPM</h3>
          <div className="text-[2em] font-bold">{bestWPM}</div>
        </div>
      </div>

      <div className="bg-[#f8f9fa] p-[25px] rounded-[10px] text-[1.3rem] leading-[1.8] mb-[20px] min-h-[150px]">
        {renderHighlightedText()}
      </div>

      <textarea
        ref={textareaRef}
        className="w-full p-[20px] text-[1.2rem] border-2 border-[#667eea] rounded-[10px] resize-y min-h-[150px] font-mono mb-[15px] focus:outline-none focus:border-[#764ba2] focus:shadow-[0_0_10px_rgba(102,126,234,0.3)] disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder={isActive ? "Start typing..." : "The test will start when you begin typing..."}
        disabled={!isActive}
        value={isActive ? typedText : ''}
        onChange={handleInput}
      ></textarea>

      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={startGame}
          disabled={isActive}
          className="bg-[#4ECDC4] text-white px-10 py-[15px] text-[1.2rem] font-bold rounded-lg cursor-pointer transition-all hover:bg-[#45b8b0] hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          Start Test
        </button>
        <button
          onClick={resetGame}
          className="bg-[#ff6b6b] text-white px-10 py-[15px] text-[1.2rem] font-bold rounded-lg cursor-pointer transition-all hover:bg-[#ee5a5a]"
        >
          Reset Session
        </button>
      </div>
    </div>
  )
}

export default App
