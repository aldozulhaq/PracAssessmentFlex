import React, { useMemo, useState, useRef, useEffect, Fragment } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import axios from 'axios';
import Select from 'react-select'; 
import DatePicker from 'react-datepicker';
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from './Icons';

import ReviewDetailCard from './ReviewDetailCard';

const AdvancedFilter = ({ column, table }) => {
  const [showFilter, setShowFilter] = useState(false);
  const filterVariant = column.columnDef.meta?.filterVariant;
  const datePickerRef = useRef(null);
  const popoverRef = useRef(null);

  const uniqueValues = useMemo(() => {
    if (filterVariant !== 'select') return [];
    const unique = new Set(table.getPreFilteredRowModel().rows.map(row => row.getValue(column.id)));
    return [...unique].sort().map(value => ({ label: value, value }));
  }, [table.getPreFilteredRowModel(), column.id, filterVariant]);

  const onFilterChange = (value) => {
    if (filterVariant === 'select') {
      column.setFilterValue(value?.value || undefined);
    } else if (filterVariant === 'date') {
      column.setFilterValue(value ? value.toISOString() : undefined);
    } else {
      column.setFilterValue(value);
    }
  };

  const toggleFilter = () => {
    const newShowFilter = !showFilter;
    setShowFilter(newShowFilter);
    if (newShowFilter && filterVariant === 'date') {
      setTimeout(() => {
        datePickerRef.current?.setFocus();
      }, 100);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilter]);

  const renderFilter = () => {
    if (filterVariant === 'select') {
      return (
        <Select
          options={uniqueValues}
          value={uniqueValues.find(o => o.value === column.getFilterValue())}
          onChange={onFilterChange}
          isClearable
          placeholder="Select..."
          className="w-48 text-sm"
        />
      );
    }

    if (filterVariant === 'date') {
        const selectedDate = column.getFilterValue() ? new Date(column.getFilterValue()) : null;
        return (
            <DatePicker
                ref={datePickerRef}
                selected={selectedDate}
                onChange={onFilterChange}
                isClearable
                placeholderText="Select a date"
                className="w-full border rounded px-2 py-1"
            />
        );
    }

    if (filterVariant === 'numberRange') {
      const [min, max] = column.getFilterValue() ?? [];
      return (
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min={0}
            max={10}
            value={min ?? ''}
            onChange={e => column.setFilterValue(old => [e.target.value, old?.[1]])}
            placeholder="Min"
            className="w-20 border-gray-200 rounded shadow-sm text-sm"
          />
          <span>to</span>
          <input
            type="number"
            min={0}
            max={10}
            value={max ?? ''}
            onChange={e => column.setFilterValue(old => [old?.[0], e.target.value])}
            placeholder="Max"
            className="w-20 border-gray-200 rounded shadow-sm text-sm"
          />
        </div>
      );
    }

    return (
      <input
        type="text"
        value={(column.getFilterValue() ?? '')}
        onChange={e => onFilterChange(e.target.value)}
        placeholder={`Search...`}
        className="w-full border shadow rounded px-2 py-1 text-sm"
      />
    );
  };
  
  return (
    <div className="relative">
      <button onClick={toggleFilter} className="p-1 rounded-full hover:bg-gray-200">
        <SearchIcon />
      </button>
      {showFilter && (
        <div
            ref={popoverRef}
            className="absolute top-full right-0 mt-1 z-10 bg-white p-2 rounded-md shadow-lg border"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {renderFilter()}
        </div>
      )}
    </div>
  );
};

const ReviewsTable = ({ data, onUpdateReview }) => {
  const columns = useMemo(() => [
    {
      id: 'expander',
      header: () => null,
      cell: ({ row }) => (
        <button
          onClick={row.getToggleExpandedHandler()}
          className="text-xl text-flex-dark-green"
          title={row.getIsExpanded() ? 'Collapse' : 'Expand'}
        >
          {row.getIsExpanded() ? '⊖' : '⊕'}
        </button>
      ),
    },
    {
      accessorKey: 'listingName',
      header: 'Property',
      meta: { filterVariant: 'select' },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      meta: { filterVariant: 'select' },
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
      meta: { filterVariant: 'select' },
      header: 'Guest',
    },
    {
      accessorKey: 'averageRating',
      header: 'Rating',
      meta: { filterVariant: 'numberRange' },
      cell: info => <div className="text-center">{info.getValue().toFixed(1)}</div>,
    },
    {
      accessorKey: 'submittedAt',
      header: 'Date',
      meta: { filterVariant: 'date' },
      cell: info => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Approve for Website',
      enableColumnFilter: false,
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
    getRowCanExpand: () => true,
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
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-subtle border border-gray-100">
      
      <div className="mb-4">
        <input
          type="text"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
          className="border-gray-200 shadow-sm rounded-md px-3 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-flex-dark-green focus:border-transparent"
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="p-3 text-left ...">
                    <div className="flex items-center justify-between">
                      <div onClick={header.column.getToggleSortingHandler()} className="cursor-pointer select-none flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: <ChevronUpIcon/>, desc: <ChevronDownIcon/> }[header.column.getIsSorted()] ?? null}
                      </div>
                      {header.column.getCanFilter() ? (
                        <AdvancedFilter column={header.column} table={table} />
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <Fragment key={row.id}>
                <tr className="hover:bg-flex-cream border-b border-gray-100">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-3 text-sm text-flex-text-primary align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                {/* --- EXPANDED CONTENT ROW --- */}
                {row.getIsExpanded() && (
                  <tr className="border-b-2 border-flex-dark-green">
                    <td colSpan={row.getVisibleCells().length}>
                      <ReviewDetailCard review={row.original} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-flex-text-secondary">
          <span className="text-sm text-gray-600">
            Page{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {'<<'}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {'<'}
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {'>'}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {'>>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsTable;