import fs from "fs";
import path from "path";

const dataDirectory = path.join(process.cwd(), "data");
const dataFile = path.join(dataDirectory, "todos.json");

function ensureDataFileExists() {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }
  if (!fs.existsSync(dataFile)) {
    const seed = [];
    fs.writeFileSync(dataFile, JSON.stringify(seed, null, 2), "utf-8");
  }
}

export function readTodos() {
  ensureDataFileExists();
  const raw = fs.readFileSync(dataFile, "utf-8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeTodos(todos) {
  ensureDataFileExists();
  fs.writeFileSync(dataFile, JSON.stringify(todos, null, 2), "utf-8");
}

export function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function getTodoById(id) {
  const todos = readTodos();
  return todos.find((t) => t.id === id) || null;
}

export function addTodo(todoInput) {
  const todos = readTodos();
  const newTodo = {
    id: generateId(),
    title: String(todoInput.title || "").trim(),
    description: String(todoInput.description || "").trim(),
    completed: Boolean(todoInput.completed || false),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  todos.unshift(newTodo);
  writeTodos(todos);
  return newTodo;
}

export function updateTodo(id, updates) {
  const todos = readTodos();
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const updated = {
    ...todos[index],
    ...updates,
    title: updates.title !== undefined ? String(updates.title).trim() : todos[index].title,
    description:
      updates.description !== undefined ? String(updates.description).trim() : todos[index].description,
    completed: updates.completed !== undefined ? Boolean(updates.completed) : todos[index].completed,
    updatedAt: new Date().toISOString(),
  };
  todos[index] = updated;
  writeTodos(todos);
  return updated;
}

export function deleteTodo(id) {
  const todos = readTodos();
  const remaining = todos.filter((t) => t.id !== id);
  const deleted = remaining.length !== todos.length;
  if (deleted) writeTodos(remaining);
  return deleted;
}


