import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Cta() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-primary shadow-2xl rounded-2xl px-6 py-20 text-center sm:px-16">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to dive in?
          </h2>
          <p className="mt-4 text-lg leading-8 text-primary-foreground/80">
            Start exploring our vast collection of resources today and take your skills to the next level.
          </p>
          <div className="mt-10 flex items-center justify-center">
            <Button asChild variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="#">Get Started Now</Link>
            </Button>
          </div>
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx="512" cy="512" r="512" fill="url(#gradient)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="#50B4F2" />
                <stop offset="1" stopColor="#7950F2" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
}
