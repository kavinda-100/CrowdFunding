# ================================
# 🚀 PERSIST STATE COMMANDS
# ================================

# Start Anvil with state dumping (saves state when stopped)
# This command starts a fresh Anvil instance that will save its state to state.json when stopped
persist-state-dump:
	@echo "🔄 Starting Anvil with state persistence..."
	@echo "💾 State will be saved to state.json when you stop Anvil (Ctrl+C)"
	anvil --dump-state state.json

# Start Anvil and load previous state (if exists)
# This command loads a previously saved state from state.json
persist-state-load:
	@if [ -f "state.json" ]; then \
		echo "📂 Loading previous state from state.json..."; \
		anvil --load-state state.json --dump-state state.json; \
	else \
		echo "📝 No previous state found (state.json), starting fresh with state persistence..."; \
		anvil --dump-state state.json; \
	fi

# Clean state file
persist-state-clean:
	@if [ -f "state.json" ]; then \
		echo "🧹 Removing state.json..."; \
		rm state.json; \
		echo "✅ State file cleaned"; \
	else \
		echo "📝 No state file found to clean"; \
	fi

# Show state file info
persist-state-info:
	@if [ -f "state.json" ]; then \
		echo "📄 State file information:"; \
		ls -lh state.json; \
		echo "📊 File size: $$(du -h state.json | cut -f1)"; \
	else \
		echo "📝 No state file found"; \
	fi

# ================================
# 🚀 DEPLOYMENT COMMANDS
# ================================

# Load environment variables from .env file
include .env
export

# Deploy to local Anvil (requires anvil to be running)
deploy-local:
	forge script script/DeployCrowdFundingFactory.s.sol:DeployCrowdFundingFactory \
		--fork-url $(ANVIL_RPC_URL) \
		--private-key $(ANVIL_PRIVATE_KEY) \
		--broadcast

# Deploy to local Anvil with verification
deploy-local-verify:
	forge script script/DeployCrowdFundingFactory.s.sol:DeployCrowdFundingFactory \
		--fork-url $(ANVIL_RPC_URL) \
		--private-key $(ANVIL_PRIVATE_KEY) \
		--broadcast \
		--verify

# Deploy to Sepolia testnet (requires SEPOLIA_RPC_URL and PRIVATE_KEY env vars)
deploy-sepolia:
	@if [ -z "$(SEPOLIA_RPC_URL)" ] || [ -z "$(PRIVATE_KEY)" ]; then \
		echo "❌ Error: SEPOLIA_RPC_URL and PRIVATE_KEY environment variables must be set"; \
		echo "📝 Example: export SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY"; \
		echo "📝 Example: export PRIVATE_KEY=0x..."; \
		exit 1; \
	fi
	forge script script/DeployCrowdFundingFactory.s.sol:DeployCrowdFundingFactory \
		--fork-url $(SEPOLIA_RPC_URL) \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		--verify \
		--etherscan-api-key $(ETHERSCAN_API_KEY)

# ================================
# 🛠️  UTILITY COMMANDS
# ================================

# Check if Anvil is running
check-anvil:
	@echo "🔍 Checking if Anvil is running..."
	@curl -s -X POST -H "Content-Type: application/json" \
		--data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
		$(ANVIL_RPC_URL) > /dev/null 2>&1 \
		&& echo "✅ Anvil is running on $(ANVIL_RPC_URL)" \
		|| echo "❌ Anvil is not running on $(ANVIL_RPC_URL)"

# Show default Anvil accounts
show-anvil-accounts:
	@echo "🔑 Default Anvil Test Accounts:"
	@echo "Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
	@echo "Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
	@echo ""
	@echo "Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8"  
	@echo "Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
	@echo ""
	@echo "💡 Use Account #0 for ANVIL_PRIVATE_KEY in your .env file"

# Create .env template
create-env:
	@if [ ! -f .env ]; then \
		echo "📝 Creating .env template..."; \
		echo "# Anvil Local Development" > .env; \
		echo "ANVIL_RPC_URL=http://127.0.0.1:8545" >> .env; \
		echo "ANVIL_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" >> .env; \
		echo "" >> .env; \
		echo "# Sepolia Testnet (fill in your values)" >> .env; \
		echo "SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY" >> .env; \
		echo "PRIVATE_KEY=0xYOUR_PRIVATE_KEY" >> .env; \
		echo "ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY" >> .env; \
		echo "✅ .env file created! Please review and update the values."; \
	else \
		echo "⚠️  .env file already exists"; \
	fi

help:
	@echo "🌊 Ocean Token Deployment Commands:"
	@echo ""
	@echo "📦 State Management:"
	@echo "  make persist-state-dump       # Start Anvil with state persistence"
	@echo "  make persist-state-load       # Load previous state from state.json"
	@echo "  make persist-state-clean      # Clean state.json file"
	@echo "  make persist-state-info       # Show state.json file info"
	@echo ""
	@echo "🚀 Deployment:"
	@echo "  make deploy-local             # Deploy to local Anvil"
	@echo "  make deploy-local-verify      # Deploy to local Anvil with verification"
	@echo "  make deploy-sepolia           # Deploy to Sepolia testnet"
	@echo ""
	@echo "🛠️  Utilities:"
	@echo "  make check-anvil              # Check if Anvil is running"
	@echo "  make show-anvil-accounts      # Show default Anvil test accounts"
	@echo "  make create-env               # Create .env template file"
	@echo "  make help                     # Show this help message"
	@echo ""
	@echo "💡 Quick Start:"
	@echo "  1. make create-env            # Create .env file"
	@echo "  2. make persist-state-load    # Start Anvil with state persistence"
	@echo "  3. make deploy-local-verify   # Deploy contract"

.DEFAULT_GOAL := help

.PHONY: persist-state-dump persist-state-load persist-state-clean persist-state-info deploy-local deploy-local-verify deploy-sepolia check-anvil show-anvil-accounts create-env help