import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()    
  const [form, setForm] = useState({ amount: '', merchant: '', location: '' })

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/transactions', {
        amount: parseFloat(form.amount),
        merchant: form.merchant,
        location: form.location,
      })
      setForm({ amount: '', merchant: '', location: '' })
      fetchTransactions()
    } catch (err) {
      setError('Failed to create transaction')
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions')
      setTransactions(response.data)
    } catch (err) {
      setError('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const totalCount = transactions.length
  const fraudCount = transactions.filter(t => t.flaggedFraud).length

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">HJFraudGuard 🛡️</h1>
          <button
            onClick={handleLogout}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
        <button onClick={() => navigate('/analytics')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition mr-2">
            Analytics 📊
          </button>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Total Transactions</p>
            <p className="text-3xl font-bold text-white">{totalCount}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Flagged as Fraud</p>
            <p className="text-3xl font-bold text-red-400">{fraudCount}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Fraud Rate</p>
            <p className="text-3xl font-bold text-yellow-400">
              {totalCount > 0 ? ((fraudCount / totalCount) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="bg-slate-800 rounded-xl p-6 mb-8 flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-slate-400 text-sm">Amount</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div className="flex-1">
            <label className="text-slate-400 text-sm">Merchant</label>
            <input
              type="text"
              required
              value={form.merchant}
              onChange={(e) => setForm({ ...form, merchant: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div className="flex-1">
            <label className="text-slate-400 text-sm">Location</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Check Transaction
          </button>
        </form>

        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-white">
            <thead className="bg-slate-700">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Merchant</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Location</th>
                <th className="p-4">Anomaly Score</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="6" className="p-4 text-center text-slate-400">Loading...</td></tr>
              )}
              {error && (
                <tr><td colSpan="6" className="p-4 text-center text-red-400">{error}</td></tr>
              )}
              {!loading && transactions.map((t) => (
                <tr key={t.id} className="border-t border-slate-700 hover:bg-slate-750">
                  <td className="p-4">{t.id}</td>
                  <td className="p-4">{t.merchant}</td>
                  <td className="p-4">₹{t.amount.toFixed(2)}</td>
                  <td className="p-4">{t.location}</td>
                  <td className="p-4">{t.anomalyScore?.toFixed(4) ?? '-'}</td>
                  <td className="p-4">
                    {t.flaggedFraud ? (
                      <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">Fraud</span>
                    ) : (
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard