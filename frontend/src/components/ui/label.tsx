import * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const labelVariants = cva('block text-sm font-medium');

export const Label = ({ className, ...props }) => {
  return <LabelPrimitive.Root className={cn(labelVariants(), className)} {...props} />;
};
