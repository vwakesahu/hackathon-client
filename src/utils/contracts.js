import multisenderAbi from "@/abis/mutisender-abi.json";
export const DISBURSE_MULTISENDER_CONTRACT_ADDRESS =
  "0xf1B32Cdbb40B8F0fCaE4E0b2794f38A3808fF640";
export const DISBURSE_MULTISENDER_CONTRACT_ABI = multisenderAbi;

import remoteDepositAbi from "@/abis/remote-deposit-abi.json";
export const REMOTE_DEPOSIT_ADDRESSES = {
  baseSepolia: "0x632938C9Fe97346d6fbE34b9E60ccd04a91070AF",
  arbitrumSepolia: "0xcbBD5FaFFf40bc16df0085ba18202E035050e727",
  mantleSepolia: "0x9aed293AFe991DA13E9Ee27dF65f061b86eeB87e",
  amoy: "0x7c3482CcAE5090e1C72a0407085d52e15f44974D",
  scrollSepolia: "0x53Ea58e0956b308f0812016D3c606f08f2872BDa",
  sepolia: "0x495882C3180a8f08E5722e57ff41d301FE53B787",
  optimismSepolia: "0x694B980d92b1b2fdB150d2fa3A6Adeb05B5f3f87",
};
export const REMOTE_DEPOSIT_CONTRACT_ABI = remoteDepositAbi;
