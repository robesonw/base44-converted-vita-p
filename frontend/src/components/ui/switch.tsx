import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export const Switch = ({ className, ...props }) => {
  return <SwitchPrimitive.Root className={cn('rounded-full border-2 transition-colors', className)} {...props} />;
};