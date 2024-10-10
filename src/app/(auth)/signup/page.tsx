import SignUpForm from "@/app/(auth)/signup/_components/SignUpForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default async function SignUpPage() {

  return (
      <div className="container">
        <h1 className="text-3xl font-bold tracking-tight">Registrarse</h1>

        <div className="h-1 bg-muted my-4"/>
        <SignUpForm />

        <div className="h-1 bg-muted my-4"/>
        <p>
          Ya tienes una cuenta? Inicie sesión {" "} 
          <Button variant="link" size="sm" className="px-0" asChild>
            <Link href="/signin" className="underline">aquí</Link>
          </Button>
        </p>
      </div>
  )
}
