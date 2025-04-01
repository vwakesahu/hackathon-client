"use client";
import React from "react";
import { ChevronLeft } from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import CSVUploadTable from "@/components/csv-upload-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const Page = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address: address });
  const router = useRouter();

  const formattedBalance = balance?.formatted
    ? parseFloat(balance.formatted).toFixed(4)
    : "0.0000";

  return (
    <div className="min-h-screen bg-background flex flex-col py-8 px-4 md:px-8 lg:px-12 max-w-6xl mx-auto">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-accent"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-medium">Airdrop ETH</h1>
        </div>
        <ConnectButton />
      </header>

      {/* Balance Card */}
      {address && (
        <Card className="mb-8 border-none shadow-sm bg-accent/20">
          <CardContent className="py-4 px-5 flex items-center gap-3">
            <Badge
              variant="outline"
              className="text-sm font-medium py-1.5 px-3"
            >
              ETH
            </Badge>
            <span className="text-sm text-muted-foreground">Available:</span>
            <span className="font-medium">{formattedBalance} ETH</span>
          </CardContent>
        </Card>
      )}

      {/* Main Content - CSV Upload Table */}
      <main className="flex-1">
        <CSVUploadTable />
      </main>
    </div>
  );
};

export default Page;
