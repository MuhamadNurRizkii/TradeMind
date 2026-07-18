import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "./ui/fonts";

export const metadata: Metadata = {
  title: "TradeMind | Jurnal Trading untuk Trader yang Ingin Berkembang",
  description:
    "Semua histori trading Anda dalam satu tempat. Evaluasi strategi, pantau performa, dan bangun kebiasaan trading yang lebih konsisten.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.className} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
