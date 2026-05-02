export default function StatusBadge({ status }) {
  const styles = {
    OPEN: "bg-blue-500",
    INVESTIGATING: "bg-purple-500",
    RESOLVED: "bg-green-600",
    CLOSED: "bg-gray-500",
  };

  return (
    <span className={`px-2 py-1 text-xs text-white rounded ${styles[status]}`}>
      {status}
    </span>
  );
}