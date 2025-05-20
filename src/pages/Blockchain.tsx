import { useEffect, useState } from 'react'
import Card from '../components/Card'
import blockchainService, { Blockchain, Block } from '../services/blockchainService'
import { 
  CubeIcon, 
  ClockIcon, 
  ChevronDownIcon, 
  ChevronUpIcon 
} from '@heroicons/react/24/outline'

// 将组件名称从Blockchain改为BlockchainExplorer以避免与导入的类型名称冲突
const BlockchainExplorer = () => {
  const [blockchain, setBlockchain] = useState<Blockchain | null>(null)
  const [loading, setLoading] = useState(false)
  const [expandedBlocks, setExpandedBlocks] = useState<{ [key: string]: boolean }>({})
  
  const loadBlockchainData = async () => {
    setLoading(true)
    try {
      const data = await blockchainService.getBlockchain()
      setBlockchain(data)
    } catch (error) {
      console.error('加载区块链数据失败', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadBlockchainData()
  }, [])
  
  const toggleBlockExpansion = (hash: string) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [hash]: !prev[hash]
    }))
  }
  
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }
  
  const formatHash = (hash: string, truncate = true) => {
    if (!truncate) return hash
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 6)}`
  }
  
  const renderTransactionTable = (transactions: any[]) => {
    if (transactions.length === 0) {
      return <p className="text-gray-500 dark:text-gray-400 italic">没有交易</p>
    }
    
    return (
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              发送方
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              接收方
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              金额
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              时间
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map((tx, index) => (
            <tr key={index}>
              <td className="px-4 py-2 whitespace-nowrap font-mono text-xs">
                {tx.fromAddress ? formatHash(tx.fromAddress) : '系统 (挖矿奖励)'}
              </td>
              <td className="px-4 py-2 whitespace-nowrap font-mono text-xs">
                {formatHash(tx.toAddress)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {tx.amount}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {formatTimestamp(tx.timestamp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  
  const renderBlock = (block: Block, index: number) => {
    const isExpanded = expandedBlocks[block.hash] || false
    
    return (
      <Card 
        key={block.hash}
        title={`区块 #${index}`}
        icon={<CubeIcon className="w-6 h-6" />}
        className="mb-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">哈希:</p>
            <p className="font-mono text-xs break-all">{block.hash}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">前一个区块哈希:</p>
            <p className="font-mono text-xs break-all">{block.previousHash}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Nonce:</p>
            <p>{block.nonce}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">时间戳:</p>
            <p>{formatTimestamp(block.timestamp)}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              交易数: {block.transactions.length}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => toggleBlockExpansion(block.hash)}
          className="flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon className="w-4 h-4 mr-1" />
              隐藏交易
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-4 h-4 mr-1" />
              显示交易 ({block.transactions.length})
            </>
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-4 overflow-x-auto">
            {renderTransactionTable(block.transactions)}
          </div>
        )}
      </Card>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">区块链浏览器</h1>
        
        <button 
          onClick={loadBlockchainData}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? '加载中...' : '刷新'}
        </button>
      </div>
      
      {loading && !blockchain ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">加载区块链数据...</p>
        </div>
      ) : blockchain ? (
        <>
          <div className="mb-6 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">区块链信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">区块数量</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-300">{blockchain.chain.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">待处理交易</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-300">{blockchain.pendingTransactions.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Genesis区块时间</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-300">
                  {formatTimestamp(blockchain.chain[0].timestamp)}
                </p>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">区块</h2>
          
          {blockchain.chain.slice().reverse().map((block, idx) => 
            renderBlock(block, blockchain.chain.length - idx - 1)
          )}
          
          {blockchain.pendingTransactions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">待处理交易</h2>
              <Card title="等待被挖掘的交易" className="bg-yellow-50 dark:bg-yellow-900">
                <div className="overflow-x-auto">
                  {renderTransactionTable(blockchain.pendingTransactions)}
                </div>
              </Card>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500 dark:text-gray-400">无法加载区块链数据。请检查连接并重试。</p>
        </div>
      )}
    </div>
  )
}

export default BlockchainExplorer