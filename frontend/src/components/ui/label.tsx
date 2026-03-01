import { Label as RadixLabel } from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import cn from '@/lib/utils';

const labelVariants = cva('text-sm font-medium text-gray-700', {
  variants: {
    required: {
      true: 'after:content-["*"]',
      false: '',
    },
  },
});

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = ({ className, required, ...props }: LabelProps) => (
  <RadixLabel className={cn(labelVariants({ required }), className)} {...props} />
);
