'use client'

import { useState } from 'react'
import { useTable } from 'react-table'
import { TrafficRowSchema } from '@/lib/schemas/trafficRow'

interface MappingTableProps {
  files: File[]
  onMappingComplete: (data: any) => void
}

const CANONICAL_COLUMNS = Object.keys(TrafficRowSchema.shape)

export default function MappingTable({ files, onMappingComplete }: MappingTableProps) {
  const [mappings, setMappings] = useState<Record<string, string>>({})
  const [sampleData, setSampleData] = useState<any[]>([])

  // TODO: Implement file parsing and AI mapping
  const handleFileParse = async (file: File) => {
    // This is a placeholder - implement actual file parsing
    console.log('Parsing file:', file.name)
  }

  const handleMappingChange = (sourceColumn: string, targetColumn: string) => {
    setMappings(prev => ({
      ...prev,
      [sourceColumn]: targetColumn,
    }))
  }

  const columns = [
    {
      Header: 'Source Column',
      accessor: 'source',
    },
    {
      Header: 'Mapped To',
      accessor: 'target',
      Cell: ({ row }: any) => (
        <select
          value={mappings[row.original.source] || ''}
          onChange={(e) => handleMappingChange(row.original.source, e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Select mapping</option>
          {CANONICAL_COLUMNS.map(col => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      ),
    },
  ]

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: sampleData,
  })

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
            Column Mapping
          </h3>
          <div className="mt-4">
            <table
              {...getTableProps()}
              className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
              <thead className="bg-gray-50 dark:bg-gray-700">
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th
                        {...column.getHeaderProps()}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
              >
                {rows.map(row => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <td
                          {...cell.getCellProps()}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onMappingComplete(mappings)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
        >
          Continue
        </button>
      </div>
    </div>
  )
} 