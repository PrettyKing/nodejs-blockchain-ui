## 区块链前端应用

这是一个使用Vite、React、TypeScript和Tailwind CSS构建的区块链前端应用程序，用于与Node.js区块链后端交互。

![应用截图](https://source.unsplash.com/random/1200x600/?blockchain)

## 项目特点

- **现代UI**: 使用Tailwind CSS构建响应式界面
- **完整功能**: 包含区块链浏览、钱包管理、交易创建、挖矿等功能
- **状态管理**: 使用React Hooks管理组件状态
- **类型安全**: 使用TypeScript确保代码质量
- **API集成**: 与区块链后端API无缝集成

## 功能页面

- **仪表盘**: 概览区块链状态和最新区块
- **区块链浏览器**: 查看区块链中的所有区块和交易
- **钱包管理**: 创建、导入和管理钱包
- **交易创建**: 在钱包之间发送交易
- **挖矿界面**: 处理待处理交易并获取奖励

## 技术栈

- **Vite**: 快速的前端构建工具
- **React**: 用于构建用户界面的JavaScript库
- **TypeScript**: JavaScript的超集，提供类型安全
- **Tailwind CSS**: 实用优先的CSS框架
- **Axios**: 用于API请求的HTTP客户端
- **React Router**: 页面路由管理
- **React Toastify**: 提供友好的通知
- **Heroicons**: 美观的SVG图标

## 与后端集成

此前端应用设计为与[nodejs-blockchain](https://github.com/PrettyKing/nodejs-blockchain)后端一起工作。它通过API与区块链进行交互，包括：

- 获取区块链数据
- 创建和管理钱包
- 发送交易
- 挖掘新区块

## 如何运行

1. 确保已启动区块链后端服务器
2. 克隆仓库
3. 安装依赖
   ```bash
   npm install
   ```
4. 启动开发服务器
   ```bash
   npm run dev
   ```
5. 打开浏览器访问 http://localhost:3000

## 构建生产版本

```bash
npm run build
```

## 本地存储

应用使用浏览器的localStorage存储：
- 钱包信息
- 交易历史
- 挖矿记录

## 贡献

欢迎提交问题和拉取请求。

## 许可证

MIT