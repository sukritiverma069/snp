import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../stores';
import './TodoWidget.css';

const TodoWidget = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const isInitialized = useRef(false);

  // Get user-specific localStorage key
  const getStorageKey = () => {
    return user?.id ? `todoWidgetTasks_${user.id}` : 'todoWidgetTasks';
  };

  useEffect(() => {
    if (user?.id) {
      const storageKey = getStorageKey();
      const savedTodos = localStorage.getItem(storageKey);
      if (savedTodos) {
        try {
          setTodos(JSON.parse(savedTodos));
        } catch (error) {
          console.error('Error parsing saved todos:', error);
          setTodos([]);
        }
      }
      isInitialized.current = true;
    }
  }, [user?.id]);

  useEffect(() => {
    // Only save to localStorage after initial load and if user is available
    if (isInitialized.current && user?.id) {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(todos));
    }
  }, [todos, user?.id]);

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
      <div className="widget-header">
        <div>
          <h3 className="widget-title">📝 Todo List</h3>
          <div className="widget-subtitle">{activeCount} active • {completedCount} done</div>
        </div>
      </div>

      <div className="widget-content">
        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="widget-input"
            maxLength={100}
          />
          <button type="submit" className="widget-button" disabled={!newTodo.trim()}>
            Add Task
          </button>
        </form>

        <div className="todo-filters">
          <button
            className={`widget-button ${filter === 'all' ? '' : 'secondary'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`widget-button ${filter === 'active' ? '' : 'secondary'}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`widget-button ${filter === 'completed' ? '' : 'secondary'}`}
            onClick={() => setFilter('completed')}
          >
            Done
          </button>
        </div>

        <div className="widget-list">
          {filteredTodos.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#718096', padding: '20px' }}>
              {filter === 'all' && todos.length === 0 && 'No tasks yet. Add one above!'}
              {filter === 'active' && activeCount === 0 && 'No active tasks!'}
              {filter === 'completed' && completedCount === 0 && 'No completed tasks yet.'}
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div key={todo.id} className="widget-list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    style={{
                      background: todo.completed ? '#48bb78' : 'transparent',
                      border: `2px solid ${todo.completed ? '#48bb78' : '#e2e8f0'}`,
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'white',
                      fontSize: '12px'
                    }}
                    title={todo.completed ? 'Mark as active' : 'Mark as completed'}
                  >
                    {todo.completed ? '✓' : ''}
                  </button>
                  <span style={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#a0aec0' : '#2d3748',
                    fontSize: '14px'
                  }}>
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e53e3e',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '4px',
                    borderRadius: '4px'
                  }}
                  title="Delete task"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {completedCount > 0 && (
          <button onClick={clearCompleted} className="widget-button secondary" style={{ marginTop: '12px' }}>
            Clear Completed ({completedCount})
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoWidget;