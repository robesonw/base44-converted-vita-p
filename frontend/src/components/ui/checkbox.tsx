import { Checkbox as RadixCheckbox } from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

export const Checkbox = (props) => (
  <RadixCheckbox {...props}>
    <Check className="h-4 w-4" />
  </RadixCheckbox>
);