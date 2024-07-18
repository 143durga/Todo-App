const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Create a new task
router.post('/', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Read all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Read a single task
router.get('/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update a task
router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
