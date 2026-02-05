import { useState, useEffect } from 'react'

const ICONS = ['🔥', '⭐', '🌈', '🍎', '⚽', '🎨']
const SHUFFLED_CARDS = () => {
  const cards = [...ICONS, ...ICONS]
  return cards.sort(() => Math.random() - 0.5).map((icon, index) => ({
    id: index,
    icon,
    flipped: false,
    matched: false,
    mismatch: false
  }))
}

function App() {
  const [cards, setCards] = useState(SHUFFLED_CARDS())
  const [selection, setSelection] = useState([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [showOverlay, setShowOverlay] = useState(false)

  const handleCardClick = (id) => {
    const card = cards.find(c => c.id === id)
    if (card.flipped || card.matched || selection.length === 2) return

    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c)
    setCards(newCards)
    setSelection([...selection, id])
  }

  useEffect(() => {
    if (selection.length === 2) {
      setMoves(prev => prev + 1)
      const [id1, id2] = selection
      const card1 = cards.find(c => c.id === id1)
      const card2 = cards.find(c => c.id === id2)

      if (card1.icon === card2.icon) {
        setCards(prev => prev.map(c => 
          (c.id === id1 || c.id === id2) ? { ...c, matched: true } : c
        ))
        setMatches(prev => prev + 1)
        setSelection([])
      } else {
        setCards(prev => prev.map(c => 
          (c.id === id1 || c.id === id2) ? { ...c, mismatch: true } : c
        ))
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === id1 || c.id === id2) ? { ...c, flipped: false, mismatch: false } : c
          ))
          setSelection([])
        }, 1000)
      }
    }
  }, [selection])

  useEffect(() => {
    if (matches === ICONS.length) {
      setShowOverlay(true)
    }
  }, [matches])

  const restartGame = () => {
    setCards(SHUFFLED_CARDS())
    setSelection([])
    setMoves(0)
    setMatches(0)
    setShowOverlay(false)
  }

  return (
    <div className="bg-white rounded-[14px] p-6 w-full max-w-[900px] shadow-[0_20px_60px_rgba(0,0,0,0.25)] relative">
      <h1 className="text-[#333] text-center mb-4 text-2xl font-bold">Memory Match</h1>

      <div className="flex justify-between items-center mb-[18px]">
        <div className="flex gap-4 items-center">
          <div className="bg-[linear-gradient(135deg,#667eea,#764ba2)] text-white p-[8px_12px] rounded-lg font-semibold">
            Moves: {moves}
          </div>
          <div className="bg-[linear-gradient(135deg,#667eea,#764ba2)] text-white p-[8px_12px] rounded-lg font-semibold">
            Matches: {matches}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={restartGame}
            className="p-[8px_14px] rounded-lg border-none bg-[#4ECDC4] text-white cursor-pointer hover:bg-[#3dbdb3] transition-colors font-semibold"
          >
            Restart Game
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 p-3">
        {cards.map((card) => (
          <div 
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`relative pt-[100%] cursor-pointer perspective-[800px] ${card.mismatch ? 'animate-shake' : ''}`}
          >
            <div className={`absolute inset-0 transition-transform duration-500 preserve-3d ${card.flipped ? 'rotate-y-180' : ''}`}>
              <div className="absolute inset-0 rounded-lg flex items-center justify-center backface-hidden bg-[#f4f4f4] border-2 border-[#ddd]">
                {/* Front face (hidden) */}
              </div>
              <div className="absolute inset-0 rounded-lg flex items-center justify-center backface-hidden bg-[#667eea] text-white rotate-y-180 text-2xl shadow-md">
                {card.icon}
              </div>
            </div>
            {card.matched && (
              <div className="absolute inset-0 rounded-lg shadow-[0_8px_20px_rgba(78,205,196,0.25)] outline outline-4 outline-[rgba(78,205,196,0.12)] pointer-events-none" />
            )}
          </div>
        ))}
      </div>

      {showOverlay && (
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-[20px_28px] rounded-xl bg-black/65 text-white text-4xl shadow-2xl z-50">
          You Win! 🎉
        </div>
      )}
    </div>
  )
}

export default App
