import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const logoSvg = `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="20" y="20" width="60" height="60" rx="12" stroke="url(#paint0_linear_logo_favicon)" stroke-width="10"/>
<rect x="35" y="35" width="30" height="30" rx="6" stroke="#50B4F2" stroke-width="8"/>
<defs>
<linearGradient id="paint0_linear_logo_favicon" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
<stop stop-color="#7950F2"/>
<stop offset="1" stop-color="#50B4F2"/>
</linearGradient>
</defs>
</svg>`;

const faviconDataUrl = `data:image/svg+xml;base64,${btoa(logoSvg)}`;


export const metadata: Metadata = {
  title: 'Codsach - Your Ultimate Coding Resource Hub',
  description: 'Clone of the Codsach landing page, featuring a vast collection of resources for developers and students.',
  icons: {
    icon: faviconDataUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
