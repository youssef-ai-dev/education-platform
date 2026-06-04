import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "علم - منصة التعلم الإلكتروني",
  description: "منصة تعليمية إلكترونية متكاملة لتعلم المهارات الرقمية والمهنية باللغة العربية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased bg-background text-foreground min-h-screen">
        <AuthProvider>
          {children}
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
