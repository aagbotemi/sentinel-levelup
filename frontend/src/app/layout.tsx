import type { Metadata } from "next";
import "./globals.css";
import CustomLayout from "@/templates/CustomLayout";

export const metadata: Metadata = {
  title: "Sentinel",
  description: "Sentinel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CustomLayout>{children}</CustomLayout>;
}
