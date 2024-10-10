'use client'
import { signoutUserAction } from "@/actions/signout-user-action"
import { Button } from "@/components/ui/button"

export default function SignoutButton() {

  const clickHandler = async () => {
    await signoutUserAction();
    window.location.href = '/'  
  }
  return (
    <Button variant="destructive" size="sm" onClick={clickHandler}>
      Cerrar sesión
    </Button>
  )
}
