export const HYPERLANE_DOMAIN_IDS = {
  baseSepolia: 84532,
  arbitrumSepolia: 421614,
  mantleSepolia: 5003,
  amoy: 80002,
  scrollSepolia: 534351,
  sepolia: 11155111,
  optimismSepolia: 11155420,
};

export const CHAIN_ID_TO_NAME = {
  11155111: "sepolia",
  84532: "baseSepolia",
  43113: "fuji",
  80002: "amoy",
  421614: "arbitrumSepolia",
  58008: "disburse",
  11155420: "optimismSepolia",
  59141: "lineaSepolia",
  5003: "mantleSepolia",
  534351: "scrollSepolia",
};

export const chains = [
  {
    id: "11155111",
    name: "Ethereum Sepolia",
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    id: "84532",
    name: "Base Sepolia",
    icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png",
  },
  {
    id: "80002",
    name: "Polygon Amoy",
    icon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  },
  {
    id: "421614",
    name: "Arbitrum Sepolia",
    icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",
  },
  {
    id: "58008",
    name: "Disburse",
    icon: "/chains/disburse.png",
  },
  {
    id: "11155420",
    name: "Optimism Sepolia",
    icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png",
  },
  {
    id: "5003",
    name: "Mantle Sepolia",
    icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/mantle/info/logo.png",
  },
  {
    id: "534351",
    name: "Scroll Sepolia",
    icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/scroll/info/logo.png",
  },
];
