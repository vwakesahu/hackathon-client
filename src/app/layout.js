import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";
import { RainbowKitWrapper } from "@/rainbow-wallet/rainbow-provider";
import Main from "@/components/main";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ibm-plex-mono",
});

export const metadata = {
  title: "Gaslite Drop",
  description: "The most efficient airdrop tool",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <RainbowKitWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <>
              <Main>{children}</Main>
              <div className="text-balance py-12 text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </div>
            </>
          </ThemeProvider>
        </RainbowKitWrapper>
      </body>
    </html>
  );
}
