# Heritcoin Identity

English | [中文](README.zh.md)

AI-powered coin and antique identification skills for Claude Code / OpenCode.

## 功能特性

- 🪙 **硬币识别** - 识别古钱币、纪念币、机制币，获取详细的鉴定信息
- 💰 **实时估价** - 提供硬币的市场估值参考
- 🔍 **多语言支持** - 支持中文、英文、日语、韩语、俄语、西班牙语等多语言识别
- 📱 **便捷交互** - 支持图片 URL 和本地文件上传

## 快速开始

### 前置要求

- 可直接运行 `.ts` 脚本的 `node`
- 能够运行 `npx` 命令

### 安装 Skills

```bash
# 通过 OpenCode 安装
npx skills add heritcoin/heritcoin-identity

# 或直接安装指定 skill
npx skills add heritcoin/heritcoin-identity --skill heritcoin-recognizer
```

## Available Skills

### 🪙 heritcoin-recognizer

硬币、古钱币、纪念币识别专家。自动识别硬币并返回详细信息和市场估价。

**功能**:

- 硬币正反面图像识别
- 详细鉴定信息（国家/地区、面值、铸造年份、材质、铸造量等）
- Krause 编号查询
- 物理特征数据（直径、厚度、重量）
- 市场估价参考

**使用方式**:

```bash
# 方式一：提供图片 URL
/heritcoin-recognizer https://example.com/coin-obverse.jpg https://example.com/coin-reverse.jpg

# 方式二：提供本地图片路径
/heritcoin-recognizer /path/to/obverse.jpg /path/to/reverse.jpg

# 方式三：直接上传图片让 AI 识别
/heritcoin-recognizer
```

内部执行路径已经收敛为两步：

1. `node resolve-request.ts`
2. `node recognize.ts <img1> <img2> --locale <locale>`

**识别结果示例**:

```
🎫 识别结果

💰 估值: $3.50 USD

名称: Poland 50 groszy 1987-MW
年份: 1987
国家/地区: Poland
面值: 50 groszy

铸造量: 22,000,000

⸻

📐 详细信息

Krause编号: KM#95
材质: Copper-nickel

直径: 17.5mm
厚度: 1.2mm
重量: 2.4g

正面: Eagle with crown, Poland inscription
背面: 50 value, wheat ears
```

## 项目结构

```
heritcoin-identity/
├── skills/
│   └── heritcoin-recognizer/
│       ├── SKILL.md              # Skill 定义文件
│       ├── scripts/
│       │   ├── resolve-request.ts # 对话任务解析脚本
│       │   ├── recognize.ts      # 纯识别脚本
│       │   ├── package.json
│       │   ├── tsconfig.json
│       │   └── i18n/             # 多语言支持
│       └── evals/
│           └── evals.json         # 评估测试用例
└── README.md
```

## 技术细节

### 开发命令

```bash
cd skills/heritcoin-recognizer/scripts
node resolve-request.ts
node recognize.ts <img1> <img2> --locale zh-CN
```

如需本地类型检查：

```bash
cd skills/heritcoin-recognizer/scripts
npm install
npm run typecheck
```

## 相关链接

- [Heritcoin 官网](https://www.heritcoin.com)
- [OpenCode 文档](https://opencode.ai)

## 许可证

MIT License
