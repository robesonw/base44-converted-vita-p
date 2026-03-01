export const Table = ({ children }) => <table className="min-w-full border-collapse border border-gray-300">{children}</table>;
export const TableHeader = ({ children }) => <thead className="bg-gray-200">{children}</thead>;
export const TableBody = ({ children }) => <tbody>{children}</tbody>;
export const TableFooter = ({ children }) => <tfoot>{children}</tfoot>;
export const TableHead = ({ children }) => <tr className="border-b border-gray-300">{children}</tr>;
export const TableRow = ({ children }) => <tr>{children}</tr>;
export const TableCell = ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>;
export const TableCaption = ({ children }) => <caption className="text-left mb-2">{children}</caption>;