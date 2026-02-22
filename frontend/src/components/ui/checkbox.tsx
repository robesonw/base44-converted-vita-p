import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';

export const Checkbox = ({ className, children, ...props }) => {
  return (
    <CheckboxPrimitive.Root className={cn('flex items-center', className)} {...props}>
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <CheckIcon className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
      {children}
    </CheckboxPrimitive.Root>
  );
};