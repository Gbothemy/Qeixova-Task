import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qeixova — Earn by Doing",
  description: "Complete tasks, earn real money. Social media, surveys, app testing and more.",
  icons: {
    icon: "/qeixova-icon.png",
    apple: "/qeixova-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1AEF22" />
      </head>
      <body>{children}</body>
    </html>
  );
}
