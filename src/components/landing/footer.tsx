import Link from 'next/link';
import { Twitter, Github, Linkedin } from 'lucide-react';

const Logo = () => (
    <svg
      className="h-8 w-8"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--primary) / 0.5)', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="10"
        className="transition-all duration-300 group-hover:rotate-[360deg] origin-center"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="40"
        fill="hsl(var(--primary))"
        fontFamily="sans-serif"
        fontWeight="bold"
        className="transition-all duration-300 group-hover:scale-110"
      >
        CS
      </text>
    </svg>
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
