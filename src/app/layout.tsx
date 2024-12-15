import type { Metadata } from "next";
import localFont from "next/font/local";
import "react-datepicker/dist/react-datepicker.css";
import { Toaster } from "react-hot-toast";
import DashboardWrapper from "./dashboardWrapper";
import "./globals.css";
import { AuthorizationWrapper } from "./(components)/AuthorizationWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MPP Pangkalpinang",
  description: "Admin MPP Pangkalpinang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DashboardWrapper>{children}</DashboardWrapper>
        <Toaster />
      </body>
    </html>
  );
}
