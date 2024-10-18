'use client'
import { signoutUserAction } from "@/actions/signout-user-action"
import { DropdownMenuItem, DropdownMenuShortcut } from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";

export default function SignoutButton() {

  const clickHandler = async () => {
    await signoutUserAction();
    window.location.href = '/'
  }
  return (
    <>
      <DropdownMenuItem onClick={clickHandler}>
      <LogOut className="mr-2 h-4 w-4" />
        Cerrar sesión
        {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
      </DropdownMenuItem>
    </>
  )
}
