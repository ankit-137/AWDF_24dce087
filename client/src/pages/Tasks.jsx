/**
 * pages/Tasks.jsx
 * Full CRUD Task Manager page connected to the Express + MongoDB backend.
 *
 * Features:
 *  - Fetch all tasks on load (with loading/error state)
 *  - Create a task via form (with per-action loading/error)
 *  - Toggle completed status inline
 *  - Delete a task (with per-task loading indicator)
 *  - Edit task title inline
 */

import { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks';

// ── Small sub-component: single task row ────────────────────────
function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editError, setEditError] = useState(null);

  async function handleToggle() {
    setToggling(true);
    await onToggle(task._id, !task.completed);
    setToggling(false);
  }

  async function handleDelete() {
    setDeleting(true);
    await onDelete(task._id);
    // no need to setDeleting(false) — component unmounts on success
  }

  async function handleEditSave() {
    setEditError(null);
    try {
      await onEdit(task._id, editTitle.trim());
      setEditing(false);
    } catch (err) {
      setEditError(err.message);
    }
  }

  return (
    <li className={`task-card ${task.completed ? 'task-completed' : ''}`}>
      <div className="task-main">
        {/* Completed toggle checkbox */}
        <input
          type="checkbox"
          className="task-check"
          checked={task.completed}
          disabled={toggling}
          onChange={handleToggle}
          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />

        {/* Title — normal view or inline edit */}
        {editing ? (
          <div className="task-edit-group">
            <input
              className="task-edit-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditSave()}
              autoFocus
            />
            {editError && <span className="task-edit-error">{editError}</span>}
            <div className="task-edit-actions">
              <button className="btn-save" onClick={handleEditSave}>Save</button>
              <button className="btn-cancel" onClick={() => { setEditing(false); setEditTitle(task.title); }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="task-info">
            <span className="task-title">{task.title}</span>
            {task.description && (
              <span className="task-desc">{task.description}</span>
            )}
            <span className="task-date">
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!editing && (
        <div className="task-actions">
          <button
            className="btn-edit"
            onClick={() => setEditing(true)}
            aria-label="Edit task"
          >
            Edit
          </button>
          <button
            className="btn-delete"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete task"
          >
            {deleting ? '...' : 'Delete'}
          </button>
        </div>
      )}
    </li>
  );
}

// ── Main Tasks page ─────────────────────────────────────────────
function Tasks() {
  const [tasks, setTasks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Create-form state
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating]       = useState(false);
  const [createError, setCreateError] = useState(null);

  // ── Load all tasks ────────────────────────────────────────────
  async function loadTasks() {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTasks(); }, []);

  // ── Create task ───────────────────────────────────────────────
  async function handleCreate(e) {
    e.preventDefault();
    setCreateError(null);
    setCreating(true);
    try {
      const newTask = await createTask({ title: title.trim(), description: description.trim() });
      setTasks((prev) => [newTask, ...prev]);  // add to top of list
      setTitle('');
      setDescription('');
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  }

  // ── Toggle completed ──────────────────────────────────────────
  async function handleToggle(id, completed) {
    try {
      const updated = await updateTask(id, { completed });
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      alert(`Failed to update: ${err.message}`);
    }
  }

  // ── Edit title ────────────────────────────────────────────────
  async function handleEdit(id, newTitle) {
    const updated = await updateTask(id, { title: newTitle });
    setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
  }

  // ── Delete task ───────────────────────────────────────────────
  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="tasks-page">
      <h2>Task Manager</h2>
      <p className="tasks-subtitle">
        Data is stored in MongoDB — refresh the page and your tasks remain.
      </p>

      {/* ── Create Form ── */}
      <section className="task-form-section">
        <h3>Add New Task</h3>
        <form onSubmit={handleCreate} className="task-form">
          <div className="form-group">
            <label htmlFor="task-title">Title <span className="required">*</span></label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fix login bug"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details..."
              rows={2}
            />
          </div>
          {createError && <ErrorMessage message={createError} />}
          <button type="submit" className="btn-create" disabled={creating}>
            {creating ? 'Adding...' : '+ Add Task'}
          </button>
        </form>
      </section>

      {/* ── Task List ── */}
      <section className="task-list-section">
        <h3>
          All Tasks{' '}
          <span className="task-count">({tasks.length})</span>
        </h3>

        {loading && <Spinner />}
        {fetchError && (
          <div>
            <ErrorMessage message={fetchError} />
            <button className="btn-retry" onClick={loadTasks}>Retry</button>
          </div>
        )}

        {!loading && !fetchError && tasks.length === 0 && (
          <p className="tasks-empty">No tasks yet. Create one above!</p>
        )}

        {!loading && !fetchError && tasks.length > 0 && (
          <ul className="task-list">
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Tasks;
