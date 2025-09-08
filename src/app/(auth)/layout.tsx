import Image from "next/image";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col justify-center items-center gap-6 bg-muted p-6 md:p-10 min-h-svh">
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <div className="flex justify-center items-center gap-2 rounded-md w-full h-30 text-primary-foreground">
          <Image
            src="/images/logo.png"
            width={120}
            height={120}
            alt='Logo'
          />
        </div>
        {children}
      </div>
    </div>
  );
}