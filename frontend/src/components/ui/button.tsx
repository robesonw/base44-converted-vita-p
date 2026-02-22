import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva('inline-flex items-center justify-center rounded-lg border border-transparent font-medium focus:outline-none focus:ring-2 focus:ring-offset-2', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/80',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
      outline: 'border border-input bg-background text-foreground hover:bg-accent',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-10 px-8',
      icon: 'h-9 w-9',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export const Button = forwardRef<HTMLElement, React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>>((props, ref) => {
  const { className, variant, size, ...rest } = props;
  return (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...rest} />
  );
});
Button.displayName = 'Button';
