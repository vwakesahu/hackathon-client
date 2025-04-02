import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "@/components/hero9-header";
import { ChevronRight } from "lucide-react";
import Demo from "./demo";

export default function HeroSection() {
  const [open, setOpen] = useState(false);
  return (
    <div className="max-h-screen overflow-y-hidden">
      <HeroHeader />
      <main className="overflow-x-hidden">
        <section>
          <div className="py-24 md:pb-32 lg:pb-36">
            <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
              <div className="flex flex-col lg:flex-row items-center lg:items-center gap-12">
                {/* Left Content */}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="max-w-2xl text-balance text-5xl md:text-6xl xl:text-7xl">
                    One-Click Cross-Chain Payments
                  </h1>
                  <p className="mt-8 max-w-2xl text-balance text-lg">
                    Send assets across multiple chains instantly using
                    Espresso’s fast and private infrastructure.
                  </p>

                  <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                    <Button
                      asChild
                      size="lg"
                      className="h-12 bg-accent hover:bg-accent/80 text-black rounded-full pl-5 pr-3 text-base"
                    >
                      <Link href="/app/airdrop-eth">
                        <span className="text-nowrap">Explore App</span>
                        <ChevronRight className="ml-1" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="ghost"
                      className="h-12  rounded-full px-5 text-base hover:bg-zinc-950/5 dark:hover:bg-white/5 hover:text-foreground"
                      onClick={() => setOpen(true)}
                    >
                      <span className="text-nowrap">Watch Demo</span>
                    </Button>
                  </div>
                </div>

                {/* Right Image */}
                <div className="hidden lg:flex flex-1 justify-center items-center">
                  <img
                    src="/image.png"
                    alt="Payment illustration"
                    className="rounded-3xl w-[500px] xl:w-[600px] mix-blend-lighten"
                  />
                </div>
              </div>
            </div>

            <Demo showVideo={open} setShowVideo={setOpen} />

            {/* Background Video */}
            {/* <div className="aspect-2/3 absolute inset-1 -z-10 overflow-hidden rounded-3xl border border-black/10 lg:aspect-video lg:rounded-[3rem] dark:border-white/5">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="size-full -scale-x-100 object-cover opacity-50 invert dark:opacity-35 dark:invert-0 dark:lg:opacity-75"
                src="https://res.cloudinary.com/dg4jhba5c/video/upload/v1741605033/dna_ttplyu.mp4"
              ></video>
            </div> */}
          </div>
        </section>
      </main>
    </div>
  );
}
