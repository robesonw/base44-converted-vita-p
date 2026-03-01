import { Progress as RadixProgress } from '@radix-ui/react-progress';

export const Progress = ({ value }) => (
  <RadixProgress value={value} className="relative h-2 bg-gray-200 rounded">
    <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ width: `${value}%` }} />
  </RadixProgress>
);