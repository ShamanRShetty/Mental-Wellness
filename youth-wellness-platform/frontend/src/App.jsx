import { useState } from 'react'
import { Heart, MessageCircle, Shield } from 'lucide-react'

function App() {
  const [apiStatus, setApiStatus] = useState('Checking...')

  // Test backend connection
  const checkBackend = async () => {
    try {
      const response = await fetch('http://localhost:8080')
      const data = await response.json()
      setApiStatus(data.message)
    } catch (error) {
      setApiStatus('Backend not connected')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Youth Mental Wellness Platform
          </h1>
          <p className="text-xl text-gray-600">
            Your safe space for mental health support
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Shield className="w-12 h-12 text-blue-500 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold mb-2">100% Anonymous</h3>
            <p className="text-gray-600">Your privacy is our priority</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <MessageCircle className="w-12 h-12 text-purple-500 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold mb-2">AI Companion</h3>
            <p className="text-gray-600">24/7 empathetic support</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Heart className="w-12 h-12 text-pink-500 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold mb-2">Culturally Aware</h3>
            <p className="text-gray-600">Understanding Indian youth</p>
          </div>
        </div>

        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Frontend:</span>
              <span className="text-green-500 font-semibold">✓ Running</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Backend:</span>
              <span className="font-semibold">{apiStatus}</span>
            </div>
            <button
              onClick={checkBackend}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Check Backend Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App