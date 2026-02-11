import { useState, useMemo } from 'react'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all')

  const handleAdd = () => {
    const task = inputValue.trim()
    if (task === "") {
      alert("No content added, please enter something.")
      return
    }

    setTodos(prev => [...prev, {
      id: Date.now().toString(),
      content: task,
      complete: false
    }])
    setInputValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  const handleDelete = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const handleToggleComplete = (id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, complete: !todo.complete } : todo
    ))
  }

  const handleDeleteAll = () => {
    setTodos([])
  }

  const handleDeleteSelected = () => {
    setTodos(prev => prev.filter(todo => !todo.complete))
  }

  const completedCount = todos.filter(todo => todo.complete).length
  const pendingCount = todos.length - completedCount

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'pending': return todos.filter(t => !t.complete)
      case 'completed': return todos.filter(t => t.complete)
      case 'all':
      default:
        return todos
    }
  }, [todos, filter])

  // Shared button class based on .btn in style.css
  const btnClass = "cursor-pointer select-none border-none outline-none text-center rounded-[0.5rem] h-12 min-h-12 uppercase border font-semibold text-[.875rem] leading-[1em] transition-all duration-200 ease-[cubic-bezier(.4,0,.2,1)] inline-flex justify-center items-center px-4"
  const btnHoverClass = "hover:bg-[#6c6d6e] hover:text-white"

  return (
    <div className="flex flex-col items-center justify-center w-[96%] sm:min-w-[500px] max-w-[1000px] p-5 rounded-[20px] bg-[linear-gradient(aqua,rgb(249,146,164))]">
      <header className="flex flex-col items-center justify-center w-full mb-5">
        <h1 className="text-[30px] font-black mb-2.5 tracking-[1px] uppercase pointer-events-none" style={{ wordSpacing: '5px' }}>
          Todo List
        </h1>

        <div className="flex flex-row w-full h-full justify-between items-center">
          <input 
            type="text" 
            placeholder="📑 Add your todo here.."
            className="flex-grow border-[2px] border-black rounded-[0.5rem] h-12 px-4 text-[1.2rem] flex-shrink mr-2.5"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={handleAdd}
            className={`${btnClass} bg-[green] text-white hover:bg-white hover:text-[#9acd32]`}
          >
            <i className="bx bx-plus bx-sm"></i>
          </button>
        </div>
      </header>

      {/* Action Buttons (.todos-filter) */}
      <div className="flex justify-between items-center w-full mb-2.5">
        <button 
          onClick={handleDeleteSelected}
          className={`${btnClass} ${btnHoverClass} bg-[#e5e7eb]`}
        >
          Delete Selected
        </button>
        <button 
          onClick={handleDeleteAll}
          className={`${btnClass} ${btnHoverClass} bg-[#e5e7eb]`}
        >
          Delete All
        </button>
      </div>

      {/* Todos List */}
      <ul className="flex flex-col w-full min-h-full max-h-[54vh] overflow-y-scroll no-scrollbar mb-2.5">
        {visibleTodos.map(todo => (
          <li key={todo.id} className="bg-[wheat] rounded-[12px] mb-[5px] p-2.5 flex flex-row items-center justify-between w-full">
            <p className={`mr-2.5 text-[1.4rem] break-words flex-grow ${todo.complete ? 'line-through opacity-60' : ''}`}>
              {todo.content}
            </p>

            <div className="flex flex-row items-center justify-end w-full h-full">
              <button 
                onClick={() => handleToggleComplete(todo.id)}
                className={`${btnClass} bg-[rgb(50,177,50)] text-white hover:bg-white hover:text-[rgb(50,177,50)] mr-2.5`}
              >
                <i className="bx bx-check bx-sm pointer-events-none"></i>
              </button>

              <button 
                onClick={() => handleDelete(todo.id)}
                className={`${btnClass} bg-[rgb(246,77,4)] text-white hover:bg-white hover:text-[rgb(246,77,4)]`}
              >
                <i className="bx bx-trash bx-sm pointer-events-none"></i>
              </button>
            </div>
          </li>
        ))}
        {visibleTodos.length === 0 && (
          <p className="text-center text-gray-700 italic my-4 w-full">No tasks found.</p>
        )}
      </ul>

      {/* Filters & Stats */}
      <div className="flex justify-between items-center w-full mt-2.5">
        
        {/* Dropdown (.dropdown / .dropbtn) */}
        <div className="relative inline-block group">
          <button className="bg-[green] text-white px-4 py-2.5 text-[16px] border-none rounded-[5px] cursor-pointer group-hover:bg-white group-hover:text-[yellowgreen] transition-all duration-200">
            Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
          <div className="hidden group-hover:block absolute bg-[#f9f9f9] min-w-[160px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.2)] z-[1] rounded-lg overflow-hidden mt-1">
            <button 
              onClick={() => setFilter('all')} 
              className="block w-full text-left text-black px-4 py-3 hover:bg-[#f1f1f1] text-[16px]"
            >
              All
            </button>
            <button 
              onClick={() => setFilter('pending')} 
              className="block w-full text-left text-black px-4 py-3 hover:bg-[#f1f1f1] text-[16px]"
            >
              Pending
            </button>
            <button 
              onClick={() => setFilter('completed')} 
              className="block w-full text-left text-black px-4 py-3 hover:bg-[#f1f1f1] text-[16px]"
            >
              Completed
            </button>
          </div>
        </div>

        <div className="text-right space-y-1 font-bold tracking-wide">
          <p>Completed: <span>{completedCount}</span></p>
          <p>Pending: <span>{pendingCount}</span></p>
        </div>
      </div>
    </div>
  )
}

export default App
