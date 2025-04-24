import { ResponsiveDialog } from './responsive-dialog';
import { Button } from './ui/button';

type LeavingDialogProps = {
  isOpen: boolean;
  yesCallback: () => void;
  noCallback: () => void;
};

export const LeavingDialog = ({ isOpen, yesCallback, noCallback }: LeavingDialogProps) => {
  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={() => noCallback()}
      title="La información ingresada se perderá"
      description="¿Está seguro que quiere dejar está página?"
    >
      <div className='flex flex-row justify-end items-center gap-2'>
        <Button onClick={() => noCallback()}>Cancelar</Button>
        <Button variant={'destructive'} onClick={() => yesCallback()}>Confirmar</Button>
      </div>
    </ResponsiveDialog>
  );
};