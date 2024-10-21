"use client"
import Link from "next/link"
import { DropdownMenuItem as MenuItem} from "@/components/ui/dropdown-menu"
import { ReactNode } from "react";

export default function DropdownMenuItem({ href, title,children }: { href: string; title: string; children:ReactNode }) {
  return (
    <MenuItem asChild onSelect={() => {}}>
      <Link href={href}>
        {children}
        <span>{title}</span>
      </Link>
    </MenuItem>
  )
}