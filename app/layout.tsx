import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "300"
});

export const metadata: Metadata = {
  title: "AChat",
  description: "A GenAI based chatting agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.className}>
      <body
        className={`antialiased bg-slate-950 h-screen w-full`}
      >
        {children}
      </body>
    </html>
  );
}
