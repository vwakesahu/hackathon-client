"use client";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import React from "react";
import { useAccount, useBalance } from "wagmi";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

const Page = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address: address });
  const router = useRouter();

  const formattedBalance = balance?.formatted
    ? parseFloat(balance.formatted).toFixed(2)
    : "0.00";

  return (
    <div className="min-h-screen h-full">
      <div className="flex flex-col w-full justify-center items-start h-full px-6 md:px-20">
        <div className="flex gap-2 items-center">
          <ChevronDown
            className="rotate-90 cursor-pointer"
            onClick={() => router.back()}
          />
          <p className="text-2xl">Verify Bytecode20 Deployment</p>
        </div>

        <div className="mt-6 flex items-center flex-wrap gap-2">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-base text-muted-foreground hover:bg-transparent cursor-default"
          >
            Ethereum
          </Button>
        </div>

        <div className="mt-4 w-full">
          <Input
            className="h-12 rounded-xl text-lg placeholder:text-lg font-ibm-plex-mono"
            placeholder="0x..."
          />
          <Button className='w-full mt-2 rounded-xl h-1/2 text-base'>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
