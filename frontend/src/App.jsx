import { useEffect, useState } from "react";
import { fetchTasks, createTask, updateTaskTitle, removeTask, toggleTaskStatus } from "./api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // Load tasks from MongoDB when the page opens
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        setError("Could not load tasks. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    try {
      const newTask = await createTask(title.trim());
      setTasks([newTask, ...tasks]);
      setTitle("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    setError("");
    try {
      await removeTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleTask = async (id) => {
    setError("");
    try {
      const updatedTask = await toggleTaskStatus(id);
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStartEdit = (task) => {
    setError("");
    setEditingId(task._id);
    setEditTitle(task.title);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const handleSaveEdit = async (id) => {
    setError("");
    if (!editTitle.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    try {
      const updatedTask = await updateTaskTitle(id, editTitle.trim());
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
      handleCancelEdit();
    } catch (err) {
      setError(err.message);
    }
  };

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="container">
      <h1 className="title">Student Task Manager</h1>
      <p className="subtitle">
        {tasks.length > 0
          ? `${completedCount} of ${tasks.length} tasks completed`
          : "Stay organized and get things done"}
      </p>

      <form className="task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          className="task-input"
          placeholder="Enter a task title..."
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit" className="btn add-btn">
          Add Task
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p className="info-message">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="info-message">No tasks available. Add your first task!</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              {editingId === task._id ? (
                <>
                  <input
                    type="text"
                    className="task-input edit-input"
                    value={editTitle}
                    maxLength={100}
                    autoFocus
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(task._id);
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                  />
                  <div className="task-actions">
                    <button className="btn save-btn" onClick={() => handleSaveEdit(task._id)}>
                      Save
                    </button>
                    <button className="btn cancel-btn" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <label className="task-label">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task._id)}
                    />
                    <span className={task.completed ? "task-text completed" : "task-text"}>
                      {task.title}
                    </span>
                  </label>
                  <div className="task-actions">
                    <button className="btn edit-btn" onClick={() => handleStartEdit(task)}>
                      Edit
                    </button>
                    <button className="btn delete-btn" onClick={() => handleDeleteTask(task._id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
