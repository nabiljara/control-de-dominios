import Image from "next/image";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col justify-center items-center gap-6 bg-muted p-6 md:p-10 min-h-svh">
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <div className="flex justify-center items-center gap-2 rounded-md w-full h-10 text-primary-foreground">
          <Image
            src="/images/logo.svg"
            width={40}
            height={40}
            alt='Logo'
          />
          <div className="flex flex-col w-min text-black leading-tight">
            <span className="w-min font-semibold truncate">SICOM</span>
            <span className="w-min text-xs truncate">Interna y externa</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}