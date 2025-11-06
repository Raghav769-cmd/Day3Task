import TaskItem from './TaskItem';

const TaskDayGroup = ({ date, total, tasks }) => (
  <div className="mb-4">
    <div className="bg-blue-50 text-gray-700 px-4 py-2 rounded-t flex justify-between items-center text-sm">
      <span>{date}</span>
      <span className="font-bold">Total: <span className="text-blue-600">{total} Hrs</span></span>
    </div>
    <div className="bg-white shadow rounded-b">
      {tasks.map((task, idx) => (
        <TaskItem key={idx} {...task} />
      ))}
    </div>
  </div>
);

export default TaskDayGroup;
