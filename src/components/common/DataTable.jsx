import { motion } from "framer-motion";

export default function DataTable({
  title,
  columns,
  data,
  loading = false,
  actions = null,           // Custom action buttons per row
  emptyMessage = "No records found"
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow overflow-hidden">
      {title && (
        <div className="px-8 py-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-8 py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
              {actions && <th className="px-8 py-5 w-32"></th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.03 }}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-8 py-6 text-gray-700">
                      {col.accessor ? col.accessor(row) : row[col.key]}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-8 py-6">
                      <div className="flex gap-3 justify-end">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-8 py-20 text-center">
                  <p className="text-gray-400 text-lg">{emptyMessage}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}