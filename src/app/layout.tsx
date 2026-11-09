import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/components/diary/providers";
import "./globals.css";
export const metadata: Metadata = {
  title: "Mizzen · Diary Study",
  description:
    "Mizzen 日记法研究交互原型，Next.js / React / TypeScript / Tailwind / Zustand",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
