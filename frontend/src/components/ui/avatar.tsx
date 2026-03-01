import { Avatar as RadixAvatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';

export const Avatar = ({ className, ...props }) => (
  <RadixAvatar className={className} {...props} />
);

export { AvatarImage, AvatarFallback };