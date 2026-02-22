import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/lib/utils';

export const Separator = ({ className, ...props }) => {
  return <SeparatorPrimitive.Root className={cn('h-px bg-gray-200', className)} {...props} />;
};