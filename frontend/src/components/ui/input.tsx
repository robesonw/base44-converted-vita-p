import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} className={cn('border rounded-md p-2 focus:ring focus:ring-primary', className)} {...props} />
));
Input.displayName = 'Input';
