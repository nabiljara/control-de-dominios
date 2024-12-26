'use client';

import { Dispatch, SetStateAction } from 'react';
import { Button } from "@/components/ui/button"

export function DeleteForm({
  index,
  remove,
  onClose
}: {
  index: number;
  remove: (index: number) => void;
  onClose: () => void;
}) {
  return (

    <div className="flex md:flex-row flex-col justify-center gap-5 w-full">
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => {
          remove(index)
          onClose()
        }}
      >
        Eliminar
      </Button>
    </div>
  );
}
