import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";

export function LoginForm({ className, ...props }) {
  const { address, isConnected } = useAccount();

  return (
    <div
      className={cn("flex flex-col gap-12 h-full min-h-screen", className)}
      {...props}
    >
      {!isConnected && (
        <div className="flex flex-col justify-center items-center h-screen px-6">
          <div className="max-w-xl space-y-8 font-bold text-muted-foreground">
            <p className="text-4xl">
              Airdrop ETH, ERC-20, ERC-721, and ERC-1155 tokens to your
              community
            </p>
            <div className="grid place-items-start">
              <ConnectButton label="Connect Your Wallet to Begin" />
            </div>
          </div>
        </div>
      )}

      {isConnected && (
        <div className="flex flex-col items-start justify-between px-6 md:px-20 h-screen">
          <div className="grid w-full place-items-center">
            <ConnectButton label="Connect Your Wallet to Begin" />
          </div>
          <div className="space-y-6 pb-20 text-muted-foreground max-w-xl">
            <div>
              <p className="text-3xl font-semibold">Let&apos;s get started</p>
              <p className="text-muted-foreground mt-2">
                Enter an ERC-20, ERC-721, ERC-1155 contract address:
              </p>
            </div>

            <Input
              className="h-12 rounded-xl text-lg placeholder:text-lg font-ibm-plex-mono"
              placeholder="0x..."
            />
            <div className="flex flex-col gap-1">
              <Link
                href={"/airdrop-eth"}
                className="font-ibm-plex-mono text-sm underline cursor-pointer hover:text-primary"
              >
                or airdrop ETH
              </Link>
              <Link
                href={"/deploy-erc20"}
                className="font-ibm-plex-mono text-sm underline cursor-pointer hover:text-primary"
              >
                or deploy an ERC-20 and airdrop it
              </Link>
              <Link
                href={"/verify-erc20"}
                className="font-ibm-plex-mono text-sm underline cursor-pointer hover:text-primary"
              >
                or check if a deployed contract is Bytecode20
              </Link>
            </div>
          </div>
          <div></div>
        </div>
      )}
    </div>
  );
}
