import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import Header from "@/components/layout/header";
export const metadata: Metadata = {
  title: "لینک شورتر — سرویس کوتاه کردن لینک",
  description: "لینک‌های خود را کوتاه کنید و مدیریت نمایید",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <Header />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
