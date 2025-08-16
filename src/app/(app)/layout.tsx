import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-dvh bg-muted/20 w-full">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
