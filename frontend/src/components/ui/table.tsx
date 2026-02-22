export const Table = ({ children }) => <table className="min-w-full divide-y divide-gray-300">{children}</table>;

export const TableHeader = ({ children }) => <thead className="bg-gray-50">{children}</thead>;
export const TableBody = ({ children }) => <tbody className="bg-white divide-y divide-gray-300">{children}</tbody>;
export const TableFooter = ({ children }) => <tfoot>{children}</tfoot>;
export const TableHead = ({ children }) => <tr>{children}</tr>;
export const TableRow = ({ children }) => <tr>{children}</tr>;
export const TableCell = ({ children }) => <td className="p-4 whitespace-nowrap">{children}</td>;
export const TableCaption = ({ children }) => <caption className="text-base font-normal text-gray-700">{children}</caption>;