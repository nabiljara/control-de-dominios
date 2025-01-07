import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Access } from "@/db/schema";
import { Box, Eye, EyeOff, Lock, StickyNote, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AccessInfoCardProps {
  access: Access | undefined;
  isSelected?: boolean;
  readOnly?: boolean;
  onSelect?: (accessId: number, access: Access ) => void;
  provider: string | undefined
  index: number
}
export function AccessInfoCard(
  {
    access,
    index,
    provider,
    isSelected = false,
    onSelect,
    readOnly = false,
  }: AccessInfoCardProps
) {
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});

  const toggleShowPassword = (index: number) => {
    setShowPasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  return (
    <Card
      className={`relative flex shadow-sm hover:shadow-md p-4 w-full transition-all duration-200
        ${isSelected ? 'bg-green-100 hover:bg-green-200' : ''}
        ${readOnly ? '' : 'cursor-pointer hover:bg-gray-100'}
      `}
      onClick={() => {
        if (access?.id && onSelect) {
          onSelect(access.id, access);
        }
      }}
      >
      <CardContent className='flex flex-col justify-between items-start gap-2 p-0 h-full'>
        <div className='flex items-center gap-2'>
          <Box className="w-4 h-4" />
          <h2 className="font-bold text-md">
            {provider}
          </h2>
        </div>
        <div className='flex items-center gap-2'>
          <User className="w-4 h-4" />
          <span className="text-neutral-500 text-sm">
            {access?.username}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <Lock className="w-4 h-4" />
          <span className="text-neutral-500 text-sm">
            {showPasswords[index] ? access?.password : '•'.repeat(access?.password.length ? access?.password.length : 0 )}
          </span>
          <Button
            onClick={() => toggleShowPassword(index)}
            aria-label={showPasswords[index] ? 'Esconder contraseña' : 'Mostrar contraseña'}
            type="button"
            variant="ghost"
            size="sm"
            className="hover:bg-transparent px-3 py-2 h-full"
          >
            {showPasswords[index] ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>
        {access?.notes && (
          <div className="flex items-start gap-2">
            <StickyNote className="w-4 h-4 shrink-0" />
            <span className="text-neutral-500 text-sm">
              {access.notes}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
