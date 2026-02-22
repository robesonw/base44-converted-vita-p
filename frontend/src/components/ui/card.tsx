export const Card = ({ children, className }) => {
  return <div className={`rounded-lg border p-5 shadow-lg ${className}`}>{children}</div>;
};

export const CardHeader = ({ children }) => <div className="mb-2 text-lg font-semibold">{children}</div>;

export const CardFooter = ({ children }) => <div className="mt-4 border-t pt-3">{children}</div>;

export const CardTitle = ({ children }) => <h3 className="text-xl font-bold">{children}</h3>;

export const CardDescription = ({ children }) => <p className="text-sm text-muted-foreground">{children}</p>;

export const CardContent = ({ children }) => <div>{children}</div>;