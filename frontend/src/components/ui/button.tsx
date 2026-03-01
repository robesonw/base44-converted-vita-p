import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

const Button = React.forwardRef((props, forwardedRef) => {
  const { asChild, children, ...rest } = props;
  const Component = asChild ? Slot : 'button';

  return <Component ref={forwardedRef} {...rest}>{children}</Component>;
});

Button.displayName = 'Button';
export { Button };