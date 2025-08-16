
import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Stats } from '@/components/landing/stats';
import { Resources } from '@/components/landing/resources';
import { Benefits } from '@/components/landing/benefits';
import { Cta } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <main className="flex-grow">
        <Hero />
        <Stats />
        <Resources />
        <Benefits />
        <Cta />
      </main>
    </div>
  );
}
