import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/register', { username, password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError('Username already taken')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="aurora-bg flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl float-anim" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl float-anim" style={{animationDelay: '2s'}} />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass gradient-border mb-4">
            <span className="text-3xl">🛡️</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text">HJFraudGuard</h1>
          <p className="text-white/40 text-sm mt-2">Create your account</p>
        </div>

        <div className="glass p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-4 text-green-400 text-sm">
              ✓ Account created! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500/50 transition-all placeholder-white/20"
                placeholder="Choose a username"
                required
              />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500/50 transition-all placeholder-white/20"
                placeholder="Choose a password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all mt-2"
              style={{background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', opacity: loading ? 0.7 : 1}}
            >
              {loading ? '⟳ Creating...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-white/30 text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register