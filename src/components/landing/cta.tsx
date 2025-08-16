import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Cta() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gradient-to-r from-[#50B4F2] to-[#7950F2] shadow-2xl rounded-2xl px-6 py-20 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to accelerate your MCA journey?
          </h2>
          <p className="mt-4 text-lg leading-8 text-white/80">
            Join thousands of students who are already using Codsach to excel in their studies.
          </p>
          <div className="mt-10 flex items-center justify-center">
            <Button asChild variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8">
              <Link href="#">Start Exploring Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
