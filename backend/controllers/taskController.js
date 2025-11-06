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