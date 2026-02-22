import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Dialog = DialogPrimitive.Root;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogOverlay = DialogPrimitive.Overlay;
export const DialogClose = DialogPrimitive.Close;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogContent = DialogPrimitive.Content;
export const DialogHeader = ({ children }) => <div className="mb-2 font-semibold">{children}</div>;
export const DialogFooter = ({ children }) => <div className="mt-4 text-right">{children}</div>;
export const DialogTitle = ({ children }) => <h3 className="text-lg font-bold">{children}</h3>;
export const DialogDescription = ({ children }) => <p>{children}</p>;