"use client";
import { signoutUserAction } from "@/actions/user-action/signout-user-action";
import { DropdownMenuItem, DropdownMenuShortcut } from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";

export default function SignoutButton() {
  const clickHandler = async () => {
    await signoutUserAction();
    window.location.href = "/";
  };
  return (
    <>
      <DropdownMenuItem onClick={clickHandler}>
        <LogOut />
        Cerrar sesión
      </DropdownMenuItem>
    </>
  );
}
