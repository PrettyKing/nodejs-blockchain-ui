import axios from 'axios'

const BASE_URL = 'https://blockchain-worker.chalee695469701.workers.dev'

// 定义类型
export interface Block {
  timestamp: number
  transactions: Transaction[]
  previousHash: string
  hash: string
  nonce: number
}

export interface Transaction {
  fromAddress: string | null
  toAddress: string
  amount: number
  timestamp: number
  signature?: string
}

export interface Blockchain {
  chain: Block[]
  pendingTransactions: Transaction[]
  length: number
}

export interface Wallet {
  privateKey: string
  publicKey: string
}

export interface Balance {
  address: string
  balance: number
}

export interface MiningResponse {
  message: string
  lastBlock: Block
}

export interface TransactionResponse {
  message: string
  transaction: Transaction
}

// API服务
class BlockchainService {
  // 获取区块链
  async getBlockchain(): Promise<Blockchain> {
    const response = await axios.get(`${BASE_URL}/blockchain`)
    return response.data
  }

  // 创建新钱包
  async createWallet(): Promise<Wallet> {
    const response = await axios.get(`${BASE_URL}/wallet/new`)
    return response.data
  }

  // 获取余额
  async getBalance(address: string): Promise<Balance> {
    const response = await axios.get(`${BASE_URL}/balance/${address}`)
    return response.data
  }

  // 创建交易
  async createTransaction(
    fromAddress: string,
    toAddress: string,
    amount: number,
    privateKey: string
  ): Promise<TransactionResponse> {
    const response = await axios.post(`${BASE_URL}/transaction`, {
      fromAddress,
      toAddress,
      amount,
      privateKey
    })
    return response.data
  }

  // 挖矿
  async mine(minerAddress: string): Promise<MiningResponse> {
    const response = await axios.post(`${BASE_URL}/mine`, {
      minerAddress
    })
    return response.data
  }
}

export default new BlockchainService()