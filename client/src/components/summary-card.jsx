export default function SummaryCard({ title, value, note }) {
    return (
      <div className="bg-white p-6 rounded-xl shadow space-y-2">
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-xs text-green-600">{note}</p>
      </div>
    );
  }