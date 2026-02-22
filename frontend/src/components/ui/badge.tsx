import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium', {
  variants: {
    variant: {
      default: 'bg-blue-500 text-white',
      outline: 'border border-blue-500 bg-transparent text-blue-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const Badge = ({ className, variant, children }) => {
  return <div className={cn(badgeVariants({ variant }), className)}>{children}</div>;
};