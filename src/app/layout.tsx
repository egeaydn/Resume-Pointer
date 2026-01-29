import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CVScorer - Free CV Analysis Tool",
  description: "Get instant feedback on your resume with our free, rule-based CV scoring system. Upload your CV and receive a detailed analysis in seconds.",
  keywords: ["CV scorer", "resume analysis", "CV feedback", "resume checker", "ATS optimization", "job application"],
  authors: [{ name: "CVScorer Team" }],
  openGraph: {
    title: "CVScorer - Free CV Analysis Tool",
    description: "Get instant feedback on your resume with our free, rule-based CV scoring system.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVScorer - Free CV Analysis Tool",
    description: "Get instant feedback on your resume with our free, rule-based CV scoring system.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-white text-gray-900 flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
