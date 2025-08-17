
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


export function Footer() {
  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: '#' },
    { icon: <Github className="h-5 w-5" />, href: '#' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#' },
  ];

  return (
    <footer className="bg-background text-muted-foreground">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-8">
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
          
          <div className="md:w-1/3">
            <h3 className="font-semibold text-foreground mb-4">About Us</h3>
            <p className="text-sm">
                Codsach is a student-focused platform designed to provide easy access to academic resources. We offer a curated collection of lab programs, study notes, previous year question papers, and essential software tools. Our goal is to simplify the learning process with an intuitive interface and one-click downloads, helping students excel in their MCA journey.
            </p>
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
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm">
           <p>&copy; {new Date().getFullYear()} Codsach. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
