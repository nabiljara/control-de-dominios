import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

export function ResponsiveDialog({
  children,
  open,
  onOpenChange,
  title,
  description,
  className
}: {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description?: string;
  className?: string;
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
              className={cn("sm:max-w-[425px]", className)}
              onEscapeKeyDown={(e) => {
                e.preventDefault()
              }}
              onPointerDownOutside={(e) => {
                e.preventDefault()
              }}
            >
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                {description && (
                  <DialogDescription>{description}</DialogDescription>
                )}
              </DialogHeader>
              {children}
            </DialogContent>
          </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={cn("p-6", className)}>
        <DrawerHeader className="px-0 text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}