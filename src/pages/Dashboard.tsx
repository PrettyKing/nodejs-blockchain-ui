import { useEffect, useState } from 'react'
import Card from '../components/Card'
import blockchainService, { Blockchain } from '../services/blockchainService'
import { 
  CubeIcon, 
  ClockIcon, 
  ArrowPathIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/outline'

interface DashboardProps {
  isConnected: boolean
}

const Dashboard: React.FC<DashboardProps> = ({ isConnected }) => {
  const [blockchain, setBlockchain] = useState<Blockchain | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  
  const loadBlockchainData = async () => {
    if (!isConnected) return
    
    setLoading(true)
    try {
      const data = await blockchainService.getBlockchain()
      setBlockchain(data)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('加载区块链数据失败', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (isConnected) {
      loadBlockchainData()
    }
  }, [isConnected])
  
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-xl">请先连接到区块链节点</p>
          <p className="mt-2">使用顶部连接栏输入节点URL并连接</p>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">仪表盘</h1>
        
        <div className="flex items-center space-x-2">
          {lastRefresh && (
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              最后更新: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          
          <button 
            onClick={loadBlockchainData}
            disabled={loading}
            className="btn btn-primary flex items-center"
          >
            <ArrowPathIcon className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          title="区块链高度" 
          icon={<CubeIcon className="w-6 h-6" />}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900"
        >
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {blockchain?.chain.length ?? 0}
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            区块总数
          </p>
        </Card>
        
        <Card 
          title="待处理交易" 
          icon={<DocumentTextIcon className="w-6 h-6" />}
          className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900 dark:to-teal-900"
        >
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {blockchain?.pendingTransactions.length ?? 0}
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            等待被挖掘的交易
          </p>
        </Card>
        
        {blockchain?.chain.length && blockchain.chain.length > 0 && (
          <Card 
            title="最新区块" 
            icon={<CubeIcon className="w-6 h-6" />}
            className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900"
          >
            <div className="text-sm truncate text-gray-700 dark:text-gray-300 font-mono">
              {blockchain.chain[blockchain.chain.length - 1].hash.substring(0, 20)}...
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              交易数: {blockchain.chain[blockchain.chain.length - 1].transactions.length}
            </p>
          </Card>
        )}
      </div>
      
      {blockchain?.chain.length && blockchain.chain.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">最近区块</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">高度</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">哈希</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">交易数</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {blockchain.chain.slice().reverse().slice(0, 5).map((block, index) => (
                  <tr key={block.hash} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {blockchain.chain.length - index}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800 dark:text-gray-200">
                      {block.hash.substring(0, 8)}...{block.hash.substring(block.hash.length - 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(block.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {block.transactions.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard