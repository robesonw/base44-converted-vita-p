import { Avatar as RadixAvatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';

export const Avatar = ({ className, children }) => (
  <RadixAvatar className={`inline-flex items-center ${className}`}>{children}</RadixAvatar>
);

export { AvatarImage, AvatarFallback };