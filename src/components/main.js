"use client";
import { LeftSidebar } from "@/components/LeftSidebar";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";

const Main = ({ children }) => {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/app/airdrop-eth") {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-2 min-h-screen"
    >
      <LeftSidebar />
      <div className="p-4 h-full">{children}</div>
    </motion.div>
  );
};

export default Main;
