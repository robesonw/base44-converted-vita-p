export const Card = ({ children, className }) => (
  <div className={`border rounded-lg shadow p-4 ${className}`}>{children}</div>
);

export const CardHeader = ({ children }) => (
  <div className="border-b pb-2 mb-2 font-bold">{children}</div>
);

export const CardFooter = ({ children }) => (
  <div className="pt-2 mt-2 border-t">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

export const CardDescription = ({ children }) => (
  <p className="text-sm text-gray-600">{children}</p>
);

export const CardContent = ({ children }) => (
  <div className="mt-2">{children}</div>
);
