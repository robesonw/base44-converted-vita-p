import { Accordion as RadixAccordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

export const Accordion = RadixAccordion;
export const AccordionHeader = AccordionTrigger;
export const AccordionItemBody = AccordionContent;
export { AccordionItem };

export const AccordionTriggerWithIcon = (props) => (
  <AccordionTrigger {...props}>
    <ChevronDown className="h-4 w-4" />
    {props.children}
  </AccordionTrigger>
);