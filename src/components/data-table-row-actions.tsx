import Link from "next/link"
import { Eye } from "lucide-react"

interface DataTableRowActionsProps {
  href: string
}

export function DataTableRowActions({
  href,
}: DataTableRowActionsProps) {
  return (
    <Link href={href} className="flex justify-start items-center ml-5">
      <Eye className="w-4 h-4" />
    </Link>
  )
}
