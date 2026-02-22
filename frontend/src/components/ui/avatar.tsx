import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

export const Avatar = ({ className, ...props }) => <AvatarPrimitive.Root className={cn('overflow-hidden rounded-full', className)} {...props} />;

export const AvatarImage = AvatarPrimitive.Image;
export const AvatarFallback = AvatarPrimitive.Fallback;