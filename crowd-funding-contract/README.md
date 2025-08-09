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
