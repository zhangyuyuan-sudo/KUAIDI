# 快递比价系统

一个支持多快递公司的在线比价平台，帮助用户快速找到最优惠的快递服务。

## 功能特性

- **固定寄件信息**：寄件地址预设为公司地址（广东省深圳市南山区大族科技中心1110），寄件人：党娅琪，电话：18202797209
- **智能地址解析**：收件地址支持文本输入，自动解析省市区、收件人、电话
- **多数据源支持**：支持模拟数据和快递100真实数据切换
- **9家主流快递**：顺丰、中通、圆通、韵达、申通、极兔、EMS、德邦、京东
- **价格排序**：自动按价格从低到高排序，标记最低价
- **缓存机制**：相同查询条件5分钟内直接返回缓存结果

## 技术栈

### 前端
- Vue 3 + Vite
- Element Plus UI组件库
- Pinia 状态管理
- Vue Router 路由管理
- Axios HTTP客户端
- SCSS 样式预处理

### 后端
- Node.js + Express
- Joi 参数校验
- Winston 日志记录
- Node-cache 内存缓存
- Express-rate-limit 限流保护
- Puppeteer 网页抓取（预留）

## 项目结构

```
KUAIDI/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── app.js          # 应用入口
│   │   ├── config/         # 配置文件
│   │   │   ├── index.js    # 基础配置
│   │   │   └── courier.js  # 快递公司配置
│   │   ├── controllers/    # 控制器
│   │   │   └── courierController.js
│   │   ├── crawlers/       # 快递爬虫模块
│   │   │   ├── base.js     # 基础爬虫类
│   │   │   ├── sf.js       # 顺丰
│   │   │   ├── zt.js       # 中通
│   │   │   ├── yt.js       # 圆通
│   │   │   ├── yd.js       # 韵达
│   │   │   ├── st.js       # 申通
│   │   │   ├── jt.js       # 极兔
│   │   │   ├── ems.js      # EMS
│   │   │   ├── db.js       # 德邦
│   │   │   ├── jd.js       # 京东
│   │   │   └── index.js    # 爬虫导出
│   │   ├── data/           # 数据文件
│   │   │   └── address.json # 省市区数据
│   │   ├── middlewares/    # 中间件
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimit.js
│   │   │   └── validator.js
│   │   ├── routes/         # 路由
│   │   │   ├── index.js
│   │   │   └── courier.js
│   │   ├── services/       # 业务服务
│   │   │   ├── cacheService.js
│   │   │   ├── courierService.js
│   │   │   └── kuaidi100Service.js
│   │   └── utils/          # 工具函数
│   │       └── logger.js
│   ├── .env                # 环境变量
│   ├── package.json
│   └── logs/               # 日志目录
│
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── api/            # API接口
│   │   │   └── courier.js
│   │   ├── assets/         # 静态资源
│   │   │   └── styles/
│   │   ├── components/     # 组件
│   │   │   └── courier/
│   │   │       └── SearchForm.vue
│   │   ├── router/         # 路由配置
│   │   │   └── index.js
│   │   ├── stores/         # Pinia状态
│   │   │   └── courier.js
│   │   ├── utils/          # 工具函数
│   │   │   └── request.js
│   │   ├── views/          # 页面
│   │   │   ├── Home.vue
│   │   │   └── Result.vue
│   │   ├── App.vue
│   │   └── main.js
│   ├── .env                # 环境变量
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
# 后端依赖
cd backend
npm install

# 前端依赖
cd ../frontend
npm install
```

### 配置环境变量

#### 后端配置（backend/.env）
```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据源配置: mock | kuaidi100
DATA_SOURCE=mock

# 快递100配置（使用kuaidi100时需要填写）
KUaidi100_KEY=your_key_here
KUaidi100_CUSTOMER=your_customer_here
```

#### 前端配置（frontend/.env）
```env
VITE_API_BASE_URL=/api
```

### 启动服务

```bash
# 终端1：启动后端
cd backend
npm run dev

# 终端2：启动前端
cd frontend
npm run dev
```

### 访问应用

- 前端页面：http://localhost:5173
- 后端API：http://localhost:3000/api

## API接口文档

### 比价接口

**POST** `/api/courier/compare`

请求参数：
```json
{
  "senderProvince": "广东省",
  "senderCity": "深圳市",
  "senderDistrict": "南山区",
  "receiverProvince": "北京市",
  "receiverCity": "北京市",
  "receiverDistrict": "海淀区",
  "weight": 1,
  "dataSource": "mock"
}
```

响应数据：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "queryId": "q_xxx",
    "queryTime": "2024-01-01T00:00:00.000Z",
    "dataSource": "mock",
    "results": [
      {
        "courierCode": "zt",
        "courierName": "中通快递",
        "courierLogo": "/logos/zt.svg",
        "price": 12.00,
        "originalPrice": 12.00,
        "discount": "",
        "estimatedTime": "2-3天",
        "serviceType": "标准快递",
        "remark": "",
        "dataSource": "mock",
        "isLowest": true
      }
    ],
    "total": 9,
    "successCount": 9,
    "failCount": 0,
    "fromCache": false
  }
}
```

### 获取数据源列表

**GET** `/api/courier/data-sources`

响应数据：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    { "value": "mock", "label": "模拟数据（免费）", "available": true },
    { "value": "kuaidi100", "label": "快递100（真实数据）", "available": false }
  ]
}
```

### 获取省市区数据

**GET** `/api/courier/address/options`

### 健康检查

**GET** `/api/health`

## 数据源说明

### 模拟数据（mock）
- 无需配置，开箱即用
- 基于预设价格表计算
- 适合开发和演示

### 快递100（kuaidi100）
- 需要申请快递100 API密钥
- 提供真实快递价格
- 需配置 KEY 和 CUSTOMER

## 支持的快递公司

| 代码 | 名称 | 颜色 |
|------|------|------|
| sf | 顺丰速运 | #DC143C |
| zt | 中通快递 | #4169E1 |
| yt | 圆通速递 | #FF8C00 |
| yd | 韵达快递 | #FFD700 |
| st | 申通快递 | #32CD32 |
| jt | 极兔速递 | #FF4500 |
| ems | 邮政EMS | #228B22 |
| db | 德邦快递 | #4169E1 |
| jd | 京东快递 | #DC143C |

## 地址解析规则

系统支持智能解析以下格式的地址：

```
北京市海淀区中关村大街1号，收件人：张三，电话：13800138000
```

解析结果：
- 省份：北京市
- 城市：北京市
- 区县：海淀区
- 详细地址：中关村大街1号
- 收件人：张三
- 电话：13800138000

## 开发说明

### 添加新的快递公司

1. 在 `backend/src/crawlers/` 创建新的爬虫文件
2. 继承 `BaseCrawler` 类，实现 `getPrice` 方法
3. 在 `backend/src/crawlers/index.js` 导出
4. 在 `backend/src/config/courier.js` 添加配置

### 修改固定寄件信息

编辑 `frontend/src/components/courier/SearchForm.vue`：

```vue
<div class="sender-info-card">
  <div class="info-row">
    <span class="info-label">姓名：</span>
    <span class="info-value">新姓名</span>
  </div>
  <!-- 其他信息 -->
</div>
```

修改 `handleSubmit` 中的固定地址：

```javascript
const params = {
  senderProvince: '新省份',
  senderCity: '新城市',
  senderDistrict: '新区县',
  // ...
}
```

## 常见问题

### Q: 点击比价显示"查询失败请重试"
A: 
1. 检查后端服务是否启动
2. 检查前端代理配置是否正确
3. 查看后端日志获取详细错误信息

### Q: 快递100数据源显示"需配置"
A: 在 `backend/.env` 中配置 `KUaidi100_KEY` 和 `KUaidi100_CUSTOMER`

### Q: 地址解析失败
A: 确保地址包含完整的省市区信息，例如："北京市海淀区xxx"

### Q: 如何清空缓存
A: 重启后端服务或等待5分钟缓存自动过期

## 部署说明

### 生产环境构建

```bash
# 前端构建
cd frontend
npm run build

# 后端启动
cd backend
npm start
```

### Docker部署（可选）

```dockerfile
# Dockerfile示例
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 更新日志

### v1.0.0
- 初始版本发布
- 支持9家主流快递公司比价
- 支持模拟数据和快递100数据源
- 智能地址解析功能
- 固定寄件人信息

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎提交 Issue 或 Pull Request。
