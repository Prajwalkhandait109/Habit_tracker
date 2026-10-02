import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: "Winter Arc",
  title: "Winter Arc | Habit Tracker",
  description: "A focused habit tracker for your Winter Arc. Build consistency from October through February.",
  icons: {
    icon: [{ url: "/winter-arc-mark.svg", type: "image/svg+xml" }],
    shortcut: ["/winter-arc-mark.svg"],
  },
  openGraph: {
    title: "Winter Arc | Habit Tracker",
    description: "Build consistency from October through February with Winter Arc.",
    siteName: "Winter Arc",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Winter Arc | Habit Tracker",
    description: "Build consistency from October through February with Winter Arc.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0f1a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
