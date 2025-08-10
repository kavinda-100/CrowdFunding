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

4. **Check test coverage**

   ```bash
   cd crowd-funding-contract
   forge coverage
   ```

## 🧪 Testing & Coverage

### 📊 Comprehensive Test Coverage

The project maintains **100% test coverage** across all contracts with both unit and fuzz testing:

#### Coverage Summary

| File | Lines | Statements | Branches | Functions |
|------|-------|------------|----------|-----------|
| **CrowdFunding.sol** | 100% (98/98) | 100% (76/76) | 100% (19/19) | 100% (24/24) |
| **CrowdFundingFactory.sol** | 100% (15/15) | 100% (11/11) | 100% (1/1) | 100% (5/5) |
| **DeployCrowdFundingFactory.s.sol** | 100% (24/24) | 100% (24/24) | 100% (1/1) | 100% (2/2) |
| **Total** | 🎯 **100% (137/137)** | 🎯 **100% (111/111)** | 🎯 **100% (21/21)** | 🎯 **100% (31/31)** |

#### Test Structure

```md
test/
├── 📁 unit/                      # Unit tests (36 tests)
│   ├── CrowdFundingTest.t.sol    # Core contract tests (31 tests)
│   └── CrowdFundingFactoryTest.t.sol # Factory tests (5 tests)
└── 📁 fuzz/                      # Fuzz tests (4 tests)
    ├── CrowdFundingFuzzTest.t.sol # Contract fuzz tests (3 tests)
    └── CrowdFundingFactoryFuzzTest.t.sol # Factory fuzz tests (1 test)
```

#### Test Statistics

- **Total Tests**: 40 (100% passing)
- **Unit Tests**: 36 comprehensive tests
- **Fuzz Tests**: 4 property-based tests
- **Coverage**: 100% across all metrics

#### Test Categories

- **Core Functionality**: Campaign creation, funding, withdrawals, refunds
- **Access Control**: Owner-only functions, permission validation  
- **Edge Cases**: Invalid inputs, boundary conditions, failure scenarios
- **State Management**: Campaign status transitions, pause/resume functionality
- **Event Emissions**: Proper event logging for all state changes
- **Security Testing**: Transfer failures, reentrancy protection, input validation
- **Fuzz Testing**: Property-based testing with randomized inputs (258+ runs per test)

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

| Component | Status | Progress | Details |
|-----------|--------|----------|---------|
| 📜 Smart Contracts | ✅ Complete | 100% | Factory + Campaign contracts |
| 🧪 Contract Tests | ✅ Complete | 100% | 32 tests, full coverage |
| 🚀 Deployment Scripts | ✅ Complete | 100% | JSON deployment tracking |
| 🎨 Frontend UI | 📅 Planned | 0% | Next.js 15 + React 19 |
| 🔗 Web3 Integration | 📅 Planned | 0% | Wagmi + RainbowKit |
| 📖 Documentation | ✅ Complete | 100% | Comprehensive README files |

## 📊 Test Coverage Summary

### Smart Contract Testing

| Contract | Lines | Statements | Branches | Functions | Status |
|----------|-------|------------|----------|-----------|--------|
| **CrowdFunding.sol** | 🟢 **100%** | 🟢 **100%** | 🟢 **100%** | 🟢 **100%** | ✅ **Perfect** |
| **CrowdFundingFactory.sol** | 🟢 **100%** | 🟢 **100%** | 🟢 **100%** | 🟢 **100%** | ✅ **Perfect** |
| **Deployment Scripts** | 🟢 **100%** | 🟢 **100%** | 🟢 **100%** | 🟢 **100%** | ✅ **Perfect** |

### Test Statistics

- **Total Tests**: 40 test cases (36 unit + 4 fuzz)
- **Test Success Rate**: 100% (40/40 passing)
- **Coverage Achievement**: 100% across all contracts
- **Security Testing**: All edge cases and failure scenarios covered
- **Fuzz Testing**: Property-based testing with 258+ runs per test
- **Gas Optimization**: All functions gas-tested and optimized

### Coverage Highlights

✅ **Complete Coverage Areas:**
- All core functions (fund, withdraw, refund)
- All view functions and getters  
- Access control and security mechanisms
- Input validation and error handling
- Time-based logic and state transitions
- Transfer failure scenarios with helper contracts
- Event emission testing and validation
- Factory pattern deployment and management
- Fuzz testing with randomized inputs

📈 **Advanced Testing Features:**

- Property-based fuzz testing with bounded inputs
- Transfer failure simulation using helper contracts
- Comprehensive edge case and boundary testing
- Gas usage optimization and reporting
- Event emission verification and validation
- State transition consistency testing

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
