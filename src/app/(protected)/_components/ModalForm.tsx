'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ModalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ModalForm({ open, onOpenChange }: ModalFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>Testing</DialogContent>
    </Dialog>
  );
}

export default ModalForm;
