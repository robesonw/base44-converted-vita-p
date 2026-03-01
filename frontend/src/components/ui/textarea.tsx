import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn('border rounded-md p-2 focus:ring focus:ring-primary', className)} {...props} />
));
Textarea.displayName = 'Textarea';
