import { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton } from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

const SelectTriggerWithIcon = (props) => (
  <SelectTrigger {...props}>
    <span className="flex-grow">{props.children}</span>
    <ChevronDown className="h-4 w-4" />
  </SelectTrigger>
);

const SelectItemWithCheck = (props) => (
  <SelectItem value={props.value} {...props}>
    <span className="flex-grow">{props.children}</span>
    {props.selected && <Check className="h-4 w-4" />}
  </SelectItem>
);

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTriggerWithIcon as SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItemWithCheck as SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};