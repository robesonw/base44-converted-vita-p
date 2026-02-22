import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  const { className, ...rest } = props;
  return <input ref={ref} className={cn('border rounded-md px-3 py-2', className)} {...rest} />;
});
Input.displayName = 'Input';
