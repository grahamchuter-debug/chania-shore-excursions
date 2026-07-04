export function ComparisonTable({ rows, portA, portB }: { rows: { category: string; portA: string; portB: string }[]; portA: string; portB: string }) {
  return (
    <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-coastal-800 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">{portA}</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">{portB}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row) => (
            <tr key={row.category}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.category}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.portA}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.portB}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
