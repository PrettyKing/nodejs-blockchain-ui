import { useState, useEffect } from 'react'
import Card from '../components/Card'
import blockchainService, { Wallet as WalletType } from '../services/blockchainService'
import { WalletIcon, PlusIcon, ClipboardIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'

interface StoredWallet extends WalletType {
  label: string
}

const Wallet = () => {
  const [wallets, setWallets] = useState<StoredWallet[]>([])
  const [balances, setBalances] = useState<{ [key: string]: number }>({})
  const [showPrivateKeys, setShowPrivateKeys] = useState<{ [key: string]: boolean }>({})
  const [newWalletLabel, setNewWalletLabel] = useState('')
  const [loading, setLoading] = useState(false)
  
  // 从localStorage加载钱包
  useEffect(() => {
    const storedWallets = localStorage.getItem('wallets')
    if (storedWallets) {
      setWallets(JSON.parse(storedWallets))
    }
  }, [])
  
  // 保存钱包到localStorage
  useEffect(() => {
    if (wallets.length > 0) {
      localStorage.setItem('wallets', JSON.stringify(wallets))
    }
  }, [wallets])
  
  // 获取所有钱包余额
  useEffect(() => {
    const fetchBalances = async () => {
      const newBalances: { [key: string]: number } = {}
      
      for (const wallet of wallets) {
        try {
          const balance = await blockchainService.getBalance(wallet.publicKey)
          newBalances[wallet.publicKey] = balance.balance
        } catch (error) {
          console.error(`获取钱包余额失败: ${wallet.publicKey}`, error)
          newBalances[wallet.publicKey] = 0
        }
      }
      
      setBalances(newBalances)
    }
    
    if (wallets.length > 0) {
      fetchBalances()
    }
  }, [wallets])
  
  // 创建新钱包
  const createWallet = async () => {
    if (!newWalletLabel.trim()) {
      toast.error('请输入钱包标签')
      return
    }
    
    setLoading(true)
    
    try {
      const newWallet = await blockchainService.createWallet()
      setWallets([...wallets, { ...newWallet, label: newWalletLabel }])
      setNewWalletLabel('')
      toast.success('新钱包已创建')
    } catch (error) {
      console.error('创建钱包失败', error)
      toast.error('创建钱包失败')
    } finally {
      setLoading(false)
    }
  }
  
  // 手动添加钱包
  const addExistingWallet = () => {
    const publicKey = prompt('请输入公钥:')
    const privateKey = prompt('请输入私钥:')
    const label = prompt('请输入钱包标签:')
    
    if (!publicKey || !privateKey || !label) {
      toast.error('所有字段都是必需的')
      return
    }
    
    if (wallets.some(w => w.publicKey === publicKey)) {
      toast.error('这个钱包已经存在')
      return
    }
    
    setWallets([...wallets, { publicKey, privateKey, label }])
    toast.success('钱包已添加')
  }
  
  // 删除钱包
  const deleteWallet = (publicKey: string) => {
    if (confirm('确定要删除这个钱包吗？这个操作不可逆。')) {
      setWallets(wallets.filter(w => w.publicKey !== publicKey))
      toast.success('钱包已删除')
    }
  }
  
  // 复制到剪贴板
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type}已复制到剪贴板`)
  }
  
  // 切换显示/隐藏私钥
  const toggleShowPrivateKey = (publicKey: string) => {
    setShowPrivateKeys({
      ...showPrivateKeys,
      [publicKey]: !showPrivateKeys[publicKey]
    })
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">钱包管理</h1>
      </div>
      
      <Card title="创建新钱包" icon={<PlusIcon className="w-6 h-6" />} className="mb-6">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              钱包标签
            </label>
            <input
              type="text"
              value={newWalletLabel}
              onChange={(e) => setNewWalletLabel(e.target.value)}
              className="input w-full"
              placeholder="例如: 主钱包"
            />
          </div>
          <button
            onClick={createWallet}
            disabled={loading || !newWalletLabel.trim()}
            className="btn btn-primary h-10"
          >
            {loading ? '创建中...' : '创建钱包'}
          </button>
        </div>
        
        <div className="mt-4">
          <button
            onClick={addExistingWallet}
            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
          >
            导入现有钱包
          </button>
        </div>
      </Card>
      
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">我的钱包</h2>
      
      {wallets.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <WalletIcon className="w-12 h-12 mx-auto text-gray-400" />
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            您还没有钱包。创建一个新钱包开始使用!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {wallets.map((wallet) => (
            <Card
              key={wallet.publicKey}
              title={wallet.label}
              icon={<WalletIcon className="w-6 h-6" />}
              className="border border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">公钥 (地址):</p>
                  <div className="flex items-center mt-1">
                    <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded flex-1 overflow-x-auto">
                      {wallet.publicKey}
                    </code>
                    <button
                      onClick={() => copyToClipboard(wallet.publicKey, '公钥')}
                      className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <ClipboardIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">私钥:</p>
                  <div className="flex items-center mt-1">
                    <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded flex-1 overflow-x-auto">
                      {showPrivateKeys[wallet.publicKey] ? wallet.privateKey : '••••••••••••••••••••••••••••••••••'}
                    </code>
                    <button
                      onClick={() => toggleShowPrivateKey(wallet.publicKey)}
                      className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPrivateKeys[wallet.publicKey] ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(wallet.privateKey, '私钥')}
                      className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <ClipboardIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">余额:</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {balances[wallet.publicKey] !== undefined ? balances[wallet.publicKey] : '...'}
                  </p>
                </div>
                
                <button
                  onClick={() => deleteWallet(wallet.publicKey)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  删除钱包
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wallet