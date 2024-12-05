'use client';

import { Dispatch, SetStateAction } from 'react';
import { Button } from "@/components/ui/button"

export function DeleteForm({
  index,
  remove,
  setIsOpen,
}: {
  index: number;
  remove: (index: number) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (

    <div className="w-full flex flex-col md:flex-row justify-center gap-5">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setIsOpen(false)
        }}
      >
        Cancelar
      </Button>
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => {
          remove(index)
          setIsOpen(false)
        }}
      >
        Eliminar
      </Button>
    </div>
  );
}
