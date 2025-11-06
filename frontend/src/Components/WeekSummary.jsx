const WeekSummary = ({ weekRange, total = '00:00' }) => (
  <div className="flex justify-between items-center mt-8 mb-2 px-2">
    <span className="text-gray-600 font-semibold">{weekRange}</span>
    <span className="text-gray-700 font-bold">Week total: <span className="text-blue-600">{total} Hrs</span></span>
  </div>
);

export default WeekSummary;
