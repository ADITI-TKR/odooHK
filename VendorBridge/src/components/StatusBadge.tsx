const styles: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Approved: 'bg-green-100 text-green-700',
  Received: 'bg-green-100 text-green-700',
  Pending: 'bg-orange-100 text-orange-700',
  Open: 'bg-blue-100 text-blue-700',
  Rejected: 'bg-red-100 text-red-700',
  Inactive: 'bg-gray-100 text-gray-600',
  Draft: 'bg-gray-100 text-gray-600',
  Closed: 'bg-gray-100 text-gray-600',
  Sent: 'bg-purple-100 text-purple-700',
  'In Stock': 'bg-green-100 text-green-700',
  'Low Stock': 'bg-yellow-100 text-yellow-700',
  'Out of Stock': 'bg-red-100 text-red-700',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}
