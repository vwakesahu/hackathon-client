"use client";
import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <div className="text-balance py-12 text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
      With love from{" "}
      <a target="_blank" href="https://x.com/devswayam">
        Swayam
      </a>{" "}
      and{" "}
      <a target="_blank" href="https://x.com/vwakesahu">
        Vivek
      </a>
      .
    </div>
  );
};

export default Footer;
