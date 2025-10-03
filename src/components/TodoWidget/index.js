import React, { useState, useEffect } from 'react';
import './TodoWidget.css';

const TodoWidget = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todoWidgetTasks');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todoWidgetTasks', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="todo-widget">
      <div className="todo-header">
        <h3>📝 Todo List</h3>
        <div className="todo-stats">
          <span className="stat active">{activeCount} active</span>
          <span className="stat completed">{completedCount} done</span>
        </div>
      </div>

      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
          maxLength={100}
        />
        <button type="submit" className="add-btn" disabled={!newTodo.trim()}>
          +
        </button>
      </form>

      <div className="todo-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Done
        </button>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            {filter === 'all' && todos.length === 0 && (
              <p>No tasks yet. Add one above! 🎯</p>
            )}
            {filter === 'active' && activeCount === 0 && (
              <p>No active tasks! 🎉</p>
            )}
            {filter === 'completed' && completedCount === 0 && (
              <p>No completed tasks yet.</p>
            )}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <button
                className="todo-checkbox"
                onClick={() => toggleTodo(todo.id)}
                title={todo.completed ? 'Mark as active' : 'Mark as completed'}
              >
                {todo.completed ? '✓' : '○'}
              </button>
              <span className="todo-text">{todo.text}</span>
              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
                title="Delete task"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {completedCount > 0 && (
        <div className="todo-actions">
          <button onClick={clearCompleted} className="clear-btn">
            Clear Completed ({completedCount})
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoWidget;