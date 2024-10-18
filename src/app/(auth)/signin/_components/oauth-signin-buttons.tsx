"use client"
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { oauthSigninAction } from "@/actions/oauth-signin-action";

export default function OAuthSigninButtons() {

  const handleClick = async (provider: "google") => {
    await oauthSigninAction(provider)
  }

  return (
    <div className="w-full flex justify-center">
      <Button variant="secondary" className="w-full gap-3" onClick={handleClick.bind(null,"google")}>
        <span>
          Iniciar sesión con
        </span>
        <FcGoogle size={30} />
      </Button>
    </div>
  )
}
