
import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

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
    {
      name: 'GitHub',
      icon: <Github className="h-5 w-5" />,
      href: 'https://www.github.com/codsach',
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
      href: 'https://www.linkedin.com/in/sachinr-dev',
    },
  ];

  const quickLinks = [
    { name: 'Lab Programs', href: '/lab-programs' },
    { name: 'Study Notes', href: '/notes' },
    { name: 'Question Papers', href: '/question-papers' },
    { name: 'Software Tools', href: '/software-tools' },
    { name: 'Search Resources', href: '/search' },
  ];

  return (
    <footer className="bg-background text-muted-foreground border-t">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl group">
              <Logo />
              <span className="font-headline text-2xl font-bold tracking-tight text-gradient">
                Codsach
              </span>
            </Link>
            <p className="text-sm max-w-xs text-muted-foreground">
              Your comprehensive resource hub for MCA studies.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border bg-card hover:bg-accent hover:text-primary transition-all duration-200"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-base">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-base">Contact & Connect</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:codsach@gmail.com" className="hover:text-primary transition-colors">
                  codsach@gmail.com
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                Developed by Sachin R. Feel free to connect on GitHub or LinkedIn!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
           <p>&copy; {new Date().getFullYear()} Codsach. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

