
'use client';

import Link from 'next/link';
import { BookOpen, Search, Menu, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ThemeToggle } from '../theme-toggle';

const Logo = () => (
    <div className="relative w-8 h-8 group-hover:scale-110 transition-transform">
        <svg className="absolute w-full h-full animate-[spin_5s_linear_infinite]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="60" height="60" rx="12" stroke="url(#paint0_linear_logo_header)" strokeWidth="10"/>
            <defs>
                <linearGradient id="paint0_linear_logo_header" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
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


export function Header() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdminLoggedIn(!!sessionStorage.getItem('isAdminLoggedIn'));
    }
  }, []);
  
    useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [pathname, searchParams]);


  const handleLogout = () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    setIsAdminLoggedIn(false);
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const query = e.currentTarget.search.value;
      if (query) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      } else {
        router.push('/search');
      }
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/lab-programs', label: 'Lab Programs' },
    { href: '/notes', label: 'Notes' },
    { href: '/question-papers', label: 'Question Papers' },
    { href: '/software-tools', label: 'Software Tools' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
              <Logo />
               <h1 className="font-headline text-2xl font-bold tracking-tight text-gradient">
                Codsach
              </h1>
            </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
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

        <div className="hidden items-center justify-end gap-2 md:flex">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                  name="search"
                  placeholder="Search resources..." 
                  className="pl-10 w-48 bg-muted border-none rounded-full"
                  defaultValue={searchQuery}
              />
            </div>
          </form>
          <ThemeToggle />
          {isAdminLoggedIn ? (
            <>
              <Button asChild className='rounded-full' variant="outline">
                <Link href="/admin">Admin Panel</Link>
              </Button>
              <Button onClick={handleLogout} className='rounded-full'>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <Button asChild className='rounded-full'>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
              <SheetHeader className="p-4 border-b">
                 <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex items-center justify-between">
                   <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
                     <Logo />
                     <h1 className="font-headline text-2xl font-bold tracking-tight text-gradient">
                      Codsach
                    </h1>
                   </Link>
                   <ThemeToggle />
                </div>
              </SheetHeader>
              <div className="flex flex-col h-full">
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
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                          name="search"
                          placeholder="Search resources..." 
                          className="pl-10 w-full" 
                          defaultValue={searchQuery}
                      />
                    </div>
                  </form>
                   {isAdminLoggedIn ? (
                      <div className='flex flex-col gap-2'>
                        <Button asChild className='rounded-full' variant="outline">
                          <Link href="/admin">Admin Panel</Link>
                        </Button>
                        <Button onClick={handleLogout} className='rounded-full'>
                          <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                      </div>
                    ) : (
                      <Button asChild className='rounded-full'>
                        <Link href="/login">Login</Link>
                      </Button>
                    )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
