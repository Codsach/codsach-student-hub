import Link from 'next/link';
import { BookOpen, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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


export function Header() {
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/lab-programs', label: 'Lab Programs' },
    { href: '#', label: 'Notes' },
    { href: '#', label: 'Question Papers' },
    { href: '#', label: 'Software Tools' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary group">
          <Logo />
          <span className="font-headline">Codsach</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search resources..." className="pl-10 w-48 bg-muted border-none rounded-full" />
          </div>
          <Button className='rounded-full'>Login</Button>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 font-bold text-xl p-4 border-b text-primary">
                   <Logo />
                   <span className="font-headline">Codsach</span>
                </div>
                <nav className="flex flex-col gap-4 p-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto p-4 border-t flex flex-col gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search resources..." className="pl-10 w-full" />
                  </div>
                  <Button className='rounded-full'>Login</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
