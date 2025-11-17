const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.getAllTasks);
router.get('/all-tasks', taskController.getAllTaskTemplates);
router.post('/add', taskController.addTask); // Add new task
router.put('/:id', taskController.updateTask); // Update task
router.delete('/:id', taskController.deleteTask); // Delete task

module.exports = router;