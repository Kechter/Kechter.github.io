const express = require('express');
const mongoose = require('mongoose');
const Todo = require('../models/todo');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    console.log("Fetched todos:", todos); // Add this line
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title } = req.body;
  try {
    const todo = new Todo({ title });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
