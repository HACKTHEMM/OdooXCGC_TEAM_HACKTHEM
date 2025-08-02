import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CivicTracker - Modern Civic Engagement Platform",
  description: "CivicTracker is a cutting-edge platform that empowers citizens to report municipal issues, track their resolution, and collaborate with local authorities using modern AI-driven tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function getThemePreference() {
                if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
                  return localStorage.getItem('theme');
                }
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              const isDark = getThemePreference() === 'dark';
              document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
            })();
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}
      >
        {children}
      </body>
    </html>
  );
}
