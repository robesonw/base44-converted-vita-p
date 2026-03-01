import { Switch as RadixSwitch } from '@radix-ui/react-switch';

export const Switch = ({ className, ...props }) => (
  <RadixSwitch className={`rounded-full ${className}`} {...props} />
);
