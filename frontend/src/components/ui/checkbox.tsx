import { Checkbox as RadixCheckbox } from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

export const Checkbox = ({ className, ...props }) => (
  <RadixCheckbox className={`border-2 rounded ${className}`} {...props}>
    <Check className="h-4 w-4" />
  </RadixCheckbox>
);
