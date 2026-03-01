import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva('inline-flex items-center rounded-full px-2 text-xs font-medium', {
  variants: {
    variant: {
      default: 'bg-blue-500 text-white',
      secondary: 'bg-gray-500 text-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const Badge = ({ className, variant, children }) => (
  <div className={cn(badgeVariants({ variant }), className)}>{children}</div>
);
