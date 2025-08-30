

// Singleton pattern for in-memory storage to prevent data loss during hot reloads
class TodoStore {
  constructor() {
    if (TodoStore.instance) {
      return TodoStore.instance;
    }
    
    this.todos = [
      {
        "id": "0j6c5eol",
        "title": "Buy grocery",
        "description": "Tomato",
        "completed": false,
        "createdAt": "2025-08-30T06:33:04.500Z",
        "updatedAt": "2025-08-30T06:33:04.500Z"
      },
      {
        "id": "welcome1",
        "title": "New task",
        "description": "This is a sample todo. You can view, edit, and delete it.",
        "completed": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2025-08-29T11:53:17.067Z"
      }
    ];
    
    TodoStore.instance = this;
  }

  getAll() {
    return this.todos;
  }

  getById(id) {
    return this.todos.find((t) => t.id === id) || null;
  }

  add(todoInput) {
    const newTodo = {
      id: this.generateId(),
      title: String(todoInput.title || "").trim(),
      description: String(todoInput.description || "").trim(),
      completed: Boolean(todoInput.completed || false),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.todos.unshift(newTodo);
    return newTodo;
  }

  update(id, updates) {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) return null;
    
    const updated = {
      ...this.todos[index],
      ...updates,
      title: updates.title !== undefined ? String(updates.title).trim() : this.todos[index].title,
      description: updates.description !== undefined ? String(updates.description).trim() : this.todos[index].description,
      completed: updates.completed !== undefined ? Boolean(updates.completed) : this.todos[index].completed,
      updatedAt: new Date().toISOString(),
    };
    this.todos[index] = updated;
    return updated;
  }

  delete(id) {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter((t) => t.id !== id);
    return this.todos.length !== initialLength;
  }

  generateId() {
    return Math.random().toString(36).slice(2, 10);
  }
}

// Create singleton instance
const todoStore = new TodoStore();

// Export functions that use the singleton
export function readTodos() {
  return todoStore.getAll();
}

export function writeTodos(newTodos) {
  todoStore.todos = newTodos;
}

export function generateId() {
  return todoStore.generateId();
}

export function getTodoById(id) {
  return todoStore.getById(id);
}

export function addTodo(todoInput) {
  return todoStore.add(todoInput);
}

export function updateTodo(id, updates) {
  return todoStore.update(id, updates);
}

export function deleteTodo(id) {
  return todoStore.delete(id);
}


