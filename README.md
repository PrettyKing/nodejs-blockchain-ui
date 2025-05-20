# Node.js区块链前端界面

这是一个使用Vite、React、TypeScript和Tailwind CSS构建的区块链前端应用程序，用于与Node.js区块链后端交互。

## 技术栈

- Vite - 构建工具
- React - 前端框架
- TypeScript - 静态类型检查
- Tailwind CSS - 实用优先的CSS框架
- React Router - 路由管理
- Axios - HTTP客户端

## 功能特点

- 区块链浏览器 - 查看区块和交易
- 钱包管理 - 创建和管理钱包
- 交易创建 - 创建和签名交易
- 挖矿界面 - 触发区块挖掘
- 节点状态 - 查看网络状态

## 如何运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 后端API

该前端应用程序与[nodejs-blockchain](https://github.com/PrettyKing/nodejs-blockchain)项目的API进行交互，确保在启动前端之前已经启动了后端服务。