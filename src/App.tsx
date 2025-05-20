import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import BlockchainExplorer from './pages/Blockchain'
import Wallet from './pages/Wallet'
import Transaction from './pages/Transaction'
import Mining from './pages/Mining'
import { useState } from 'react'

function App() {
  const [isConnected, setIsConnected] = useState(false)
  
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Layout isConnected={isConnected} setIsConnected={setIsConnected} />}>
          <Route index element={<Dashboard isConnected={isConnected} />} />
          <Route path="blockchain" element={<BlockchainExplorer />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="transaction" element={<Transaction />} />
          <Route path="mining" element={<Mining />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App