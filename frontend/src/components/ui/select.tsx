import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = ({ children }) => {
  return <SelectPrimitive.Trigger className="flex items-center"><ChevronDown className="h-4 w-4 mr-2" />{children}</SelectPrimitive.Trigger>;
};

export const SelectContent = SelectPrimitive.Content;
export const SelectLabel = SelectPrimitive.Label;
export const SelectItem = SelectPrimitive.Item;

export const SelectSeparator = SelectPrimitive.Separator;
export const SelectScrollUpButton = SelectPrimitive.ScrollUpButton;
export const SelectScrollDownButton = SelectPrimitive.ScrollDownButton;