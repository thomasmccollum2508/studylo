import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";

const inter = localFont({
  src: "../fonts/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-inter",
  weight: "100 900",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "StudyLo",
  description: "A Next.js application with TypeScript and TailwindCSS",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-gray-900`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
