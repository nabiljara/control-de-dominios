import SignInForm from "@/app/(auth)/signin/_components/SignInForm";
import OAuthSigninButtons from "@/components/oauth-signin-buttons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SigninPage() {
  return (
    <div className="container mt-12">
      <h1 className="text-3xl font-bold tracking-tight">Ingresar</h1>
      <div className="h-1 bg-muted my-4" />
      <SignInForm />

      <div className="h-1 bg-muted my-4" />

      <OAuthSigninButtons/>

      {/* <p>
        No tiene una cuenta? {" "}
        <Button variant="link" size="sm" className="px-0" asChild>
          <Link href="/signup" className="underline">Registrarse</Link>
        </Button>
      </p> */}
    </div>
  )
}
