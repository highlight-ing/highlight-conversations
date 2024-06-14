// components/ConversationTable.tsx
"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { conversationColumns } from "./columns";
import { ConversationData } from "../../data/conversations";

type ConversationTableProps = {
  conversations: ConversationData[];
};

const ConversationTable: React.FC<ConversationTableProps> = ({ conversations }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const table = useReactTable({
    data: conversations,
    columns: conversationColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDeleteSelected = () => {
    const selectedRowIds = Object.keys(rowSelection);
    const newData = conversations.filter(
      (item) => !selectedRowIds.includes(item.id.toString())
    );
    // Assuming conversations is a state in the parent component
    // This should ideally be passed down as a prop and updated in the parent
    // setData(newData); // Uncomment and use the parent state update function
    setRowSelection({});
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by summary or topic..."
          value={(table.getColumn("summary")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            table.getColumn("summary")?.setFilterValue(value);
            table.getColumn("topic")?.setFilterValue(value);
          }}
          className="max-w-sm bg-neutral-900 text-neutral-200"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteSelected}
          className="ml-4 bg-red-400 hover:bg-red-700"
        >
          Delete Selected
        </Button>
      </div>
      <div className="rounded-md border border-neutral-600">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-neutral-900">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="bg-neutral-800 hover:bg-neutral-800">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border-neutral-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={conversationColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-neutral-400">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-neutral-800 hover:bg-neutral-600 text-neutral-100"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-neutral-800 hover:bg-neutral-600 text-neutral-100"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationTable;