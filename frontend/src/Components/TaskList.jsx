import { useEffect, useState } from "react";
import TaskDayGroup from "./TaskDayGroup";
import WeekSummary from "./WeekSummary";
import SimpleDialog from "./SimpleDialog";

function getWeekRange(date = new Date(), offset = 0) {
  const day = date.getDay();
  const diffToSunday = -day;
  const sunday = new Date(date);
  sunday.setDate(date.getDate() + diffToSunday + offset * 7);
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  return [sunday, saturday];
}

function getWeekLabel(weekStart, weekEnd) {
  const options = { month: "short", day: "2-digit" };
  return `${weekStart.toLocaleDateString(
    "en-US",
    options
  )} - ${weekEnd.toLocaleDateString("en-US", options)}`;
}

function getWeekTotal(tasks) {
  let totalMinutes = tasks.reduce((sum, t) => {
    const [h, m] = t.duration.split(":").map(Number);
    return sum + h * 60 + m;
  }, 0);
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(
    totalMinutes % 60
  ).padStart(2, "0")}`;
}

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog state
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'OK',
    cancelText: 'Cancel',
    showCancel: true
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
        console.log(data)
      })
      .catch(() => {
        setError("Failed to fetch tasks");
        setLoading(false);
      });
  }, []);

  const deleteTask = async (id) => {
    const performDelete = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setTasks(tasks.filter(task => task.id !== id));
          setDialog({
            isOpen: true,
            title: 'Success',
            message: 'Task deleted successfully!',
            onConfirm: () => {},
            confirmText: 'OK',
            showCancel: false,
            isNotification: true
          });
        } else {
          setDialog({
            isOpen: true,
            title: 'Error',
            message: 'Failed to delete task',
            onConfirm: () => {},
            confirmText: 'OK',
            showCancel: false,
            isNotification: true
          });
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        setDialog({
          isOpen: true,
          title: 'Error',
          message: 'Error deleting task',
          onConfirm: () => {},
          confirmText: 'OK',
          showCancel: false,
          isNotification: true
        });
      }
    };

    setDialog({
      isOpen: true,
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this task?',
      onConfirm: performDelete,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      showCancel: true
    });
  };

  const editTask = async (id, updatedTask) => {
    try {
      console.log('Updating task:', id, updatedTask);
      const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updatedTask }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        // Update the task in the local state
        setTasks(tasks.map(task =>
          task.id === id
            ? { ...task, ...updatedTask }
            : task
        ));
        setDialog({
          isOpen: true,
          title: 'Success',
          message: 'Task updated successfully!',
          onConfirm: () => {},
          confirmText: 'OK',
          showCancel: false,
          isNotification: true
        });
      } else {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        setDialog({
          isOpen: true,
          title: 'Error',
          message: 'Failed to update task',
          onConfirm: () => {},
          confirmText: 'OK',
          showCancel: false,
          isNotification: true
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setDialog({
        isOpen: true,
        title: 'Error',
        message: 'Error updating task',
        onConfirm: () => {},
        confirmText: 'OK',
        showCancel: false,
        isNotification: true
      });
    }
  };

  const sortTasksByDate = (tasks) => {
    return [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const groupTasksByDay = (tasks) => {
    const groups = {};
    tasks.forEach((task) => {
      const dateStr = new Date(task.date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(task);
    });
    return Object.entries(groups).sort(
      (a, b) => new Date(a[1][0].date) - new Date(b[1][0].date)
    );
  };

  const sortedTasks = sortTasksByDate(tasks);
  const weeks = {};
  sortedTasks.forEach(task => {
    const [weekStart, weekEnd] = getWeekRange(new Date(task.date), 0);
    const key = weekStart.toISOString().slice(0, 10); 
    if (!weeks[key]) weeks[key] = { start: weekStart, end: weekEnd, tasks: [] };
    weeks[key].tasks.push(task);
  });
  const weekList = Object.values(weeks).sort((a, b) => b.start - a.start);

  return (
    <div className="mt-2">
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : weekList.length === 0 ? (
        <div className="text-gray-400">No tasks found.</div>
      ) : (
        weekList.map((week, weekIdx) => {
          const { start, end, tasks: weekTasks } = week;
          const weekLabel = getWeekLabel(start, end);
          const total = getWeekTotal(weekTasks);
          const dayGroups = groupTasksByDay(weekTasks);
          return (
            <div key={weekIdx}>
              <WeekSummary weekRange={weekLabel} total={total} />
              {dayGroups.map(([date, dayTasks]) => {
                let totalMinutes = dayTasks.reduce((sum, t) => {
                  const [h, m] = t.duration.split(":").map(Number);
                  return sum + h * 60 + m;
                }, 0);
                const totalHrs = `${String(Math.floor(totalMinutes / 60)).padStart(
                  2,
                  "0"
                )}:${String(totalMinutes % 60).padStart(2, "0")}`;
                return (
                  <TaskDayGroup
                    key={date}
                    date={date}
                    total={totalHrs}
                    tasks={dayTasks}
                    onDelete={deleteTask}
                    onEdit={editTask}
                  />
                );
              })}
            </div>
          );
        })
      )}
      <SimpleDialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog({ ...dialog, isOpen: false })}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        showCancel={dialog.showCancel}
        isNotification={dialog.isNotification}
      />
    </div>
  );
};

export default TaskList;
