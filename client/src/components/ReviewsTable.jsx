import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import axios from 'axios';

const Filter = ({ column }) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <input
      type="text"
      value={(columnFilterValue ?? '')}
      onChange={e => column.setFilterValue(e.target.value)}
      onClick={(e) => e.stopPropagation()} // Prevent sorting when clicking in the filter box
      placeholder={`Search...`}
      className="w-full border shadow rounded px-2 py-1 mt-1 text-sm"
    />
  );
};

const ReviewsTable = ({ data, onUpdateReview }) => {
  const columns = useMemo(() => [
    {
      accessorKey: 'listingName',
      header: 'Property',
      meta: {
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: info => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            info.getValue() === 'guest-to-host' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-indigo-100 text-indigo-800'
        }`}>
            {info.getValue().replace('-', ' to ')}
        </span>
      )
    },
    {
      accessorKey: 'guestName',
      header: 'Guest',
    },
    {
      accessorKey: 'averageRating',
      header: 'Rating',
      cell: info => <div className="text-center">{info.getValue().toFixed(1)}</div>,
    },
    {
      accessorKey: 'submittedAt',
      header: 'Date',
      cell: info => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Approve for Website',
      cell: ({ row }) => {
        const review = row.original;

        const handleToggleApproval = async () => {
          try {
            const newStatus = !review.isApprovedForPublic;
            const { data: updatedReview } = await axios.put(
              `/api/reviews/${review._id}`, 
              { isApprovedForPublic: newStatus }
            );
            onUpdateReview(updatedReview);
          } catch (error) {
            console.error('Failed to update review status', error);
          }
        };

        return (
          <div className="flex justify-center items-center">
             <button
              onClick={handleToggleApproval}
              className={`px-3 py-1 text-sm rounded-full text-white ${
                review.isApprovedForPublic
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-400 hover:bg-gray-500'
              }`}
            >
              {review.isApprovedForPublic ? 'Approved' : 'Approve'}
            </button>
          </div>
        );
      },
    },
  ], [onUpdateReview]);

  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      
      <div className="mb-4">
        <input
          type="text"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
          className="border shadow rounded px-3 py-2 w-full md:w-1/3"
        />
      </div>
      
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="p-3 text-left text-sm font-bold text-gray-500 uppercase border-b">
                  {/* Sorting later here */}
                  <div
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted()] ?? null}
                  </div>
                  {header.column.getCanFilter() ? (
                        <div>
                            <Filter column={header.column} />
                        </div>
                    ) : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-flex-light-gray border-b">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsTable;