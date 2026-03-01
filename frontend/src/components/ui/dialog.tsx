import { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };

export const DialogCloseButton = (props) => (
  <DialogClose {...props}>
    <X className="h-5 w-5" />
  </DialogClose>
);