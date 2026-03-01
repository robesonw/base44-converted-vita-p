import { Label as RadixLabel } from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const labelVariants = cva('text-sm font-medium', {});

export const Label = ({ className, ...props }) => (
  <RadixLabel className={cn(labelVariants(), className)} {...props} />
);
