"use client";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { oauthSigninAction } from "@/actions/user-action/oauth-signin-action";

export default function OAuthSigninButtons() {
  const handleClick = async (provider: "google") => {
    await oauthSigninAction(provider);
  };

  return (
    <div className="flex justify-center w-full">
      <Button
        variant="outline"
        className="gap-3 w-full"
        onClick={handleClick.bind(null, "google")}
      >
        <span>Iniciar sesión con</span>
        <FcGoogle size={50} />
      </Button>
    </div>
  );
}
