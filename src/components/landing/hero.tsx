import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative hero-section py-24 sm:py-32 lg:py-40 text-white overflow-hidden">
       <div className="absolute inset-0 z-0">
          <div className="background-animation">
            <div className="circle-1" style={{ animationDuration: '30s' }}></div>
            <div className="circle-2" style={{ animationDuration: '35s' }}></div>
            <div className="circle-3" style={{ animationDuration: '40s' }}></div>
          </div>
        </div>
      <div className="container relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="inline-block opacity-0 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>Welcome</span>{' '}
          <span className="inline-block opacity-0 animate-slide-in-top" style={{ animationDelay: '0.3s' }}>to</span>{' '}
          <span className="inline-block opacity-0 animate-slide-in-right" style={{ animationDelay: '0.5s' }}>Codsach</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500 delay-500">
          Your comprehensive resource hub for MCA studies. Access lab programs, notes, question papers, and software tools all in one place.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8 transition-transform duration-300 ease-in-out hover:scale-105 animate-in fade-in zoom-in-95 duration-500 delay-700">
            <Link href="#resources">Explore Resources</Link>
          </Button>
          <Button asChild size="lg" className="border border-white bg-transparent text-white hover:bg-white hover:text-primary rounded-full px-8 transition-transform duration-300 ease-in-out hover:scale-105 animate-in fade-in zoom-in-95 duration-500 delay-700">
            <Link href="#resources">Browse Notes</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
