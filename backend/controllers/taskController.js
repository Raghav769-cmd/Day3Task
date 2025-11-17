const db = require('../db/connection');

exports.getAllTaskTemplates = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM task_templates');
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks');
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err); 
    res.status(500).json({ error: err.message });
  }
};

// Add new task to DB
exports.addTask = async (req, res) => {
  const { project, description, start_time, end_time, duration, date, icon } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO tasks (project, description, start_time, end_time, duration, date, icon) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [project, description, start_time, end_time, duration, date, icon]
    );
    res.status(201).json({ id: result.insertId, project, description, start_time, end_time, duration, date, icon });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id, project, description } = req.body;

  try {
    await db.query(
      'UPDATE tasks SET project = ?, description = ? WHERE id = ?',
      [project, description, id]
    );
    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
};