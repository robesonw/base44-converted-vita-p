export const Card = ({ children, className }) => (
  <div className={`border rounded-lg p-4 shadow ${className}`}>{children}</div>
);

export const CardHeader = ({ children }) => <div className="font-bold text-lg mb-2">{children}</div>;
export const CardFooter = ({ children }) => <div className="mt-4 text-sm text-gray-500">{children}</div>;
export const CardTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;
export const CardDescription = ({ children }) => <p className="text-gray-700">{children}</p>;
export const CardContent = ({ children }) => <div className="text-gray-800">{children}</div>;