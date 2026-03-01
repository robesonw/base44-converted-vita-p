import { cva } from 'class-variance-authority';
import cn from '@/lib/utils';

export const badgeVariants = cva('px-2 py-1 text-sm font-medium rounded-full', {
  variants: {
    variant: {
      default: 'bg-blue-500 text-white',
      outline: 'border border-gray-400 text-gray-700',
      ghost: 'bg-transparent text-gray-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const Badge = ({ className, variant, children }) => (
  <div className={cn(badgeVariants({ variant }), className)}>{children}</div>
);