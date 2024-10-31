import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

function TaskList({ tasks, onEdit, onDelete }) {
  return (
    <div className="task-list">
      <h2 className="task-list__title">Task List</h2>
      <ul className="task-list__items">
        {tasks.map((task) => (
          <li key={task.id} className="task-list__item">
            <input
              className="task-list__item-checkbox"
              type="checkbox"
              checked={task.completed}
              onChange={() => onEdit({ ...task, completed: !task.completed })}
            />
            <strong className="task-list__item-title">{task.title}</strong> - <span className="task-list__item-description">{task.description}</span>
            <br />
            
            <button className="task-list__button task-list__button--edit" onClick={() => onEdit(task)}>
              <FaEdit /> Edit
            </button>
            <button className="task-list__button task-list__button--delete" onClick={() => onDelete(task.id)}>
              <FaTrashAlt /> Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
