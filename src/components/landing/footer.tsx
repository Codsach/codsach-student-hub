import Link from 'next/link';
import { Twitter, Github, Linkedin } from 'lucide-react';

const Logo = () => (
  <div className="relative w-8 h-8">
    <svg className="absolute w-full h-full animate-[spin_5s_linear_infinite]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" rx="12" stroke="url(#paint0_linear_logo)" strokeWidth="10"/>
        <defs>
            <linearGradient id="paint0_linear_logo" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="hsl(var(--primary))"/>
                <stop offset="1" stopColor="hsl(var(--primary)/0.5)"/>
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

  const footerSections = [
    {
      title: 'Company',
      links: ['About', 'Features', 'Works', 'Career'],
    },
    {
      title: 'Help',
      links: ['Customer Support', 'Delivery Details', 'Terms & Conditions', 'Privacy Policy'],
    },
    {
      title: 'Resources',
      links: ['Free eBooks', 'Development Tutorial', 'How to - Blog', 'Youtube Playlist'],
    }
  ];

  return (
    <footer className="bg-muted/20 text-muted-foreground">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary group">
              <Logo />
              <span className="font-headline">Codsach</span>
            </Link>
            <p className="text-sm">
              Your comprehensive resource hub for MCA studies.
            </p>
            <div className="flex items-center gap-4 mt-4">
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
          {footerSections.map(section => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link}>
                    <Link href="#" className="text-sm hover:text-primary transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm">
           <p>&copy; {new Date().getFullYear()} Codsach. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
