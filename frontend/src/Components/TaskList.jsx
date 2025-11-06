import React, { useEffect, useState } from 'react';
import TaskDayGroup from './TaskDayGroup';
import WeekSummary from './WeekSummary';

function groupTasksByDate(tasks) {
  const groups = {};
  tasks.forEach(task => {
    const dateObj = new Date(task.date);
    const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (!groups[dateStr]) groups[dateStr] = [];
    groups[dateStr].push(task);
  });
  return Object.entries(groups).map(([date, tasks]) => {
    // Calculate total duration for the day
    let totalMinutes = tasks.reduce((sum, t) => {
      const [h, m] = t.duration.split(':').map(Number);
      return sum + h * 60 + m;
    }, 0);
    const totalHrs = `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
    return { date, total: totalHrs, tasks };
  });
}

function getWeekRange(date = new Date(), offset = 0) {
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday + offset * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return [monday, sunday];
}

function filterTasksByWeek(tasks, weekStart, weekEnd) {
  return tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate >= weekStart && taskDate <= weekEnd;
  });
}

function getWeekLabel(weekStart, weekEnd) {
  const options = { month: 'short', day: '2-digit' };
  return `${weekStart.toLocaleDateString('en-US', options)} - ${weekEnd.toLocaleDateString('en-US', options)}`;
}

function getWeekTotal(tasks) {
  let totalMinutes = tasks.reduce((sum, t) => {
    const [h, m] = t.duration.split(':').map(Number);
    return sum + h * 60 + m;
  }, 0);
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
}

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/tasks')
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch tasks');
        setLoading(false);
      });
  }, []);

  // Calculate week ranges
  const now = new Date();
  const [currStart, currEnd] = getWeekRange(now, 0);
  const [prevStart, prevEnd] = getWeekRange(now, -1);

  // Filter and sort tasks by week and day
  const sortTasksByDate = (tasks) => {
    return [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const groupTasksByDay = (tasks) => {
    const groups = {};
    tasks.forEach(task => {
      const dateStr = new Date(task.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(task);
    });
    return Object.entries(groups).sort((a, b) => new Date(a[1][0].date) - new Date(b[1][0].date));
  };

  const currentWeekTasks = sortTasksByDate(filterTasksByWeek(tasks, currStart, currEnd));
  const previousWeekTasks = sortTasksByDate(filterTasksByWeek(tasks, prevStart, prevEnd));

  const currentWeekGroups = groupTasksByDay(currentWeekTasks);
  const previousWeekGroups = groupTasksByDay(previousWeekTasks);

  return (
    <div className="mt-2">
      {/* Current Week */}
      {loading ? <div className="text-gray-500">Loading...</div> :
        currentWeekTasks.length === 0 ? (
          <div className="text-gray-400">No tasks found.</div>
        ) : (
          <>
            {currentWeekGroups.length > 0 && currentWeekGroups[0][1].length > 0 && (
              <WeekSummary weekRange={getWeekLabel(currStart, currEnd)} total={getWeekTotal(currentWeekTasks)} />
            )}
            {currentWeekGroups.map(([date, dayTasks]) => {
              let totalMinutes = dayTasks.reduce((sum, t) => {
                const [h, m] = t.duration.split(':').map(Number);
                return sum + h * 60 + m;
              }, 0);
              const totalHrs = `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
              return <TaskDayGroup key={date} date={date} total={totalHrs} tasks={dayTasks} />;
            })}
          </>
        )
      }
      {/* Previous Week */}
      {loading ? <div className="text-gray-500">Loading...</div> :
        <>
          <WeekSummary weekRange={getWeekLabel(prevStart, prevEnd)} total={getWeekTotal(previousWeekTasks)} />
          {previousWeekTasks.length === 0 ? (
            <div className="text-gray-400">No tasks found.</div>
          ) : (
            previousWeekGroups.map(([date, dayTasks], idx) => {
              let totalMinutes = dayTasks.reduce((sum, t) => {
                const [h, m] = t.duration.split(':').map(Number);
                return sum + h * 60 + m;
              }, 0);
              const totalHrs = `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
              return <TaskDayGroup key={date} date={date} total={totalHrs} tasks={dayTasks} />;
            })
          )}
        </>
      }
    </div>
  );
};

export default TaskList;
