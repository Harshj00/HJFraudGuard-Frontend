import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts'
import api from '../api/axios'

const COLORS = ['#22c55e', '#ef4444']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 text-sm">
        <p className="text-white/60 mb-1">{label}</p>
        <p className="text-white font-semibold">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

function Analytics() {
  const [transactions, setTransactions] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/transactions').then(r => setTransactions(r.data)).catch(() => navigate('/login'))
  }, [])

  const fraudCount = transactions.filter(t => t.flaggedFraud).length
  const normalCount = transactions.length - fraudCount
  const pieData = [{ name: 'Normal', value: normalCount }, { name: 'Fraud', value: fraudCount }]

  const buckets = { '₹0-100': 0, '₹100-500': 0, '₹500-1K': 0, '₹1K-5K': 0, '₹5K+': 0 }
  transactions.forEach(t => {
    if (t.amount <= 100) buckets['₹0-100']++
    else if (t.amount <= 500) buckets['₹100-500']++
    else if (t.amount <= 1000) buckets['₹500-1K']++
    else if (t.amount <= 5000) buckets['₹1K-5K']++
    else buckets['₹5K+']++
  })
  const barData = Object.entries(buckets).map(([range, count]) => ({ range, count }))

  const scoreData = transactions
    .filter(t => t.anomalyScore != null)
    .map(t => ({ id: `#${t.id}`, score: parseFloat(t.anomalyScore.toFixed(3)), fraud: t.flaggedFraud }))

  const metrics = [
    { label: 'AUC Score', value: '0.9666', sub: 'Area Under Curve', color: '#22c55e', icon: '🎯' },
    { label: 'F1 Score', value: '0.5827', sub: 'Precision-Recall Balance', color: '#60a5fa', icon: '⚖️' },
    { label: 'Precision', value: '63.2%', sub: 'Fraud Alert Accuracy', color: '#a78bfa', icon: '🎪' },
    { label: 'Recall', value: '54.1%', sub: 'Fraud Catch Rate', color: '#34d399', icon: '🕵️' },
    { label: 'Threshold', value: '6.532', sub: 'Anomaly Cutoff', color: '#fbbf24', icon: '📏' },
    { label: 'Training Set', value: '285K+', sub: 'Real Transactions', color: '#f87171', icon: '📚' },
  ]

  return (
    <div className="aurora-bg min-h-screen">
      <div className="fixed top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
            <p className="text-white/40 text-sm mt-1">Model performance & transaction insights</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/dashboard')}
              className="glass-card px-4 py-2 text-white/70 hover:text-white text-sm transition-all">
              ← Dashboard
            </button>
            <button onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
              className="glass-card px-4 py-2 text-white/70 hover:text-white text-sm transition-all">
              Sign out
            </button>
          </div>
        </div>

        {/* Model Metrics Bento */}
        <div className="glass p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">🤖</span>
            <div>
              <h2 className="text-white font-semibold">Model Performance</h2>
              <p className="text-white/40 text-xs">PyTorch Autoencoder • Trained on Kaggle Credit Card Fraud Dataset</p>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {metrics.map(m => (
              <div key={m.label} className="glass-card p-4 text-center">
                <span className="text-xl block mb-2">{m.icon}</span>
                <p className="font-bold text-lg" style={{color: m.color}}>{m.value}</p>
                <p className="text-white/50 text-xs mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Pie */}
          <div className="glass p-6">
            <h3 className="text-white font-semibold mb-1">Fraud vs Normal</h3>
            <p className="text-white/30 text-xs mb-4">{transactions.length} total transactions analyzed</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                  label={({name, value}) => `${name}: ${value}`} labelLine={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => <span style={{color: 'rgba(255,255,255,0.6)', fontSize: 12}}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar */}
          <div className="glass p-6">
            <h3 className="text-white font-semibold mb-1">Amount Distribution</h3>
            <p className="text-white/30 text-xs mb-4">Transaction count by amount range</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <XAxis dataKey="range" tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 11}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 11}} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="url(#blueGradient)" />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Anomaly Score Chart */}
        <div className="glass p-6">
          <h3 className="text-white font-semibold mb-1">Anomaly Score per Transaction</h3>
          <p className="text-white/30 text-xs mb-4">
            Threshold: <span className="text-yellow-400 font-mono">6.532</span> — scores above this are flagged as fraud
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreData}>
              <XAxis dataKey="id" tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 11}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 11}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {scoreData.map((entry, i) => (
                  <Cell key={i} fill={entry.fraud ? '#ef4444' : '#22c55e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-4 justify-center">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Normal
            </div>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Fraud
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics