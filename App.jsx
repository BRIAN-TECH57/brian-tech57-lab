import { useState } from 'react'
import { supabase } from './supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState({ title: 'Engineering Lab', extract: 'Search a term or upload a diagram.' })
  const [imageUrl, setImageUrl] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [loading, setLoading] = useState(false)

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  // NEW: Voice Reader Function
  const speakDefinition = () => {
    // Stop any current speaking
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(topic.extract)
    utterance.pitch = 1
    utterance.rate = 0.9 // Slightly slower for technical clarity
    window.speechSynthesis.speak(utterance)
  }

  const getDefinition = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query.replace(' ', '_')}`)
      const data = await res.json()
      setTopic(data.title === "Not found." ? { title: 'Not Found', extract: 'Try another term.' } : data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleUpload = async (event) => {
    setLoading(true)
    const file = event.target.files[0]
    const filePath = `questions/${Math.random()}-${file.name}`
    await supabase.storage.from('question-images').upload(filePath, file)
    const { data } = supabase.storage.from('question-images').getPublicUrl(filePath)
    setImageUrl(data.publicUrl)
    setLoading(false)
  }

  return (
    <div style={{ 
      backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff', 
      color: isDarkMode ? '#ffffff' : '#0a0a0a',
      minHeight: '100vh',
      transition: 'all 0.5s ease',
      fontFamily: 'sans-serif'
    }}>
      <div className="App" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: '#007bff', textShadow: isDarkMode ? '0 0 10px #007bff' : 'none' }}
        >
          BRIAN-TECH57 VISUAL LAB
        </motion.h1>

        <button 
          onClick={toggleTheme} 
          style={{ marginBottom: '30px', background: 'transparent', border: '1px solid #007bff', color: '#007bff', cursor: 'pointer', borderRadius: '5px' }}
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        <form onSubmit={getDefinition} style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
          <input 
            type="text" 
            placeholder="Search engineering topic..." 
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: '15px', width: '60%', borderRadius: '10px 0 0 10px', border: '2px solid #007bff', outline: 'none' }}
          />
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px #007bff' }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            style={{ padding: '15px 25px', borderRadius: '0 10px 10px 0', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            {loading ? '...' : 'Define'}
          </motion.button>
        </form>

        <AnimatePresence mode="wait">
          <motion.div 
            key={topic.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ 
              border: '2px solid #007bff', 
              padding: '30px', 
              borderRadius: '20px', 
              background: isDarkMode ? '#161616' : '#f0f4f8',
              boxShadow: isDarkMode ? '0 10px 30px rgba(0, 123, 255, 0.2)' : '0 10px 30px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#007bff', margin: 0 }}>{topic.title}</h2>
              {/* Voice Button */}
              <motion.button 
                whileHover={{ scale: 1.2 }}
                onClick={speakDefinition}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                🔊
              </motion.button>
            </div>
            
            <p style={{ lineHeight: '1.6', fontSize: '1.1rem', marginTop: '20px' }}>{topic.extract}</p>

            <div style={{ marginTop: '20px', borderTop: '1px solid #007bff44', paddingTop: '20px' }}>
              <label style={{ background: '#007bff', color: 'white', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', display: 'inline-block' }}>
                📸 Upload Question Image
                <input type="file" accept="image/*" onChange={handleUpload} hidden />
              </label>
            </div>

            {imageUrl && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '20px' }}>
                <img src={imageUrl} alt="Diagram" style={{ width: '100%', borderRadius: '15px', border: '2px solid #007bff' }} />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App