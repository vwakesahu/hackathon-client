import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, Loader2, ExternalLink } from "lucide-react";
import { useChainId } from "wagmi";

const TransactionDialog = ({
  open = false,
  onOpenChange,
  loadingMessage = "Please wait while we process your transaction...",
  successMessage = "Your transaction will be processed shortly!",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAllChains, setShowAllChains] = useState(false);
  const selectedChain = useChainId();

  const chains = [
    {
      id: "11155111",
      name: "Ethereum Sepolia",
      icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      explorerUrl:
        "https://sepolia.etherscan.io/address/0x34bE8237Da6CA79e3EFeB58aB8DC5dED20fb8E81#internaltx",
    },
    {
      id: "84532",
      name: "Base Sepolia",
      icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png",
      explorerUrl:
        "https://sepolia.basescan.org/address/0xb21eB381e46db59B57E6A495B8BA790809F459AE#internaltx",
    },
    {
      id: "80002",
      name: "Polygon Amoy",
      icon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
      explorerUrl:
        "https://amoy.polygonscan.com/address/0xF66182EB072fA7F2bf1a5542Bbc42fAFF85B42b5#internaltx",
    },
    {
      id: "421614",
      name: "Arbitrum Sepolia",
      icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",
      explorerUrl:
        "https://sepolia.arbiscan.io/address/0x16ffBE3A6d8B54D7fd7CE83CF63fE7521B6c5Ee2#internaltx",
    },
    {
      id: "11155420",
      name: "Optimism Sepolia",
      icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png",
      explorerUrl:
        "https://sepolia-optimism.etherscan.io/address/0x9e3BAF1809dbf8D202A27f70DDb458862fC1fAd5#internaltx",
    },
    {
      id: "5003",
      name: "Mantle Sepolia",
      icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/mantle/info/logo.png",
      explorerUrl:
        "https://explorer.sepolia.mantle.xyz/address/0x4AF371b2acF58f71c101a5736653b5e7431BEc47?tab=internal_txns",
    },
    {
      id: "534351",
      name: "Scroll Sepolia",
      icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/scroll/info/logo.png",
      explorerUrl:
        "https://sepolia.scrollscan.com/address/0x7d94481934900bcf06185ad36e0da70396127594#internaltx",
    },
  ];

  // Find current chain
  const currentChain =
    chains.find((chain) => chain.id === selectedChain) || chains[0];

  // Extract addresses from explorer URLs
  const getAddressFromExplorerUrl = (url) => {
    const addressMatch = url.match(/address\/(0x[a-fA-F0-9]+)/);
    return addressMatch ? addressMatch[1] : "Address not found";
  };

  // Simulate loading
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [open]);

  const toggleShowAllChains = () => {
    setShowAllChains(!showAllChains);
  };

  // Format address to show first 6 and last 4 characters
  const formatAddress = (address) => {
    if (address.length > 12) {
      return `${address.substring(0, 6)}...${address.substring(
        address.length - 4
      )}`;
    }
    return address;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center mb-2">
            <img
              src={currentChain.icon}
              alt={currentChain.name}
              className="w-6 h-6 mr-2"
            />
            <DialogTitle>{currentChain.name} Transaction</DialogTitle>
          </div>
          <DialogDescription>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p className="text-center">{loadingMessage}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center py-4">
                <div className="flex items-center justify-center bg-green-100 text-green-800 rounded-full p-2 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-center mb-4">{successMessage}</p>

                <div className="w-full text-center mt-2">
                  <button
                    onClick={toggleShowAllChains}
                    className="flex items-center justify-center text-sm text-blue-600 hover:underline cursor-pointer mx-auto mb-4"
                  >
                    {showAllChains ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Hide all chain addresses
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Show all chain addresses
                      </>
                    )}
                  </button>

                  {showAllChains && (
                    <div className="border rounded-md p-3 pt-0">
                      
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 px-1 w-1/3">Chain</th>
                            <th className="py-2 px-1 w-2/3">Address</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chains.map((chain) => (
                            <tr
                              key={chain.id}
                              className="border-b hover:text-black hover:bg-gray-50"
                            >
                              <td className="py-2 px-1">
                                <div className="flex hover:text-black items-center">
                                  <img
                                    src={chain.icon}
                                    alt={chain.name}
                                    className="w-4 h-4 mr-1"
                                  />
                                  <span
                                    className={
                                      chain.id === selectedChain
                                        ? "font-medium"
                                        : ""
                                    }
                                  >
                                    {chain.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2 px-1">
                                <a
                                  href={chain.explorerUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline break-all"
                                >
                                  {getAddressFromExplorerUrl(chain.explorerUrl)}
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
