const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();

const Todo = require('./models/Todo')
const app = express();

//Middleware
app.use(cors());               //Allows cross-origin requests (e.g., from frontend to backend)
app.use(express.json());       // Allows server to parse JSON request bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Error connecting to MongoDB', err));

// --- API Routes ---

// GET: Fetch All Todos
app.get('/todos', async(req, res)=>{
    const todos = await Todo.find();
    res.json(todos);
});

// POST: Create a New Todo
app.post('/todo/new', async(req, res) =>{
    const todo = new Todo({
        text: req.body.text
    });
    await todo.save();
    res.json(todo)
})

// PUT: Toggle completion status
app.put('/todo/complete/:id', async(req,res)=>{
    const todo = await Todo.findById(req.params.id);
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
});

// DELETE: Remove a Todo
app.delete('/todo/delete/:id',  async(req,res)=>{
    const result = await Todo.findByIdAndDelete(req.params.id);
    res.json(result);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));