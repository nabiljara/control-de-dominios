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
  onSelect?: (accessId: number, access: Access) => void;
  provider: string | undefined;
  index: number;
}
export function AccessInfoCard({
  access,
  index,
  provider,
  isSelected = false,
  onSelect,
  readOnly = false,
}: AccessInfoCardProps) {
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>(
    {},
  );

  const toggleShowPassword = (index: number) => {
    setShowPasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  return (
    <Card
      className={`relative flex w-full p-4 shadow-sm transition-all duration-200 hover:shadow-md ${isSelected ? "bg-green-100 hover:bg-green-200" : ""} ${readOnly ? "" : "cursor-pointer hover:bg-gray-100"} `}
      role={!readOnly ? "button" : undefined}
      tabIndex={!readOnly ? 0 : undefined}
      onClick={() => {
        if (access?.id && onSelect) {
          onSelect(access.id, access);
        }
      }}
      onKeyDown={(e) => {
        if (!readOnly && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault(); // Evita scroll con Espacio
          if (access?.id && onSelect) {
            onSelect(access.id, access);
          }
        }
      }}
    >
      <CardContent className="flex h-full flex-col items-start justify-between gap-2 p-0">
        <div className="flex items-center gap-2">
          <Box className="h-4 w-4" />
          <h2 className="text-md font-bold">{provider}</h2>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="text-sm text-neutral-500">{access?.username}</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span className="text-sm text-neutral-500">
            {showPasswords[index]
              ? access?.password
              : "•".repeat(
                  access?.password.length ? access?.password.length : 0,
                )}
          </span>
          <Button
            onClick={() => toggleShowPassword(index)}
            aria-label={
              showPasswords[index]
                ? "Esconder contraseña"
                : "Mostrar contraseña"
            }
            type="button"
            variant="ghost"
            size="sm"
            className="h-full px-3 py-2 hover:bg-transparent"
          >
            {showPasswords[index] ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {access?.notes && (
          <div className="flex items-start gap-2">
            <StickyNote className="h-4 w-4 shrink-0" />
            <span className="text-sm text-neutral-500">{access.notes}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
