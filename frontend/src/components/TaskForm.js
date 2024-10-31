import React, { useState, useEffect } from 'react';

function TaskForm({ currentTask, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description);
      setCompleted(currentTask.completed);
    } else {
      setTitle('');
      setDescription('');
      setCompleted(false);
    }
  }, [currentTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: currentTask?.id,
      title,
      description,
      completed,
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2 className="task-form__title">{currentTask ? 'Edit Task' : 'Add Task'}</h2>
      <div className="task-form__group">
        <label className="task-form__label">Title:</label>
        <input
          className="task-form__input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="task-form__group">
        <label className="task-form__label">Description:</label>
        <textarea
          className="task-form__textarea"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      {/* <div className="task-form__group task-form__checkbox-group">
        <label className="task-form__label">Completed:</label>
        <input
          className="task-form__checkbox"
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
      </div> */}
      <button className="task-form__button task-form__button--submit" type="submit">
        {currentTask ? 'Update Task' : 'Add Task'}
      </button>
      {currentTask && (
        <button
          className="task-form__button task-form__button--cancel"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
}

export default TaskForm;
