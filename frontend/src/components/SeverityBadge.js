export default function SeverityBadge({ level }) {
  const colors = {
    P0: "bg-red-500",
    P1: "bg-orange-500",
    P2: "bg-yellow-500",
    P3: "bg-green-500",
  };

  return (
    <span className={`px-2 py-1 text-xs text-white rounded ${colors[level]}`}>
      {level}
    </span>
  );
}