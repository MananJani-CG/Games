import { useState } from 'react'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    const fieldName = id.replace('Input', '')
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSubmit = () => {
    console.log("Name:", formData.name)
    console.log("Email:", formData.email)
    console.log("Age:", formData.age)
  }

  return (
    <div className="flex justify-center items-center min-h-screen font-serif">
      <div 
        className="bg-white border border-black rounded-[10px] p-[10px_30px_30px_25px] shadow-[10px_10px_10px_rgba(59,55,55,0.5)]"
      >
        <h1 className="text-[2em] font-bold mt-[0.67em] mb-[0.67em]">Registration Form</h1>

        <div className="mb-4">
          <label htmlFor="nameInput" className="block text-[16px] mb-1">Name:</label>
          <input 
            id="nameInput" 
            type="text" 
            className="border border-gray-400 w-[260px] h-[20px] px-1"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="emailInput" className="block text-[16px] mb-1">Email:</label>
          <input 
            id="emailInput" 
            type="email" 
            className="border border-gray-400 w-[260px] h-[20px] px-1"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="ageInput" className="block text-[16px] mb-1">Age:</label>
          <input 
            id="ageInput" 
            type="number" 
            className="border border-gray-400 w-[260px] h-[20px] px-1"
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        <button 
          id="submitBtn"
          onClick={handleSubmit}
          className="bg-[#4e7ede] text-white border-none rounded-[5px] cursor-pointer w-[267px] h-[27px] mt-2 font-sans font-normal text-[13.33px] flex items-center justify-center"
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default App
