import type { Metadata } from "next"
import { Vazirmatn } from "next/font/google"
import { Providers } from "@/components/providers"
import { Header } from "@/components/layout/Header"
import "./globals.css"

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-vazirmatn",
})

export const metadata: Metadata = {
  title: "Niora - همراه تراپیست هوشمند",
  description: "فضایی امن برای درد و دل و تراپی — هرچه می‌خواهد دل تنگت بگو",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} font-sans`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
