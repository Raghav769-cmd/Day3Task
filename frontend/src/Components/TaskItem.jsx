import { useState } from 'react';

const TaskItem = ({ id, project, description, start_time, end_time, duration, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    project,
    description,
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData({
      project,
      description,
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    onEdit(id, editData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isEditing) {
    return (
      <div className="border-b last:border-b-0 px-4 py-3 text-sm bg-yellow-50">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={editData.project}
              onChange={(e) => handleInputChange('project', e.target.value)}
              className="flex-1 px-2 py-1 border rounded text-sm font-bold"
              placeholder="Project"
            />
            <input
              type="text"
              value={editData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="flex-1 px-2 py-1 border rounded text-sm"
              placeholder="Description"
            />
          </div>
          <div className="flex space-x-2 items-center justify-end">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center border-b last:border-b-0 px-4 py-3 text-sm">
      <div className="flex-1">
        <span className="font-bold text-gray-800">{project}</span>
        <span className="mx-2 text-gray-500">●</span>
        <span className="text-gray-600">{description}</span>
      </div>
      <span className="text-blue-500 mx-2">$</span>
      <span className="mx-2">{start_time} - {end_time}</span>
      <span className="mx-2">{duration}</span>

      {/* Edit Button */}
      <button
        onClick={handleEdit}
        className="mx-1 text-blue-500 hover:text-blue-700 cursor-pointer"
        title="Edit task"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(id)}
        className="mx-1 text-red-500 hover:text-red-700 cursor-pointer"
        title="Delete task"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default TaskItem;
