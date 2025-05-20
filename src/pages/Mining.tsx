import { useState, useEffect } from 'react'
import Card from '../components/Card'
import blockchainService, { Block, Transaction } from '../services/blockchainService'
import { ArrowPathIcon, BoltIcon, CubeIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'

interface StoredWallet {
  publicKey: string
  privateKey: string
  label: string
}

const Mining = () => {
  const [wallets, setWallets] = useState<StoredWallet[]>([])
  const [minerWallet, setMinerWallet] = useState('')
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([])
  const [miningHistory, setMiningHistory] = useState<{
    block: Block,
    timestamp: number,
    minerAddress: string,
    reward: number
  }[]>([])
  const [loading, setLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // 从localStorage加载钱包
  useEffect(() => {
    const storedWallets = localStorage.getItem('wallets')
    if (storedWallets) {
      const parsed = JSON.parse(storedWallets)
      setWallets(parsed)
      if (parsed.length > 0) {
        setMinerWallet(parsed[0].publicKey)
      }
    }
    
    // 加载挖矿历史
    const storedMiningHistory = localStorage.getItem('miningHistory')
    if (storedMiningHistory) {
      setMiningHistory(JSON.parse(storedMiningHistory))
    }
    
    // 加载待处理交易
    refreshPendingTransactions()
  }, [])
  
  // 保存挖矿历史到localStorage
  useEffect(() => {
    if (miningHistory.length > 0) {
      localStorage.setItem('miningHistory', JSON.stringify(miningHistory))
    }
  }, [miningHistory])
  
  // 刷新待处理交易
  const refreshPendingTransactions = async () => {
    setIsRefreshing(true)
    try {
      const data = await blockchainService.getBlockchain()
      setPendingTransactions(data.pendingTransactions)
    } catch (error) {
      console.error('加载待处理交易失败', error)
      toast.error('加载待处理交易失败')
    } finally {
      setIsRefreshing(false)
    }
  }
  
  // 开始挖矿
  const startMining = async () => {
    if (!minerWallet) {
      toast.error('请选择挖矿钱包')
      return
    }
    
    setLoading(true)
    
    try {
      const result = await blockchainService.mine(minerWallet)
      
      // 添加到挖矿历史
      const miningReward = result.lastBlock.transactions.find(
        tx => tx.fromAddress === null && tx.toAddress === minerWallet
      )
      
      setMiningHistory([
        {
          block: result.lastBlock,
          timestamp: Date.now(),
          minerAddress: minerWallet,
          reward: miningReward?.amount || 0
        },
        ...miningHistory.slice(0, 9) // 只保留最近10个
      ])
      
      toast.success('区块挖掘成功!')
      
      // 刷新待处理交易
      refreshPendingTransactions()
    } catch (error) {
      console.error('挖矿失败', error)
      toast.error('挖矿失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  // 找到当前选择的钱包
  const selectedWallet = wallets.find(w => w.publicKey === minerWallet)
  
  // 格式化日期
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }
  
  // 格式化地址
  const formatAddress = (address: string | null, full = false) => {
    if (!address) return '系统 (挖矿奖励)'
    
    // 查找钱包标签
    const wallet = wallets.find(w => w.publicKey === address)
    if (wallet) {
      return full 
        ? `${wallet.label} (${address})` 
        : `${wallet.label} (${address.substring(0, 6)}...${address.substring(address.length - 4)})`
    }
    
    return full 
      ? address 
      : `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">挖矿</h1>
        
        <div className="flex space-x-2">
          <button 
            onClick={refreshPendingTransactions}
            disabled={isRefreshing}
            className="btn btn-secondary flex items-center"
          >
            <ArrowPathIcon className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            刷新
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title="开始挖矿" 
          icon={<BoltIcon className="w-6 h-6" />}
          className="lg:row-span-2"
        >
          {wallets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                您还没有钱包。请先在钱包页面创建一个钱包。
              </p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                通过挖矿，您可以处理待处理的交易并获得挖矿奖励。
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  挖矿钱包 (接收奖励)
                </label>
                <select
                  value={minerWallet}
                  onChange={(e) => setMinerWallet(e.target.value)}
                  className="input w-full"
                >
                  {wallets.map((wallet) => (
                    <option key={wallet.publicKey} value={wallet.publicKey}>
                      {wallet.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-6">
                <h3 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                  待处理交易: {pendingTransactions.length}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  有 {pendingTransactions.length} 笔交易等待处理。
                  {pendingTransactions.length > 0 ? 
                    ' 挖矿可以将这些交易添加到区块链中。' : 
                    ' 可以通过在交易页面创建新交易来添加待处理交易。'
                  }
                </p>
              </div>
              
              <button
                onClick={startMining}
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                    挖矿中...
                  </>
                ) : (
                  <>
                    <BoltIcon className="w-5 h-5 mr-2" />
                    开始挖矿
                  </>
                )}
              </button>
              
              {selectedWallet && (
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <p>奖励将发送到 <span className="font-medium text-gray-800 dark:text-gray-200">{selectedWallet.label}</span></p>
                </div>
              )}
            </>
          )}
        </Card>
        
        {pendingTransactions.length > 0 && (
          <Card title="待处理交易" icon={<CubeIcon className="w-6 h-6" />}>
            <div className="overflow-auto max-h-64">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {pendingTransactions.map((tx, index) => {
                    return (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-xs">
                          {formatAddress(tx.fromAddress)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-xs">
                          {formatAddress(tx.toAddress)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {tx.amount}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
        
        {miningHistory.length > 0 && (
          <Card title="挖矿历史" icon={<CubeIcon className="w-6 h-6" />}>
            <div className="overflow-auto max-h-96">
              {miningHistory.map((item, index) => (
                <div 
                  key={index}
                  className="mb-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(item.timestamp)}
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      +{item.reward} (奖励)
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-700 dark:text-gray-300">
                    <p>
                      <span className="font-medium">区块哈希:</span> {item.block.hash.substring(0, 16)}...
                    </p>
                    <p>
                      <span className="font-medium">矿工:</span> {formatAddress(item.minerAddress)}
                    </p>
                    <p>
                      <span className="font-medium">交易数:</span> {item.block.transactions.length}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Mining