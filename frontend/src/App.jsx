import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE= "http://localhost:5000";


const App = () => {

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');


  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/todos`);
      setTodos(res.data);
    }
    catch (err) {
      console.error('Error fetching todos', err);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return; // Do not add empty todos
    try {
      const res = await axios.post(`${API_BASE}/todo/new`, { text: newTodo });
      setTodos([...todos, res.data]);
      setNewTodo(''); // Clear input field
    }
    catch (err) {
      console.error('Error adding todo', err);
    }
  }

  // Toggle completion status
  const completeTodo = async (id) => {
    try {
      const res = await axios.put(`${API_BASE}/todo/complete/${id}`);
      setTodos(todos.map(todo => (todo._id === res.data._id ? res.data : todo)));
    }
    catch (err) {
      console.error("Error completing todo", err);
    }
  }

  // Delete a todo
  const deleteTodo = async (id)=>{
    try{
      const res = await axios.delete(`${API_BASE}/todo/delete/${id}`);
      setTodos(todos.filter(todo => todo._id !== res.data._id)); // remove from UI
    }
    catch(err){
      console.error('Error Deleting Todo', err);
    }
  }


  return (
    <div className="App">
      <h1 style={{textAlign: 'center'}}>MERN To-Do App</h1>

      <div className="add-todo">
        <input
         type="text" 
         value={newTodo}
         onChange={(e) => setNewTodo(e.target.value)}
         placeholder='Add a new task...'
         />
         <button className="add-btn" onClick={addTodo} >Add</button>
      </div>

      <div className="todos">
        {todos.map(todo => (
          <div className={`todo-item ${todo.completed ? "is-complete" : ""}`} key={todo._id}>
            <div className="text" onClick={() => completeTodo(todo._id)} style={{cursor: 'pointer'}}>
              {todo.text}
            </div>
            <button className="delete-btn" onClick={() => deleteTodo(todo._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
