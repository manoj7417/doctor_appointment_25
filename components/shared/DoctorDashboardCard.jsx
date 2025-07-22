import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function DashboardCard({ title, value, change, isPositive }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <span
          className={`ml-2 flex items-center text-sm font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? (
            <FaArrowUp className="h-3 w-3" />
          ) : (
            <FaArrowDown className="h-3 w-3" />
          )}
          <span className="sr-only">
            {isPositive ? "Increased" : "Decreased"} by
          </span>
          {change}
        </span>
      </div>
    </div>
  );
}
