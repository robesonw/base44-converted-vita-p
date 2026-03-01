import { Separator as RadixSeparator } from '@radix-ui/react-separator';

export const Separator = ({ className }) => (
  <RadixSeparator className={`my-4 ${className}`} orientation="horizontal" />
);