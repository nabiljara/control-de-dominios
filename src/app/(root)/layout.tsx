import Navbar from '@/components/Navbar';
export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex h-screen w-full font-inter">
      <div className='flex size-full flex-col'>
        <Navbar />
        {children}
      </div>
    </main>
  );
}