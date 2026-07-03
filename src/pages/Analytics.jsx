import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import api from '../api/axios'

const COLORS = ['#22c55e', '#ef4444']

function Analytics() {
  const [transactions, setTransactions] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/transactions').then(r => setTransactions(r.data)).catch(() => navigate('/login'))
  }, [])

  const fraudCount = transactions.filter(t => t.flaggedFraud).length
  const normalCount = transactions.length - fraudCount

  const pieData = [
    { name: 'Normal', value: normalCount },
    { name: 'Fraud', value: fraudCount },
  ]

  const amountBuckets = { '0-100': 0, '100-500': 0, '500-1000': 0, '1000-5000': 0, '5000+': 0 }
  transactions.forEach(t => {
    if (t.amount <= 100) amountBuckets['0-100']++
    else if (t.amount <= 500) amountBuckets['100-500']++
    else if (t.amount <= 1000) amountBuckets['500-1000']++
    else if (t.amount <= 5000) amountBuckets['1000-5000']++
    else amountBuckets['5000+']++
  })
  const barData = Object.entries(amountBuckets).map(([range, count]) => ({ range, count }))

  const scoreData = transactions
    .filter(t => t.anomalyScore != null)
    .map(t => ({
      id: `#${t.id}`,
      score: parseFloat(t.anomalyScore.toFixed(3)),
      fraud: t.flaggedFraud
    }))

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Analytics 📊</h1>
          <div className="flex gap-3">
            <button onClick={() => navigate('/dashboard')}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition">
              ← Dashboard
            </button>
            <button onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition">
              Logout
            </button>
          </div>
        </div>

        {/* Model Metrics Banner */}
        <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-blue-400 font-semibold text-lg mb-3">🤖 Model Performance Metrics</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'AUC Score', value: '0.9666', color: 'text-green-400' },
              { label: 'F1 Score', value: '0.5827', color: 'text-yellow-400' },
              { label: 'Precision', value: '0.6318', color: 'text-blue-400' },
              { label: 'Trained On', value: '285K+', color: 'text-purple-400' },
            ].map(m => (
              <div key={m.label} className="bg-slate-800 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-xs mb-1">{m.label}</p>
                <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Pie Chart */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Fraud vs Normal</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Amount Distribution Bar Chart */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Amount Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Anomaly Score Bar Chart */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-2">Anomaly Scores per Transaction</h2>
          <p className="text-slate-400 text-sm mb-4">Threshold: 6.532 — scores above this are flagged as fraud</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scoreData}>
              <XAxis dataKey="id" tick={{ fill: '#94a3b8' }} />
              <YAxis tick={{ fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}
                label={false}
                fill="#3b82f6"
              >
                {scoreData.map((entry, i) => (
                  <Cell key={i} fill={entry.fraud ? '#ef4444' : '#22c55e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Analytics