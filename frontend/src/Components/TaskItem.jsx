const TaskItem = ({ project, description, start_time, end_time, duration }) => (
  <div className="flex items-center border-b last:border-b-0 px-4 py-3 text-sm">
    <div className="flex-1">
      <span className="font-bold text-gray-800">{project}</span>
      <span className="mx-2 text-gray-500">●</span>
      <span className="text-gray-600">{description}</span>
    </div>
    <span className="text-blue-500 mx-2">$</span>
    <span className="mx-2">{start_time} - {end_time}</span>
    <span className="mx-2">{duration}</span>
    <span className="mx-2 text-gray-400">🔒</span>
  </div>
);

export default TaskItem;
