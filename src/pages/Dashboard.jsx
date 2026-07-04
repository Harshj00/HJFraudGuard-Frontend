import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function StatCard({ label, value, color, icon, delay }) {
  return (
    <div className="glass-card p-6 count-anim" style={{animationDelay: delay}}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-white/40 text-sm">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-4xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ amount: '', merchant: '', location: '' })
  const [submitting, setSubmitting] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchTransactions() }, [])

  const fetchTransactions = async () => {
    try {
      const r = await api.get('/transactions')
      setTransactions(r.data)
    } catch { navigate('/login') }
    finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const r = await api.post('/transactions', {
        amount: parseFloat(form.amount),
        merchant: form.merchant,
        location: form.location,
      })
      setLastResult(r.data)
      setForm({ amount: '', merchant: '', location: '' })
      fetchTransactions()
    } catch {}
    finally { setSubmitting(false) }
  }

  const fraudCount = transactions.filter(t => t.flaggedFraud).length
  const fraudRate = transactions.length > 0
    ? ((fraudCount / transactions.length) * 100).toFixed(1)
    : 0

  return (
    <div className="aurora-bg min-h-screen">
      {/* Blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">HJFraudGuard</h1>
            <p className="text-white/40 text-sm mt-1">Real-time AI Fraud Detection</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/analytics')}
              className="glass-card px-4 py-2 text-white/70 hover:text-white text-sm transition-all">
              📊 Analytics
            </button>
            <button onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
              className="glass-card px-4 py-2 text-white/70 hover:text-white text-sm transition-all">
              Sign out
            </button>
          </div>
        </div>

        {/* Bento Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Transactions" value={transactions.length} color="text-white" icon="💳" delay="0s" />
          <StatCard label="Fraud Detected" value={fraudCount} color="text-red-400" icon="🚨" delay="0.1s" />
          <StatCard label="Fraud Rate" value={`${fraudRate}%`} color="text-yellow-400" icon="📈" delay="0.2s" />
        </div>

        {/* Last Result Banner */}
        {lastResult && (
          <div className={`mb-6 p-4 rounded-2xl border flex items-center justify-between ${
            lastResult.flaggedFraud
              ? 'bg-red-500/10 border-red-500/30 glow-red'
              : 'bg-green-500/10 border-green-500/30 glow-green'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{lastResult.flaggedFraud ? '🚨' : '✅'}</span>
              <div>
                <p className="text-white font-semibold">
                  {lastResult.flaggedFraud ? 'FRAUD DETECTED' : 'Transaction Normal'}
                </p>
                <p className="text-white/50 text-sm">
                  {lastResult.merchant} · ₹{lastResult.amount} · Score: {lastResult.anomalyScore?.toFixed(4)}
                </p>
              </div>
            </div>
            <button onClick={() => setLastResult(null)} className="text-white/30 hover:text-white">✕</button>
          </div>
        )}

        {/* Check Transaction Form */}
        <div className="glass p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">🔍 Check Transaction</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-white/40 text-xs mb-1 block">Amount (₹)</label>
              <input type="number" step="0.01" required value={form.amount}
                onChange={(e) => setForm({...form, amount: e.target.value})}
                placeholder="e.g. 4500"
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 outline-none focus:border-blue-500/50 transition-all text-sm placeholder-white/20" />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Merchant</label>
              <input type="text" required value={form.merchant}
                onChange={(e) => setForm({...form, merchant: e.target.value})}
                placeholder="e.g. Amazon"
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 outline-none focus:border-blue-500/50 transition-all text-sm placeholder-white/20" />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Location</label>
              <input type="text" required value={form.location}
                onChange={(e) => setForm({...form, location: e.target.value})}
                placeholder="e.g. Delhi"
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 outline-none focus:border-blue-500/50 transition-all text-sm placeholder-white/20" />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={submitting}
                className="w-full py-2 rounded-xl text-white text-sm font-semibold transition-all"
                style={{background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', opacity: submitting ? 0.7 : 1}}>
                {submitting ? '⟳ Checking...' : 'Analyze →'}
              </button>
            </div>
          </form>
        </div>

        {/* Transactions Table */}
        <div className="glass overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-white font-semibold">Recent Transactions</h2>
            <span className="text-white/30 text-sm">{transactions.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['ID', 'Merchant', 'Amount', 'Location', 'Anomaly Score', 'Status'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-white/30 text-xs uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-white/30">Loading transactions...</td></tr>
                )}
                {!loading && transactions.map((t, i) => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/3 transition-colors"
                      style={{animationDelay: `${i * 0.05}s`}}>
                    <td className="px-6 py-4 text-white/40 text-sm">#{t.id}</td>
                    <td className="px-6 py-4 text-white font-medium text-sm">{t.merchant}</td>
                    <td className="px-6 py-4 text-white text-sm">₹{t.amount?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-white/60 text-sm">{t.location}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={t.flaggedFraud ? 'text-red-400 font-mono' : 'text-green-400 font-mono'}>
                        {t.anomalyScore?.toFixed(4) ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {t.flaggedFraud ? (
                        <span className="fraud-badge">
                          <span className="w-2 h-2 rounded-full bg-red-400 pulse-dot inline-block" />
                          Fraud
                        </span>
                      ) : (
                        <span className="normal-badge">✓ Normal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard