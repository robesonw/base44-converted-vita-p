import { Tooltip as RadixTooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@radix-ui/react-tooltip';

export { TooltipProvider, TooltipTrigger, TooltipContent };

export const Tooltip = ({ children }) => <RadixTooltip>{children}</RadixTooltip>;
