import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableLoadingProps {
  colSpan: number;
}

export function TableLoading({ colSpan }: TableLoadingProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="h-64">
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-[#3b82f6]" />
          <p className="mt-2 text-sm">Loading data...</p>
        </div>
      </td>
    </tr>
  );
}

interface TableErrorProps {
  colSpan: number;
  message?: string;
  onRetry?: () => void;
}

export function TableError({ colSpan, message, onRetry }: TableErrorProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="h-64">
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <AlertCircle className="h-8 w-8 text-[#ef4444]" />
          <p className="mt-2 text-sm font-medium text-gray-900">Failed to load data</p>
          {message && <p className="mt-1 text-xs text-gray-500 max-w-md text-center">{message}</p>}
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="mt-4">
              Try again
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

interface TableEmptyProps {
  colSpan: number;
  message?: string;
}

export function TableEmpty({ colSpan, message = "No data found" }: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="h-64">
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <AlertCircle className="h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm">{message}</p>
        </div>
      </td>
    </tr>
  );
}
