
import Link from 'next/link';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Logo = () => (
  <div className="relative w-8 h-8 group-hover:scale-110 transition-transform">
    <svg className="absolute w-full h-full animate-[spin_5s_linear_infinite]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" rx="12" stroke="url(#paint0_linear_logo_footer)" strokeWidth="10"/>
        <defs>
            <linearGradient id="paint0_linear_logo_footer" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="hsl(var(--primary))"/>
                <stop offset="1" stopColor="#50B4F2"/>
            </linearGradient>
        </defs>
    </svg>
    <svg className="absolute w-full h-full animate-[spin_4s_linear_infinite_reverse]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="35" width="30" height="30" rx="6" stroke="hsl(var(--primary))" strokeWidth="8"/>
    </svg>
  </div>
);

const AndroidLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8L16 6a2 2 0 00-2-2H10a2 2 0 00-2 2v2"/><path d="M12 18h.01"/><path d_s_original="M5 10v9a2 2 0 002 2h10a2 2 0 002-2v-9"/><path d="M10.4 12a2.3 2.3 0 01-2.8 0"/><path d="M16.4 12a2.3 2.3 0 01-2.8 0"/></svg>
);


export function Footer() {
  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: '#' },
    { icon: <Github className="h-5 w-5" />, href: '#' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#' },
  ];

  return (
    <footer className="bg-background text-muted-foreground">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl group">
              <Logo />
              <h1 className="font-headline text-2xl font-bold tracking-tight text-gradient">
                Codsach
              </h1>
            </Link>
            <p className="text-sm max-w-xs">
              Your comprehensive resource hub for MCA studies.
            </p>
            <div className="flex items-center gap-4 mt-2">
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.icon}
                  <span className="sr-only">Social Media</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              <a href="mailto:codsach@gmail.com" className="hover:text-primary transition-colors">
                codsach@gmail.com
              </a>
            </div>
          </div>
          
          <div>
              <h3 className="font-semibold text-foreground mb-4">Download App</h3>
              <a href="/codsach.apk" download className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  <AndroidLogo />
                  Download for Android
              </a>
          </div>

        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm">
           <p>&copy; {new Date().getFullYear()} Codsach. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
