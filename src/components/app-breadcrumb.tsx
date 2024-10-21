'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

import { NAV_MAIN } from "@/constants"

import { usePathname } from 'next/navigation'

export default function AppBreadcrumb() {
  const pathname = usePathname();
  const activeRoute = NAV_MAIN.find(route => route.href === pathname) || NAV_MAIN[0]
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>
            {activeRoute.label}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
