export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-dvh bg-muted/20 w-full">
      <main className="flex-grow">{children}</main>
    </div>
  );
}
