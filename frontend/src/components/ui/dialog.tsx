import { Dialog as RadixDialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export const Dialog = ({ children }) => <RadixDialog>{children}</RadixDialog>;
export { DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };

export const DialogCloseButton = () => <DialogClose><X /></DialogClose>;
