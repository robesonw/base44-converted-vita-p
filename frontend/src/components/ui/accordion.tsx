import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Accordion = AccordionPrimitive.Root;
export const AccordionItem = AccordionPrimitive.Item;

export const AccordionTrigger = ({ children }) => {
  return (
    <AccordionPrimitive.Trigger className="flex items-center">
      <ChevronDown className="h-4 w-4 mr-2" />
      {children}
    </AccordionPrimitive.Trigger>
  );
};

export const AccordionContent = AccordionPrimitive.Content;