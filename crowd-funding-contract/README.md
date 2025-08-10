# 📜 CrowdFunding Smart Contracts

<div align="center">

![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)
![Foundry](https://img.shields.io/badge/Foundry-000000?style=for-the-badge&logo=ethereum&logoColor=white)
![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-4E5EE4?style=for-the-badge&logo=openzeppelin&logoColor=white)

**Secure, Gas-Optimized Smart Contracts for Decentralized Crowdfunding**

</div>

---

## 🏗️ Architecture Overview

The CrowdFunding smart contract system follows a **Factory Pattern** design, consisting of two main contracts:

### 🏭 CrowdFundingFactory
The main factory contract responsible for:
- Creating new crowdfunding campaigns
- Managing all campaigns globally
- Tracking user-specific campaigns
- Providing campaign discovery functionality

### 🎯 CrowdFunding
Individual campaign contracts that handle:
- Campaign lifecycle management
- Funding tiers and backer tracking
- Secure fund collection and withdrawal
- Refund mechanisms for failed campaigns
- Campaign pause/resume functionality

## 📋 Contract Features

### 🎯 CrowdFunding Contract Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🏁 **Campaign Creation** | Deploy individual campaigns with goals & deadlines | ✅ |
| 💰 **Tiered Funding** | Multiple funding levels with different rewards | ✅ |
| ⏰ **Time Management** | Automatic campaign state transitions | ✅ |
| 💸 **Secure Withdrawals** | Owner-only withdrawals after goal completion | ✅ |
| 🔄 **Automatic Refunds** | Smart refunds for failed campaigns | ✅ |
| ⏸️ **Pause/Resume** | Campaign control for owners | ✅ |
| 📈 **Real-time Status** | Live campaign status tracking | ✅ |
| 🔒 **Access Control** | OpenZeppelin Ownable integration | ✅ |

### 🏭 CrowdFundingFactory Contract Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🚀 **Campaign Deployment** | Deploy new CrowdFunding contracts | ✅ |
| 📊 **Global Campaign Registry** | Track all created campaigns | ✅ |
| 👤 **User Campaign Tracking** | Track campaigns by creator | ✅ |
| 🔍 **Campaign Discovery** | Query campaigns by various filters | ✅ |
| 🛡️ **Input Validation** | Comprehensive parameter validation | ✅ |

## 🏗️ Contract Structure

```
src/
├── 📄 CrowdFunding.sol          # Individual campaign contract
├── 📄 CrowdFundingFactory.sol   # Factory contract for campaign creation
```

## 📊 Contract Specifications

### CrowdFunding.sol

```solidity
// Core Functions
function fund(uint256 _tierIndex) external payable
function withdraw() external onlyOwner
function addTier(string memory _name, uint256 _amount) external onlyOwner
function removeTier(uint256 _index) external onlyOwner
function refund() external
function togglePause() external onlyOwner
function extendCampaignDeadline(uint256 _additionalDays) external onlyOwner

// View Functions
function getCampaignBalance() external view returns (uint256)
function getFundingTiers() external view returns (Tier[] memory)
function getCampaignStatus() external view returns (CampaignStatus)
function getCampaignName() external view returns (string memory)
// ... and more
```

### CrowdFundingFactory.sol

```solidity
// Core Functions
function createCampaign(
    string memory _name,
    string memory _description,
    uint256 _goal,
    uint256 _deadline
) external

// View Functions
function getAllCampaigns() external view returns (Campaign[] memory)
function getUserCampaigns(address _user) external view returns (Campaign[] memory)
```

## 🚀 Getting Started

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kavinda-100/CrowdFunding.git
   cd CrowdFunding/crowd-funding-contract
   ```

2. **Install dependencies**
   ```bash
   forge install
   ```

3. **Build contracts**
   ```bash
   forge build
   ```

### 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
forge test

# Run tests with gas reporting
forge test --gas-report

# Run specific test file
forge test --match-path test/unit/CrowdFundingTest.t.sol

# Run tests with coverage
forge coverage
```

## 📊 Test Coverage

### Overall Coverage Summary

| File | Lines | Statements | Branches | Functions | Status |
|------|-------|------------|----------|-----------|--------|
| **CrowdFunding.sol** | 🟢 **100%** (98/98) | 🟢 **100%** (76/76) | 🟢 **100%** (19/19) | 🟢 **100%** (24/24) | ✅ **Complete** |
| **CrowdFundingFactory.sol** | 🔴 **0%** (0/13) | 🔴 **0%** (0/10) | 🔴 **0%** (0/1) | 🔴 **0%** (0/4) | ⏳ **Pending** |
| **DeployCrowdFundingFactory.s.sol** | 🟢 **100%** (24/24) | 🟢 **100%** (24/24) | 🟢 **100%** (1/1) | 🟢 **100%** (2/2) | ✅ **Complete** |
| **Total Project** | 🟡 **90.37%** (122/135) | 🟡 **90.91%** (100/110) | 🟢 **95.24%** (20/21) | 🟡 **86.67%** (26/30) | 🎯 **Excellent** |

### CrowdFunding.sol - Detailed Test Coverage

#### 🎯 Core Functions (100% Coverage)

| Function | Test Cases | Coverage | Description |
|----------|------------|----------|-------------|
| `fund()` | 8 tests | 🟢 **100%** | Funding campaigns, tier validation, error cases |
| `withdraw()` | 3 tests | 🟢 **100%** | Owner withdrawals, goal checks, transfer failures |
| `refund()` | 4 tests | 🟢 **100%** | Failed campaign refunds, transfer failures |
| `addTier()` | 3 tests | 🟢 **100%** | Tier creation, validation, access control |
| `removeTier()` | 3 tests | 🟢 **100%** | Tier removal, validation, access control |
| `togglePause()` | 1 test | 🟢 **100%** | Pause/unpause functionality |
| `extendCampaignDeadline()` | 3 tests | 🟢 **100%** | Deadline extension, validation |

#### 🔍 View Functions (100% Coverage)

| Function | Test Cases | Coverage | Description |
|----------|------------|----------|-------------|
| `getCampaignBalance()` | Multiple | 🟢 **100%** | Contract balance queries |
| `getFundingTiers()` | 1 test | 🟢 **100%** | All tiers retrieval |
| `getFundingTierInfo()` | 2 tests | 🟢 **100%** | Individual tier info, error cases |
| `getTierCount()` | Multiple | 🟢 **100%** | Tier count validation |
| `getBackerAmount()` | Multiple | 🟢 **100%** | Backer contribution queries |
| `getBackerHasFundedTier()` | 2 tests | 🟢 **100%** | Tier funding status, error cases |
| `getCampaignStatus()` | Multiple | 🟢 **100%** | Status calculations |
| `getCampaignStatusRow()` | Multiple | 🟢 **100%** | Raw status queries |
| `getIsPaused()` | Multiple | 🟢 **100%** | Pause state queries |
| `getCampaignName()` | Multiple | 🟢 **100%** | Campaign name retrieval |
| `getCampaignDescription()` | Multiple | 🟢 **100%** | Campaign description retrieval |
| `getCampaignGoal()` | Multiple | 🟢 **100%** | Goal amount retrieval |
| `getCampaignDeadline()` | Multiple | 🟢 **100%** | Deadline retrieval |

#### 🛡️ Security & Edge Cases (100% Coverage)

| Scenario | Test Cases | Coverage | Description |
|----------|------------|----------|-------------|
| **Access Control** | 6 tests | 🟢 **100%** | Owner-only functions, unauthorized access |
| **Input Validation** | 5 tests | 🟢 **100%** | Invalid parameters, boundary conditions |
| **Time-based Logic** | 3 tests | 🟢 **100%** | Deadline enforcement, state transitions |
| **Transfer Failures** | 2 tests | 🟢 **100%** | ETH transfer failure scenarios |
| **Pause Functionality** | 2 tests | 🟢 **100%** | Paused state enforcement |
| **Campaign States** | 4 tests | 🟢 **100%** | Active, Successful, Failed states |

#### 📈 Test Statistics

- **Total Test Cases**: 32 tests
- **Test Files**: 2 files (`CrowdFundingTest.t.sol`, `CrowdFundingFactoryTest.t.sol`)
- **Average Gas Usage**: ~2.1M gas per test
- **Test Execution Time**: ~15ms total
- **All Tests Passing**: ✅ 100% success rate

### 📊 Gas Optimization

Generate gas snapshots to monitor gas usage:

```bash
forge snapshot
```

## 🚀 Deployment

### Local Deployment (Anvil)

1. **Start local blockchain**
   ```bash
   anvil
   ```

2. **Deploy factory contract**
   ```bash
   forge script script/DeployCrowdFundingFactory.s.sol --rpc-url http://localhost:8545 --private-key $PRIVATE_KEY --broadcast
   ```

### Testnet Deployment

1. **Set environment variables**
   ```bash
   export SEPOLIA_RPC_URL="your_sepolia_rpc_url"
   export PRIVATE_KEY="your_private_key"
   export ETHERSCAN_API_KEY="your_etherscan_api_key"
   ```

2. **Deploy to Sepolia**
   ```bash
   forge script script/DeployCrowdFundingFactory.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify
   ```

### 📄 Deployment Artifacts

The deployment script automatically generates a `deployment-summary.json` file containing:

```json
{
  "contract_name": "CrowdFundingFactory",
  "contract_address": "0x...",
  "deployment_timestamp": 1723190400,
  "block_number": 12345678,
  "chain_id": 1,
  "status": "deployed_successfully"
}
```

## 🔒 Security Features

### Access Control

- **OpenZeppelin Ownable**: Secure ownership management
- **Role-based Permissions**: Function-level access control
- **Input Validation**: Comprehensive parameter validation

### Economic Security

- **Reentrancy Protection**: Secure fund handling
- **Integer Overflow Protection**: Solidity 0.8+ built-in protection
- **Time-based Logic**: Secure deadline management

### Campaign Security

- **Pausable Campaigns**: Emergency stop functionality
- **Refund Mechanisms**: Automatic refunds for failed campaigns
- **Goal Verification**: Secure withdrawal conditions

## 📁 Project Structure

```md
crowd-funding-contract/
├── 📁 src/                      # Smart contracts
│   ├── CrowdFunding.sol
│   └── CrowdFundingFactory.sol
├── 📁 script/                   # Deployment scripts
│   └── DeployCrowdFundingFactory.s.sol
├── 📁 test/                     # Test files
│   └── unit/
│       ├── CrowdFundingTest.t.sol
│       └── CrowdFundingFactoryTest.t.sol
├── 📁 lib/                      # Dependencies
│   ├── forge-std/
│   └── openzeppelin-contracts/
├── 📄 foundry.toml              # Foundry configuration
└── 📖 README.md                 # This file
```

## ⚙️ Configuration

### foundry.toml

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
ffi = true
fs_permissions = [{ access = "read-write", path = "./" }]

remappings = ["@openzeppelin/contracts=lib/openzeppelin-contracts/contracts"]

[fuzz]
runs = 256
max_test_rejects = 65536

[invariant]
runs = 256
depth = 64
fail_on_revert = false
```

## 🛠️ Development Tools

| Tool | Purpose | Command |
|------|---------|---------|
| **Forge** | Testing Framework | `forge test` |
| **Cast** | Contract Interaction | `cast call` |
| **Anvil** | Local Blockchain | `anvil` |
| **Chisel** | Solidity REPL | `chisel` |

## 📚 Additional Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [OpenZeppelin Docs](https://docs.openzeppelin.com/)
- [Solidity Documentation](https://docs.soliditylang.org/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

Built with ❤️ using **Foundry and OpenZeppelin**

```bash
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>

### Cast
$ cast <subcommand>

### Help
$ forge --help
$ anvil --help
$ cast --help
```
