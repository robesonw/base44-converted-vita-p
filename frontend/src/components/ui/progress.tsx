import { Progress as RadixProgress } from '@radix-ui/react-progress';

export const Progress = ({ value, max, className }) => (
  <RadixProgress value={value} max={max} className={`h-2 rounded bg-primary ${className}`} />
);
