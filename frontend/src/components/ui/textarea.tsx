import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import cn from '@/lib/utils';

const textareaVariants = cva('border rounded-md p-2 focus:outline-none', {
  variants: {
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: 'default' | 'sm' | 'lg';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, size, ...props }, ref) => (
  <textarea ref={ref} className={cn(textareaVariants({ size }), className)} {...props} />
));
Textarea.displayName = 'Textarea';
