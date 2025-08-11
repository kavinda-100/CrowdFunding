import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { ThemeProvider } from "@/providers/ThemeProvider";
import WebThreeProvider from "@/providers/WebThreeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Crowd Funding",
  description: "A decentralized platform for crowdfunding",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable}`}
      suppressHydrationWarning={true}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <WebThreeProvider>
            <main className="mx-auto flex min-h-screen w-full max-w-[2000px] flex-col px-4">
              <Header />
              {children}
              <Footer />
            </main>
          </WebThreeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
