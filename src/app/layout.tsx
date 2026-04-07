import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/AuthProvider";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#8b5cf6",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "EduSparring - AI Competitive Learning Platform",
  description: "Turn knowledge into competitive battles with AI-driven learning and global multiplayer sparring. Challenge opponents, climb the ranks, and master any subject.",
  keywords: ["EduSparring", "Education", "Learning", "Competition", "AI", "Gamification", "Quiz", "Battle", "Knowledge"],
  authors: [{ name: "EduSparring Team" }],
  icons: {
    icon: "/edusparring-logo.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EduSparring",
  },
  openGraph: {
    title: "EduSparring - AI Competitive Learning",
    description: "Turn knowledge into competitive battles with AI-driven learning",
    url: "https://edusparring.com",
    siteName: "EduSparring",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduSparring - AI Competitive Learning",
    description: "Turn knowledge into competitive battles with AI-driven learning",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
          <PWAInstallPrompt />
        </AuthProvider>
      </body>
    </html>
  );
}
