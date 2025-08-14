/**
 * Represents a campaign struct from the CrowdFundingFactory.sol smart contract.
 *
 * @description This type maps the Solidity Campaign struct to TypeScript for frontend usage.
 * It contains essential information about a crowdfunding campaign including addresses,
 * metadata, and creation timestamp.
 *
 * **Solidity Contract Reference:**
 * ```solidity
 * struct Campaign {
 *     address campaignAddress;
 *     address owner;
 *     string campaignName;
 *     uint256 createdAt;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Usage in React component
 * const campaign: CampaignType = {
 *   campaignAddress: "0x1234567890abcdef1234567890abcdef12345678",
 *   campaignOwnerAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
 *   campaignName: "Revolutionary Tech Startup",
 *   createdAt: "1692849600" // Unix timestamp
 * };
 *
 * // Accessing campaign data
 * console.log(`Campaign: ${campaign.campaignName}`);
 * console.log(`Owner: ${campaign.campaignOwnerAddress}`);
 * console.log(`Contract: ${campaign.campaignAddress}`);
 * ```
 *
 * @example
 * ```typescript
 * // Using with React state
 * const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
 *
 * // Filtering campaigns by owner
 * const userCampaigns = campaigns.filter(
 *   campaign => campaign.campaignOwnerAddress === userAddress
 * );
 * ```
 * @since 1.0.0
 * @public
 */
export type CampaignType = {
  /**
   * The deployed campaign contract address on the blockchain.
   * @example "0x1234567890abcdef1234567890abcdef12345678"
   */
  campaignAddress: string;

  /**
   * The Ethereum address of the campaign creator/owner.
   * @example "0xabcdef1234567890abcdef1234567890abcdef12"
   */
  campaignOwnerAddress: string;

  /**
   * The human-readable name of the campaign.
   * @example "Revolutionary Tech Startup"
   */
  campaignName: string;

  /**
   * Unix timestamp when the campaign was created (as string for precision).
   * @example "1692849600"
   */
  createdAt: string;
};
