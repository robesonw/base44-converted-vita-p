import { Separator as RadixSeparator } from '@radix-ui/react-separator';

export const Separator = ({ className }) => (
  <RadixSeparator className={`my-2 h-px bg-gray-300 ${className}`} />
);
