import { NavLink } from 'react-router-dom'
import { 
  HomeIcon, 
  CubeIcon, 
  WalletIcon, 
  ArrowPathIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline'

interface SidebarProps {
  isConnected: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ isConnected }) => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          区块链应用
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          基于Node.js的区块链
        </p>
        
        <div className="mt-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isConnected 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {isConnected ? '已连接' : '未连接'}
          </div>
        </div>
      </div>
      
      <nav className="mt-4">
        <ul>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive ? 'bg-gray-100 dark:bg-gray-700 border-l-4 border-primary-500' : ''
                }`
              }
            >
              <HomeIcon className="w-5 h-5 mr-3" />
              仪表盘
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/blockchain" 
              className={({ isActive }) => 
                `flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive ? 'bg-gray-100 dark:bg-gray-700 border-l-4 border-primary-500' : ''
                }`
              }
            >
              <CubeIcon className="w-5 h-5 mr-3" />
              区块链
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/wallet" 
              className={({ isActive }) => 
                `flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive ? 'bg-gray-100 dark:bg-gray-700 border-l-4 border-primary-500' : ''
                }`
              }
            >
              <WalletIcon className="w-5 h-5 mr-3" />
              钱包
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/transaction" 
              className={({ isActive }) => 
                `flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive ? 'bg-gray-100 dark:bg-gray-700 border-l-4 border-primary-500' : ''
                }`
              }
            >
              <CurrencyDollarIcon className="w-5 h-5 mr-3" />
              交易
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/mining" 
              className={({ isActive }) => 
                `flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive ? 'bg-gray-100 dark:bg-gray-700 border-l-4 border-primary-500' : ''
                }`
              }
            >
              <ArrowPathIcon className="w-5 h-5 mr-3" />
              挖矿
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>版本 v0.0.1</p>
          <p className="mt-1">使用 React + TypeScript + Tailwind</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar