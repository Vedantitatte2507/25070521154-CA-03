import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');

  // Fetch tasks from backend server on load
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Error connecting to backend:', err));
  }, []);

  // Add a new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority, status }),
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setStatus('Pending');
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter((task) => task._id !== id && task.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50' }}>FLEXI Task Dashboard</h1>
        <p style={{ color: '#7f8c8d' }}>Manage your tasks efficiently with Node.js & React</p>
      </header>

      {/* Task Form */}
      <form onSubmit={addTask} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>Add New Task</h3>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Task Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <textarea
            placeholder="Task Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', height: '80px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button type="submit" style={{ background: '#3498db', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
          Add Task
        </button>
      </form>

      {/* Task List */}
      <div>
        <h3>Your Tasks ({tasks.length})</h3>
        {tasks.length === 0 ? (
          <p style={{ color: '#95a5a6', fontStyle: 'italic' }}>No tasks found. Add one above!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map((task) => (
              <li key={task._id || task.id} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '6px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#2d3748' }}>{task.title}</h4>
                  <p style={{ margin: '0 0 8px 0', color: '#4a5568', fontSize: '14px' }}>{task.description}</p>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                    <span style={{ background: '#edf2f7', padding: '2px 8px', borderRadius: '4px' }}>Priority: {task.priority}</span>
                    <span style={{ background: '#edf2f7', padding: '2px 8px', borderRadius: '4px' }}>Status: {task.status}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task._id || task.id)}
                  style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', height: 'fit-content' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
