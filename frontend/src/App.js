import React, { useState, useEffect } from 'react';
import API from './api';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import { GoogleLogin } from '@react-oauth/google';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [sortOrder, setSortOrder] = useState('oldest');
  const [user, setUser] = useState(null); // User state for authentication

  useEffect(() => {
    fetchTasks();
  }, [sortOrder]); // Re-fetch tasks when sort order changes

  const fetchTasks = async () => {
    try {
      const response = await API.get('/tasks');
      let sortedTasks = response.data;
      // Sort based on the selected sortOrder
      if (sortOrder === 'newest') {
        sortedTasks = sortedTasks.sort((a, b) => b.id - a.id);
      } else {
        sortedTasks = sortedTasks.sort((a, b) => a.id - b.id);
      }
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleGoogleLogin = (credentialResponse) => {
    const { credential } = credentialResponse;
    const userData = JSON.parse(atob(credential.split('.')[1])); // Decode JWT to get user data
    setUser(userData); // Set user state
  };

  const handleLogout = () => {
    setUser(null); // Clear user state on logout
  };

  const handleAddTask = async () => {
    if (!user) {
      alert("Please log in with Google to add a task.");
      return; // Prevent action if not authenticated
    }
    const newTask = { title: newTitle, description: newDescription, completed: false };
    try {
      await API.post('/tasks', newTask);
      fetchTasks(); // Refresh tasks after adding
      setNewTitle('');
      setNewDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!user) {
      alert("Please log in with Google to delete a task.");
      return; // Prevent action if not authenticated
    } // Prevent action if not authenticated
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks(); // Refresh tasks after deletion
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setCurrentEditIndex(task.id); // Use task ID for editing
  };

  const handleUpdateTask = async () => {
    if (!user) {
      alert("Please log in with Google to edit a task.");
      return; // Prevent action if not authenticated
    }// Prevent action if not authenticated
    if (currentTask) {
      try {
        await API.put(`/tasks/${currentTask.id}`, currentTask);
        fetchTasks(); // Refresh tasks after updating
        setCurrentTask(null);
        setCurrentEditIndex(null);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const handleCompleteTask = async (task) => {
    if (!user) {
      alert("Please log in with Google to complete a task.");
      return; // Prevent action if not authenticated
    } // Prevent action if not authenticated
    const taskToComplete = {
      ...task,
      completed: true,
    };
    try {
      await API.put(`/tasks/${task.id}`, taskToComplete);
      fetchTasks(); // Refresh tasks after completing
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <div className="App">
      
      <div className="google-auth-container">
        {!user ? (
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={(error) => console.error('Login failed:', error)}
            className="google-auth-button"
          />
        ) : (
          <button onClick={handleLogout} className="logoutBtn">Logout</button>
        )}
      </div>
      <h1>Task Manager</h1>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the task title?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the task description?"
            />
          </div>
          <div className="todo-input-item">
            <button type="button" onClick={handleAddTask} className="primaryBtn">
              Add a Task
            </button>
          </div>
        </div>

        <div className="btn-area">
          <div className="btn-group">
            <button
              className={`secondaryBtn ${!isCompleteScreen && 'active'}`}
              onClick={() => setIsCompleteScreen(false)}
            >
              My Tasks
            </button>
            <button
              className={`secondaryBtn ${isCompleteScreen && 'active'}`}
              onClick={() => setIsCompleteScreen(true)}
            >
              Completed
            </button>
          </div>
          <div className="sort-dropdown">
            <label>Sort by:</label>
            <select value={sortOrder} onChange={handleSortChange}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="todo-list">
          {!isCompleteScreen && tasks.filter(task => !task.completed).map((task) => (
            <div className="todo-list-item" key={task.id}>
              {currentEditIndex === task.id ? (
                <div className="edit__wrapper">
                  <input
                    placeholder='Updated Title'
                    value={currentTask?.title}
                    onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                  />
                  <textarea
                    placeholder='Updated Description'
                    rows={4}
                    value={currentTask?.description}
                    onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                  />
                  <button type="button" onClick={handleUpdateTask} className="primaryBtn">
                    Update
                  </button>
                </div>
              ) : (
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete?"
                    />
                    <BsCheckLg
                      className="check-icon"
                      onClick={() => handleCompleteTask(task)}
                      title="Complete?"
                    />
                    <AiOutlineEdit
                      className="check-icon"
                      onClick={() => handleEditTask(task)}
                      title="Edit?"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isCompleteScreen && tasks.filter(task => task.completed).map((task) => (
            <div className="todo-list-item" key={task.id}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>
              <div>
                <AiOutlineDelete
                  className="icon"
                  onClick={() => handleDeleteTask(task.id)}
                  title="Delete?"
                />
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
}

export default App;
