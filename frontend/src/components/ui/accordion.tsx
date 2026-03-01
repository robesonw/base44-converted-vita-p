import { Accordion as RadixAccordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

export const Accordion = ({ children }) => <RadixAccordion>{children}</RadixAccordion>;

export { AccordionItem, AccordionTrigger, AccordionContent };

export const AccordionWithIcon = ({ children }) => (
  <AccordionTrigger>
    <ChevronDown /> {children}
  </AccordionTrigger>
);
