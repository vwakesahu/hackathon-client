"use client";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import React from "react";
import { useAccount, useBalance } from "wagmi";
import { useRouter } from "next/navigation";

const Page = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address: address });
  const router = useRouter();

  const formattedBalance = balance?.formatted
    ? parseFloat(balance.formatted).toFixed(2)
    : "0.00";

  return (
    <div className="min-h-screen h-full">
      <div className="flex flex-col justify-center items-start h-full px-6 md:px-20">
        <div className="flex gap-2 items-center">
          <ChevronDown
            className="rotate-90 cursor-pointer"
            onClick={() => router.back()}
          />
          <p className="text-2xl">Airdrop ETH</p>
        </div>

        <div className="mt-6 flex items-center flex-wrap gap-2">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-base text-muted-foreground hover:bg-transparent cursor-default"
          >
            ETH
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-base border-primary hover:bg-transparent cursor-default"
          >
            You have {formattedBalance} ETH
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
