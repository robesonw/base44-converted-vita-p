import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

export const Progress = ({ value, className }) => {
  return <ProgressPrimitive.Root value={value} className={cn('relative h-2 bg-gray-300', className)} style={{ width: `${value}%` }} />;
};