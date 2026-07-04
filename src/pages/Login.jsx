import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await api.post('/auth/login', { username, password })
      localStorage.setItem('token', response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="aurora-bg flex items-center justify-center relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl float-anim" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl float-anim" style={{animationDelay: '3s'}} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl float-anim" style={{animationDelay: '1.5s'}} />

     <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
 
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass gradient-border mb-4 glow-blue">
            <span className="text-3xl">🛡️</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text">HJFraudGuard</h1>
          <p className="text-white/40 text-sm mt-2">AI-Powered Fraud Detection Platform</p>
        </div>

        {/* Card */}
        <div className="glass p-8 glow-blue">
          <h2 className="text-white font-semibold text-xl mb-6">Welcome back</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all placeholder-white/20"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 transition-all placeholder-white/20"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all mt-2"
              style={{background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', opacity: loading ? 0.7 : 1}}
            >
              {loading ? '⟳ Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p className="text-white/30 text-sm text-center mt-6">
            No account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
              Create one
            </Link>
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: 'AUC Score', value: '0.97' },
            { label: 'Transactions', value: '285K+' },
            { label: 'Model', value: 'PyTorch' },
          ].map(s => (
            <div key={s.label} className="glass-card p-3 text-center">
              <p className="text-white font-bold text-sm">{s.value}</p>
              <p className="text-white/40 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Login