import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative">
          <div className="relative z-10 grid grid-cols-6 gap-3">
            {/* 1st Feature */}
            <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
              <CardContent className="pt-6">
                <div className="relative z-10 mt-6 space-y-2 text-center">
                  <h2 className="group-hover:text-secondary-950 text-lg font-medium transition dark:text-white">
                    End-to-End Privacy
                  </h2>
                  <p className="text-foreground">
                    Transactions are encrypted using zero-knowledge proofs and
                    secured via Espresso sequencing.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 2nd Feature */}
            <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
              <CardContent className="pt-6">
                <div className="relative z-10 mt-14 space-y-2 text-center">
                  <h2 className="text-lg font-medium transition">
                    Lightning-Fast Settlement
                  </h2>
                  <p className="text-foreground">
                    Finalize multi-chain transactions in seconds with seamless,
                    low-latency sequencing.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 3rd Feature */}
            <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
              <CardContent className="pt-6">
                <div className="relative z-10 mt-14 space-y-2 text-center">
                  <h2 className="text-lg font-medium transition">
                    Built for Teams & DAOs
                  </h2>
                  <p className="text-foreground">
                    Manage treasury, payroll, and fund distribution across
                    chains — easily and securely.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
