/**
 * Smart contract addresses for different networks
 */

export const CONTRACT_ADDRESSES = {
  // Mainnet addresses
  MAINNET: {
    CROWD_FUNDING_FACTORY: "0x0000000000000000000000000000000000000000",
  },

  // Testnet addresses (Sepolia)
  SEPOLIA: {
    CROWD_FUNDING_FACTORY: "0x0000000000000000000000000000000000000000",
  },

  // Local development (Anvil)
  ANVIL: {
    CROWD_FUNDING_FACTORY: "0x5fbdb2315678afecb367f032d93f642f64180aa3", // Common anvil address
  },
} as const;

/**
 * Get contract address for current network
 * @param chainId - The chain ID
 * @returns Contract addresses for the chain
 */
export const getContractAddress = (chainId: number) => {
  switch (chainId) {
    case 1: // Mainnet
      return CONTRACT_ADDRESSES.MAINNET;
    case 11155111: // Sepolia
      return CONTRACT_ADDRESSES.SEPOLIA;
    case 31337: // Anvil
      return CONTRACT_ADDRESSES.ANVIL;
    default:
      return CONTRACT_ADDRESSES.ANVIL; // Default to local
  }
};
