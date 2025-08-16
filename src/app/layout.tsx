import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

export const metadata: Metadata = {
  title: 'Codsach - Your Ultimate Coding Resource Hub',
  description: 'Clone of the Codsach landing page, featuring a vast collection of resources for developers and students.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='20' y1='20' x2='80' y2='80' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%234F46E5'/%3E%3Cstop offset='1' stop-color='%2350B4F2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='20' y='20' width='60' height='60' rx='12' stroke='url(%23a)' stroke-width='10' fill='none'/%3E%3Crect x='35' y='35' width='30' height='30' rx='6' stroke='%234F46E5' stroke-width='8' fill='none'/%3E%3C/svg%3E" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
          {children}
        <Toaster />
      </body>
    </html>
  );
}
