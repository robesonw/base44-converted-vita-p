import { Select as RadixSelect, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton } from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';

export const Select = ({ children, ...props }) => (
  <RadixSelect {...props}>
    <SelectTrigger>
      <ChevronDown />
      <SelectValue />
    </SelectTrigger>
    <SelectContent>{children}</SelectContent>
  </RadixSelect>
);

export { SelectGroup, SelectValue, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton };