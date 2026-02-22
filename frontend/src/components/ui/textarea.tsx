import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => {
  const { className, ...rest } = props;
  return <textarea ref={ref} className={cn('border rounded-md p-2', className)} {...rest} />;
});
Textarea.displayName = 'Textarea';
