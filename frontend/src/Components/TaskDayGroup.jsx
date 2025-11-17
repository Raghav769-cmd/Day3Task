import TaskItem from './TaskItem';

const TaskDayGroup = ({ date, total, tasks, onDelete, onEdit }) => {
  // Separate tasks into morning (before 14:00) and afternoon (after 14:00)
  const morningTasks = tasks.filter(task => {
    const [hours] = task.start_time.split(':').map(Number);
    return hours < 14;
  });

  const afternoonTasks = tasks.filter(task => {
    const [hours] = task.start_time.split(':').map(Number);
    return hours >= 14;
  });

  // Calculate totals for each section
  const calculateTotal = (taskList) => {
    const totalMinutes = taskList.reduce((sum, task) => {
      const [h, m] = task.duration.split(':').map(Number);
      return sum + h * 60 + m;
    }, 0);
    return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
  };

  const morningTotal = calculateTotal(morningTasks);
  const afternoonTotal = calculateTotal(afternoonTasks);

  return (
    <div className="mb-4">
      <div className="bg-blue-50 text-gray-700 px-4 py-2 rounded-t flex justify-between items-center text-sm">
        <span>{date}</span>
        <span className="font-bold">Total: <span className="text-blue-600">{total} Hrs</span></span>
      </div>
      <div className="bg-white shadow rounded-b">
        {/* Morning Tasks Section */}
        {morningTasks.length > 0 && (
          <div className="border-b border-gray-100">
            <div className="bg-green-50 text-gray-700 px-4 py-2 flex justify-between items-center text-sm font-medium">
              <span>🌅 Morning Tasks (Before 14:00)</span>
              <span className="text-green-600">{morningTotal} Hrs</span>
            </div>
            <div className="px-2">
              {morningTasks.map((task) => (
                <TaskItem key={task.id} {...task} onDelete={onDelete} onEdit={onEdit} />
              ))}
            </div>
          </div>
        )}

        {/* Afternoon Tasks Section */}
        {afternoonTasks.length > 0 && (
          <div>
            <div className="bg-orange-50 text-gray-700 px-4 py-2 flex justify-between items-center text-sm font-medium">
              <span>🌞 Afternoon Tasks (After 14:00)</span>
              <span className="text-orange-600">{afternoonTotal} Hrs</span>
            </div>
            <div className="px-2">
              {afternoonTasks.map((task) => (
                <TaskItem key={task.id} {...task} onDelete={onDelete} onEdit={onEdit} />
              ))}
            </div>
          </div>
        )}

        {/* Show message if no tasks */}
        {morningTasks.length === 0 && afternoonTasks.length === 0 && (
          <div className="text-gray-400 text-center py-4">No tasks for this day</div>
        )}
      </div>
    </div>
  );
};

export default TaskDayGroup;
