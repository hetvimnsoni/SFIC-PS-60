import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { FilterProvider } from "@/context/FilterContext";

export const metadata: Metadata = {
  title: "ShikshaSetu AI | Smart Learning Gap Tracking & Remedial Action System",
  description:
    "Smart tracking and Remedial action system for student learning gaps in primary schools. SFIC Gujarat Hackathon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        <LanguageProvider>
          <AuthProvider>
            <FilterProvider>{children}</FilterProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
