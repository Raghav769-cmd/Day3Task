import { useState, useRef, useEffect } from 'react';

const TaskInput = () => {
  const [project, setProject] = useState('');
  const [description, setDescription] = useState('');
  const [timerActive, setTimerActive] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [dollarActive, setDollarActive] = useState(false);
  const [input, setInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [taskOptions, setTaskOptions] = useState([]);
  const [lastTaskId, setLastTaskId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const intervalRef = useRef(null);

  const handleAddTaskToDB = async (startTime) => {
    if (!input || !project) return null;
    const taskData = {
      description,
      project,
      start_time: startTime || '00:00:00',
      end_time: '00:00:00',
      duration: '00:00',
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      icon: 'lock'
    };
    try {
      const res = await fetch('http://localhost:3000/api/tasks/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (res.ok) {
        const data = await res.json();
        setInput('');
        setProject('');
        setDescription('');
        return data.id;
      }
    } catch (err) {
    }
    return null;
  };

  const fetchTasks = () => {
    if (!showDropdown) {
      fetch('http://localhost:3000/api/tasks/all-tasks')
        .then(res => res.json())
        .then(data => setTaskOptions(data))
        .catch(() => setTaskOptions([]));
    }
    setShowDropdown((prev) => !prev);
  };

  const formatSystemTime = (date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const calculateDuration = (startTime, endTime) => {
    const [sh, sm, ss] = startTime.split(':').map(Number);
    const [eh, em, es] = endTime.split(':').map(Number);
    const startSeconds = sh * 3600 + sm * 60 + ss;
    const endSeconds = eh * 3600 + em * 60 + es;
    let diffSeconds = endSeconds - startSeconds;
    if (diffSeconds < 0) diffSeconds += 86400;
    const h = Math.floor(diffSeconds / 3600);
    const m = Math.floor((diffSeconds % 3600) / 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (!timerActive) {
      setTimerActive(true);
      setCurrentTime(formatSystemTime(new Date()));
    } else {
      setTimerActive(false);
    }
  };

  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(formatSystemTime(new Date()));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerActive]);

  const handleDollarToggle = () => {
    setDollarActive((prev) => !prev);
  };

  const handleTaskSelect = (taskName) => {
    setInput(taskName);
    setDescription(taskName);
    setShowDropdown(false);
  };

return (
    <div className="bg-white shadow rounded flex items-center p-4 mt-4 relative">
      <input
        className="flex-1 border border-gray-300 rounded px-3 py-2 mr-2"
        placeholder="What are you working on?"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <input
        className="flex-1 border border-gray-300 rounded px-3 py-2 mr-2"
        placeholder="Project name"
        value={project}
        onChange={e => setProject(e.target.value)}
      />
      <div className="relative flex items-center">
        <button className="text-blue-500 px-2 cursor-pointer hover:bg-gray-300 rounded transition-colors duration-200" type="button" onClick={fetchTasks}>
          Task
        </button>
        {showDropdown && (
          <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-300 rounded shadow z-10 max-h-60 overflow-y-auto">
            {taskOptions.length === 0 && <div className="p-2 text-gray-400">No tasks found.</div>}
            {taskOptions.map((task) => (
              <div
                key={task.id}
                className="p-2 cursor-pointer transition-colors duration-200 hover:bg-blue-100"
                onClick={() => handleTaskSelect(task.name)}
              >
                {task.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        className={`cursor-pointer mx-2 px-2 py-1 rounded ${dollarActive ? 'bg-blue-100 text-blue-700 border border-blue-400' : 'text-blue-500'}`}
        onClick={handleDollarToggle}
        type="button"
      >
        $
      </button>
      <span className="mx-2 font-mono w-24 text-center">{timerActive ? currentTime : '00:00:00'}</span>
      <button
        className={`cursor-pointer hover:bg-blue-400 transition-colors duration-200 px-4 py-2 rounded ml-2 ${timerActive ? 'bg-red-500' : 'bg-blue-500'} text-white`}
        onClick={async () => {
          if (!timerActive) {
            const startTimeStr = formatSystemTime(new Date());
            const id = await handleAddTaskToDB(startTimeStr);
            if (id) {
              setLastTaskId(id);
              setTimerActive(true);
              setStartTime(startTimeStr);
              setCurrentTime(startTimeStr);
            }
          } else {
            if (lastTaskId) {
              const endTime = formatSystemTime(new Date());
              const duration = calculateDuration(startTime, endTime);
              await fetch('http://localhost:3000/api/tasks/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: lastTaskId, end_time: endTime, duration })
              });
            }
            setTimerActive(false);
            setLastTaskId(null);
            setStartTime(null);
          }
        }}
        type="button"
      >
        {timerActive ? 'STOP' : 'START'}
      </button>
    </div>
  );
};

export default TaskInput;
