import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

interface LayoutProps {
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
}

const Layout: React.FC<LayoutProps> = ({ isConnected, setIsConnected }) => {
  const [serverUrl, setServerUrl] = useState('https://blockchain-worker.chalee695469701.workers.dev')
  
  const handleConnect = () => {
    // 设置axios baseURL
    axios.defaults.baseURL = serverUrl
    
    // 测试连接
    axios.get('/blockchain')
      .then(() => {
        setIsConnected(true)
        toast.success('成功连接到区块链节点')
      })
      .catch((error) => {
        console.error('连接失败:', error)
        toast.error('无法连接到区块链节点，请检查URL和端口')
      })
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar isConnected={isConnected} />
      
      <div className="flex-1">
        {!isConnected && (
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
            <div className="container mx-auto flex items-center justify-between">
              <span>
                您尚未连接到区块链节点。请输入节点URL:
              </span>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  className="input text-black"
                  placeholder="https://blockchain-worker.chalee695469701.workers.dev"
                />
                <button
                  onClick={handleConnect}
                  className="btn btn-primary"
                >
                  连接
                </button>
              </div>
            </div>
          </div>
        )}
        
        <main className="container mx-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout