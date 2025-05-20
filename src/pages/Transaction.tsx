import { useState, useEffect } from 'react'
import Card from '../components/Card'
import blockchainService, { Transaction as TransactionType } from '../services/blockchainService'
import { CurrencyDollarIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'

interface StoredWallet {
  publicKey: string
  privateKey: string
  label: string
}

const Transaction = () => {
  const [wallets, setWallets] = useState<StoredWallet[]>([])
  const [fromWallet, setFromWallet] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [recentTransactions, setRecentTransactions] = useState<{tx: TransactionType, timestamp: number}[]>([])
  
  // 从localStorage加载钱包
  useEffect(() => {
    const storedWallets = localStorage.getItem('wallets')
    if (storedWallets) {
      const parsed = JSON.parse(storedWallets)
      setWallets(parsed)
      if (parsed.length > 0) {
        setFromWallet(parsed[0].publicKey)
      }
    }
    
    // 加载之前的交易记录
    const storedTransactions = localStorage.getItem('recentTransactions')
    if (storedTransactions) {
      setRecentTransactions(JSON.parse(storedTransactions))
    }
  }, [])
  
  // 保存最近的交易到localStorage
  useEffect(() => {
    if (recentTransactions.length > 0) {
      localStorage.setItem('recentTransactions', JSON.stringify(recentTransactions))
    }
  }, [recentTransactions])
  
  // 找到当前选择的钱包
  const selectedWallet = wallets.find(w => w.publicKey === fromWallet)
  
  // 创建交易
  const createTransaction = async () => {
    if (!selectedWallet) {
      toast.error('请选择发送钱包')
      return
    }
    
    if (!toAddress) {
      toast.error('请输入接收地址')
      return
    }
    
    if (amount <= 0) {
      toast.error('金额必须大于0')
      return
    }
    
    setLoading(true)
    
    try {
      const result = await blockchainService.createTransaction(
        selectedWallet.publicKey,
        toAddress,
        amount,
        selectedWallet.privateKey
      )
      
      // 添加到最近交易
      setRecentTransactions([
        {
          tx: result.transaction,
          timestamp: Date.now()
        },
        ...recentTransactions.slice(0, 9) // 只保留最近10个
      ])
      
      toast.success('交易创建成功，等待挖掘')
      
      // 清空表单
      setToAddress('')
      setAmount(1)
    } catch (error) {
      console.error('创建交易失败', error)
      toast.error('创建交易失败，请检查输入并重试')
    } finally {
      setLoading(false)
    }
  }
  
  // 格式化日期
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }
  
  // 格式化地址
  const formatAddress = (address: string | null) => {
    if (!address) return '系统 (挖矿奖励)'
    
    // 查找钱包标签
    const wallet = wallets.find(w => w.publicKey === address)
    if (wallet) {
      return `${wallet.label} (${address.substring(0, 6)}...${address.substring(address.length - 4)})`
    }
    
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">创建交易</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title="创建新交易" 
          icon={<CurrencyDollarIcon className="w-6 h-6" />}
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  发送钱包
                </label>
                <select
                  value={fromWallet}
                  onChange={(e) => setFromWallet(e.target.value)}
                  className="input w-full"
                >
                  {wallets.map((wallet) => (
                    <option key={wallet.publicKey} value={wallet.publicKey}>
                      {wallet.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  接收地址
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    className="input w-full"
                    placeholder="输入接收方钱包地址"
                  />
                  {wallets.length > 1 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) setToAddress(e.target.value)
                      }}
                      className="input"
                      value=""
                    >
                      <option value="">选择接收钱包</option>
                      {wallets
                        .filter(w => w.publicKey !== fromWallet)
                        .map((wallet) => (
                          <option key={wallet.publicKey} value={wallet.publicKey}>
                            {wallet.label}
                          </option>
                        ))
                      }
                    </select>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  金额
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min="0.1"
                  step="0.1"
                  className="input w-full"
                />
              </div>
              
              <button
                onClick={createTransaction}
                disabled={loading || !toAddress || amount <= 0}
                className="btn btn-primary w-full"
              >
                {loading ? '交易中...' : '发送交易'}
              </button>
              
              {selectedWallet && (
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <p>从 <span className="font-medium text-gray-800 dark:text-gray-200">{selectedWallet.label}</span> 发送 <span className="font-medium text-gray-800 dark:text-gray-200">{amount}</span> 代币</p>
                </div>
              )}
            </>
          )}
        </Card>
        
        {recentTransactions.length > 0 && (
          <Card title="最近交易" icon={<CurrencyDollarIcon className="w-6 h-6" />}>
            <div className="overflow-auto max-h-96">
              {recentTransactions.map((item, index) => (
                <div 
                  key={index}
                  className="mb-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(item.timestamp)}
                    </span>
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {item.tx.amount}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <ArrowLeftIcon className="w-4 h-4 mr-1 text-red-500" />
                    <span className="truncate">
                      {formatAddress(item.tx.fromAddress)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <ArrowRightIcon className="w-4 h-4 mr-1 text-green-500" />
                    <span className="truncate">
                      {formatAddress(item.tx.toAddress)}
                    </span>
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

export default Transaction