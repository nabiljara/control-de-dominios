import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignoutButton from "@/components/SignoutButton";
import Image from 'next/image';


export default function Navbar() {
  return (
    <nav className="h-14 border-b">
      <div className="h-full container flex justify-between items-center">
        <h3 className="text-xl font-semibold tracking-tight">
          <Link href="/">
            <Image
              src="/images/logo-kernel.png"
              width={130}
              height={130}
              alt='Logo'
            />
          </Link>
        </h3>

        <ul className="flex items-center gap-x-4">
          <li>
            <SignoutButton />
          </li>
        </ul>
      </div>
    </nav>
  )
}
