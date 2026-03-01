import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import cn from '@/lib/utils';

const inputVariants = cva('border rounded-md p-2 focus:outline-none', {
  variants: {
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
    },
    error: {
      true: 'border-red-500',
      false: 'border-gray-300',
    },
  },
  defaultVariants: {
    size: 'default',
    error: false,
  },
});

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: 'default' | 'sm' | 'lg';
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, size, error, ...props }, ref) => (
  <input ref={ref} className={cn(inputVariants({ size, error }), className)} {...props} />
));
Input.displayName = 'Input';
