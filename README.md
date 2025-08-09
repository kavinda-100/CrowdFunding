# 🚀 CrowdFunding DApp

<div align="center">

![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)
![Foundry](https://img.shields.io/badge/Foundry-000000?style=for-the-badge&logo=ethereum&logoColor=white)

**A decentralized crowdfunding platform built on Ethereum** 💰

*Empowering creators and supporting innovators through blockchain technology*

</div>

---

## 🌟 Overview

The CrowdFunding DApp is a comprehensive decentralized application that enables users to create, fund, and manage crowdfunding campaigns on the Ethereum blockchain. Built with cutting-edge Web3 technologies, it provides a trustless, transparent, and secure platform for fundraising.

### ✨ Key Features

- 🏭 **Factory Pattern**: Efficient campaign creation and management
- 🎯 **Funding Tiers**: Flexible reward-based funding levels
- ⏰ **Time-based Campaigns**: Deadline-driven funding cycles
- 💸 **Automatic Refunds**: Smart contract-enforced refund mechanism
- 🔒 **Secure Withdrawals**: Owner-only fund access upon goal completion
- ⏸️ **Campaign Control**: Pause/resume functionality for campaign owners
- 📊 **Real-time Tracking**: Live campaign status and funding progress

## 🏗️ Project Structure

```md
crowd-funding/
├── 📁 crowd-funding-contract/    # Smart contracts & tests
│   ├── 📄 src/                   # Solidity contracts
│   ├── 📄 test/                  # Contract tests
│   ├── 📄 script/                # Deployment scripts
│   └── 📖 README.md              # Contract documentation
├── 📁 crowd-funding-ui/          # Frontend (Coming Soon)
│   └── 📖 README.md              # UI documentation
└── 📖 README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- [Git](https://git-scm.com/)
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Bun](https://bun.sh/) (for frontend - coming soon)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/kavinda-100/CrowdFunding.git
   cd CrowdFunding
   ```

2. **Setup smart contracts**

   ```bash
   cd crowd-funding-contract
   forge install
   forge build
   ```

3. **Run tests**

   ```bash
   forge test
   ```

## 🔧 Components

### 📊 Smart Contracts

The backbone of our platform, built with Solidity and deployed on Ethereum.

**[📖 View Contract Documentation](./crowd-funding-contract/README.md)**

- Factory pattern for efficient campaign management
- Comprehensive test suite with Foundry
- Gas-optimized implementation
- Security-first approach

### 🎨 Frontend (Coming Soon)

A modern, responsive web interface built with the latest technologies.

**[📖 View UI Documentation](./crowd-funding-ui/README.md)** *(Coming Soon)*

- Next.js 15 with React 19
- TypeScript for type safety
- TailwindCSS & ShadCN UI for styling
- Wagmi & RainbowKit for Web3 integration
- Bun.js runtime for performance

## 🛠️ Technology Stack

<div align="center">

| Layer | Technology |
|-------|------------|
| **Blockchain** | Ethereum, Solidity ^0.8.24 |
| **Development** | Foundry, OpenZeppelin |
| **Testing** | Forge, Gas Snapshots |
| **Frontend** | Next.js 15, React 19, TypeScript *(Coming Soon)* |
| **Styling** | TailwindCSS, ShadCN UI *(Coming Soon)* |
| **Web3** | Wagmi, RainbowKit *(Coming Soon)* |
| **Runtime** | Bun.js *(Coming Soon)* |

</div>

## 📋 Development Status

| Component | Status | Progress |
|-----------|--------|----------|
| 📜 Smart Contracts | ✅ Complete | 100% |
| 🧪 Contract Tests | 🔄 In Progress | 30% |
| 🚀 Deployment Scripts | ✅ Complete | 100% |
| 🎨 Frontend UI | 📅 Planned | 0% |
| 🔗 Web3 Integration | 📅 Planned | 0% |
| 📖 Documentation | ✅ Complete | 100% |

### 📝 Development Guidelines

- Follow Solidity best practices
- Write comprehensive tests
- Update documentation
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Kavinda Rathnayake

- GitHub: [@kavinda-100](https://github.com/kavinda-100)

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries
- [Foundry](https://book.getfoundry.sh/) for excellent development tooling
- [Ethereum](https://ethereum.org/) for the decentralized platform

---

<div align="center">

- **Built with ❤️ for the decentralized future**

⭐ *If you found this project helpful, please give it a star!* ⭐

</div>
