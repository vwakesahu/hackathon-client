"use client";

import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Upload, Check, Trash2, Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { isAddress, getAddress, parseEther } from "viem";
import { CHAIN_ID_TO_NAME, chains } from "@/utils/constants";
import { ethers } from "ethers";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWalletClient,
  useWriteContract,
} from "wagmi";
import {
  DISBURSE_MULTISENDER_CONTRACT_ABI,
  DISBURSE_MULTISENDER_CONTRACT_ADDRESS,
  REMOTE_DEPOSIT_ADDRESSES,
  REMOTE_DEPOSIT_CONTRACT_ABI,
} from "@/utils/contracts";
import axios from "axios";

export default function CSVUploadTable() {
  const [csvData, setCsvData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const { address } = useAccount();
  const chainId = useChainId();

  const walletClient = useWalletClient();
  const publicClient = usePublicClient();
  const fileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChainId, setSelectedChainId] = useState("all");

  const rowsPerPage = 10;

  const { writeContractAsync } = useWriteContract();

  const getChainById = (id) => {
    const found = chains.find((chain) => chain.id === id);
    if (!found) {
      return {
        id,
        name: "Unsupported Chain",
        icon: "/chains/unsupported.png",
        unsupported: true,
      };
    }
    return found;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const options = {
          type: "array",
          raw: true,
          cellText: false,
          cellDates: false,
        };

        const data = new Uint8Array(e.target?.result);
        const workbook = XLSX.read(data, options);

        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Extract header and data rows
        const headers = jsonData[0];
        const dataRows = jsonData.slice(1);

        // Find column indices
        const addrIndex = headers.findIndex(
          (h) =>
            h.toLowerCase().includes("ethereum") ||
            h.toLowerCase().includes("address")
        );
        const amountIndex = headers.findIndex((h) =>
          h.toLowerCase().includes("amount")
        );
        const chainIndex = headers.findIndex((h) =>
          h.toLowerCase().includes("chain")
        );

        const transformedData = dataRows.map((row, index) => {
          let address = row[addrIndex];
          if (address) {
            address = address.toString();

            if (!address.startsWith("0x")) {
              if (/^[0-9.e+\-]+$/.test(address)) {
                address = `Invalid format: ${address} (should be 0x...)`;
              }
            }
          }

          const chainId = row[chainIndex]?.toString() || "";

          return {
            id: `${index}`,
            ethereum_address: address || "",
            amount: row[amountIndex]?.toString() || "",
            chainId: chainId,
          };
        });

        setCsvData(transformedData);
      } catch (error) {
        console.error("Error parsing file:", error);
        alert(
          "Error parsing file. Please make sure it is a valid CSV or Excel file."
        );
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleRename = () => {
    if (editItem && editField) {
      setCsvData(
        csvData.map((item) => {
          if (item.id === editItem.id) {
            return {
              ...item,
              [editField]: editValue,
            };
          }
          return item;
        })
      );
      setEditItem(null);
      setEditField(null);
    }
  };

  const handleDelete = (id) => {
    setCsvData(csvData.filter((item) => item.id !== id));
  };

  const startEdit = (item, field) => {
    setEditItem(item);
    setEditField(field);
    setEditValue(item[field]);
  };

  const handleChainChange = (id, newChainId) => {
    setCsvData(
      csvData.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            chainId: newChainId,
          };
        }
        return item;
      })
    );
  };

  const exportToCSV = () => {
    if (csvData.length === 0) return;

    // Convert data back to worksheet
    const worksheet = XLSX.utils.json_to_sheet(
      csvData.map(({ id, ...rest }) => rest) // Remove the id field
    );

    // Create workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    // Generate and download file
    XLSX.writeFile(workbook, "ethereum_transactions.xlsx");
  };

  const sendFromAnotherChain = async () => {
    const groupedByChain = {};

    csvData.forEach((item) => {
      const chainId = item.chainId || "0";
      const rawRecipient = item.ethereum_address;
      const amount = parseEther(item.amount || "0");

      if (!groupedByChain[chainId]) {
        groupedByChain[chainId] = {
          domainId: Number(chainId),
          recipients: [],
          amounts: [],
          total: 0n,
        };
      }

      // Validate and checksum the address using viem
      try {
        if (isAddress(rawRecipient)) {
          const recipient = getAddress(rawRecipient); // this corrects the checksum
          groupedByChain[chainId].recipients.push(recipient);
          groupedByChain[chainId].amounts.push(amount);
          groupedByChain[chainId].total += amount;
        }
      } catch (err) {
        console.warn("Invalid address skipped:", rawRecipient);
      }
    });

    // Final array construction
    const finalArrays = Object.values(groupedByChain).map((entry) => [
      entry.recipients,
      entry.amounts,
      entry.total,
      entry.domainId,
    ]);

    console.log("finalArrays", finalArrays);

    const grandTotal = Object.values(groupedByChain).reduce(
      (acc, entry) => acc + entry.total,
      0n
    );

    const chainName = CHAIN_ID_TO_NAME[chainId];
    const chainContractAddress = REMOTE_DEPOSIT_ADDRESSES[chainName];

    const hash = await writeContractAsync({
      abi: REMOTE_DEPOSIT_CONTRACT_ABI,
      address: chainContractAddress,
      functionName: "deposit",
      value: grandTotal,
    });
    console.log("hash:", hash);

    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
    });

    // if (receipt.status !== "success") {
    //   console.error("Transaction failed");
    //   return;
    // }

    console.log("receipt:", receipt);
    console.log({
      txId: hash,
      chainName: chainName,
      userAddress: address,
      intentType: "solver",
      distributions: finalArrays,
    });

    const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
      ["tuple(address[],uint256[],uint256,uint32)[]"],
      [finalArrays]
    );

    console.log("Encoded data:", encodedData);
    console.log("ChainName:", chainName);

    const { data } = await axios.post(
      "https://solver-server-sgre.vercel.app/solve",
      {
        txId: hash,
        chainName: chainName,
        userAddress: address,
        intentType: "solver",
        encodedData: encodedData,
      }
    );
  };

  // Function to handle submit button click and organize data by chainId
  const handleSubmit = async () => {
    if (chainId !== 28082002) {
      await sendFromAnotherChain();
    } else {
      if (csvData.length === 0) {
        alert("No data to submit. Please upload a CSV file first.");
        return;
      }

      const groupedByChain = {};

      csvData.forEach((item) => {
        const chainId = item.chainId || "0";
        const rawRecipient = item.ethereum_address;
        const amount = parseEther(item.amount || "0");

        if (!groupedByChain[chainId]) {
          groupedByChain[chainId] = {
            domainId: Number(chainId),
            recipients: [],
            amounts: [],
            total: 0n,
          };
        }

        // Validate and checksum the address using viem
        try {
          if (isAddress(rawRecipient)) {
            const recipient = getAddress(rawRecipient); // this corrects the checksum
            groupedByChain[chainId].recipients.push(recipient);
            groupedByChain[chainId].amounts.push(amount);
            groupedByChain[chainId].total += amount;
          }
        } catch (err) {
          console.warn("Invalid address skipped:", rawRecipient);
        }
      });

      // Final array construction
      const finalArrays = Object.values(groupedByChain).map((entry) => [
        entry.recipients,
        entry.amounts,
        entry.total,
        entry.domainId,
      ]);

      const grandTotal = Object.values(groupedByChain).reduce(
        (acc, entry) => acc + entry.total,
        0n
      );

      console.log(finalArrays);

      // Log data in required format
      console.log("Grouped transaction data:", finalArrays);

      const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["tuple(address[],uint256[],uint256,uint32)[]"],
        [finalArrays]
      );
      console.log("Encoded data:", encodedData);

      const hash = await writeContractAsync({
        abi: DISBURSE_MULTISENDER_CONTRACT_ABI,
        address: DISBURSE_MULTISENDER_CONTRACT_ADDRESS,
        functionName: "multiSendWithNativeEth",
        args: [encodedData],
        value: grandTotal,
      });
    }
  };

  const filteredData = csvData.filter((row) => {
    const matchesSearch =
      row.ethereum_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.amount.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesChain =
      selectedChainId === "all" || row.chainId === selectedChainId;

    return matchesSearch && matchesChain;
  });

  const totalBalance = filteredData.reduce((acc, row) => {
    try {
      return acc + parseFloat(row.amount || "0");
    } catch {
      return acc;
    }
  }, 0);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div>
      <div className="w-full mb-4 flex items-center justify-end">
        <Input
          placeholder="Search address or amount"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-64"
        />
      </div>
      <Card className="w-full mx-auto border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center justify-between gap-2">
            <p>Ethereum Transactions</p>
            <div className="text-sm text-muted-foreground">
              Total Amount: {totalBalance.toFixed(4)} ETH
            </div>
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="p-6">
          {csvData.length === 0 ? (
            <div className="flex items-center justify-center border border-dashed border-border rounded-lg p-10">
              <label
                htmlFor="csv-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-accent" />
                </div>
                <span className="text-sm font-medium mb-1">
                  Upload CSV or Excel File
                </span>
                <span className="text-xs text-muted-foreground">
                  CSV, XLS, XLSX supported
                </span>
                <Input
                  ref={fileInputRef}
                  id="csv-upload"
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {/* Move Button INSIDE the label */}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files
                </Button>
              </label>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <Select
                      value={selectedChainId}
                      onValueChange={(value) => {
                        setSelectedChainId(value);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by chain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">All Chains</SelectItem>
                          {chains.map((chain) => (
                            <SelectItem key={chain.id} value={chain.id}>
                              {chain.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {csvData.length} records loaded
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={exportToCSV}>
                    Export
                  </Button>
                  <Button size="sm" onClick={handleSubmit}>
                    <Check className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                </div>
              </div>

              <div className="rounded-md border pb-12 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Ethereum Address</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Chain</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((row) => {
                      const chain = getChainById(row.chainId);
                      return (
                        <TableRow key={row.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-xs">
                            {row.ethereum_address}
                          </TableCell>
                          <TableCell>{row.amount}</TableCell>
                          <TableCell>
                            {chain.unsupported ? (
                              <div className="text-sm text-red-600 font-semibold">
                                Unsupported Chain
                              </div>
                            ) : (
                              <Select
                                defaultValue={row.chainId}
                                onValueChange={(value) =>
                                  handleChainChange(row.id, value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select chain">
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={chain.icon}
                                        alt={chain.name}
                                        className="h-4 w-4"
                                      />
                                      {chain.name}
                                    </div>
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {chains.map((chain) => (
                                      <SelectItem
                                        key={chain.id}
                                        value={chain.id}
                                      >
                                        <div className="flex items-center gap-2">
                                          <img
                                            src={chain.icon}
                                            alt={chain.name}
                                            className="h-4 w-4"
                                          />
                                          {chain.name}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>

                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <Pencil className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Edit Transaction
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                          className="text-right"
                                          htmlFor="field-select"
                                        >
                                          Field
                                        </Label>
                                        <select
                                          id="field-select"
                                          className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                                          onChange={(e) =>
                                            startEdit(row, e.target.value)
                                          }
                                        >
                                          <option value="">Select field</option>
                                          <option value="ethereum_address">
                                            Ethereum Address
                                          </option>
                                          <option value="amount">Amount</option>
                                        </select>
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                          className="text-right"
                                          htmlFor="new-value"
                                        >
                                          New Value
                                        </Label>
                                        <Input
                                          id="new-value"
                                          value={editValue}
                                          onChange={(e) =>
                                            setEditValue(e.target.value)
                                          }
                                          className="col-span-3"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        type="button"
                                        onClick={handleRename}
                                      >
                                        Save changes
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>

                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDelete(row.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <div className="flex justify-center items-center mt-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of{" "}
                    {Math.ceil(filteredData.length / rowsPerPage)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) =>
                        p < Math.ceil(filteredData.length / rowsPerPage)
                          ? p + 1
                          : p
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(filteredData.length / rowsPerPage)
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
