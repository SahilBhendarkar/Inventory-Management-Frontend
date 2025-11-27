import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type ColumnDef<T> = {
  key: keyof T | string;
  label: string;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
};

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  className = "",
}: DataTableProps<T>) {
  return (
    <div className={`rounded-md border bg-white ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={String(col.key)}
                style={{ width: col.width }}
                className="font-semibold text-gray-600"
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col) => (
                <TableCell key={String(col.key)}>
                  {col.render
                    ? col.render(row[col.key as keyof T], row)
                    : (row[col.key as keyof T] as any)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
