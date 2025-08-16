import Link from 'next/link';
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: '#' },
    { icon: <Github className="h-5 w-5" />, href: '#' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#' },
  ];

  const footerLinks = [
    { href: '#', label: 'About' },
    { href: '#', label: 'Contact' },
    { href: '#', label: 'Terms of Service' },
    { href: '#', label: 'Privacy Policy' },
  ];

  return (
    <footer className="bg-muted/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-headline">Codsach</span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Your Ultimate Coding Resource Hub
            </p>
          </div>
          <div className="flex items-center gap-4">
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
        <div className="mt-8 pt-8 border-t flex flex-col items-center justify-between gap-4 sm:flex-row">
           <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Codsach. All rights reserved.</p>
           <nav className="flex gap-4">
             {footerLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
             ))}
           </nav>
        </div>
      </div>
    </footer>
  );
}
