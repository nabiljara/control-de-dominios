'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Globe, Users, Box } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { NAV_MAIN } from '@/constants';
import React from 'react';

export default function AppBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname === '/' ? ['home'] : pathname.split('/').filter(segment => segment !== '');

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const route = NAV_MAIN.find(route => route.href === path);
    let label = route ? route.label : segment.charAt(0).toUpperCase() + segment.slice(1);

    if (segment === 'create' && index > 0) {
      const parentRoute = NAV_MAIN.find(route => route.href === `/${pathSegments[index - 1]}`);
      if (parentRoute && parentRoute.singular) {
        label = `Nuevo ${parentRoute.singular}`;
      }
    }

    const isLast = index === pathSegments.length - 1;

    return (
      <React.Fragment key={path}>
        <BreadcrumbItem>
          {isLast ? (
            <BreadcrumbPage>{label}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild href={path}>
              <Link href={path}>{label}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />}
      </React.Fragment>
    );
  });
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
