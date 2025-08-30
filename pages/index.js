import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { readTodos } from "../lib/todos";

export async function getServerSideProps() {
  const todos = readTodos();
  return { props: { initialTodos: todos } };
}

export default function Home({ initialTodos }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to add todo");
      }
      setTitle("");
      setDescription("");
      router.replace(router.asPath);
    } catch (error) {
      console.error("Add failed:", error);
      alert(error.message || "Failed to add todo");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete todo");
      }
      router.replace(router.asPath);
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.message || "Failed to delete todo");
    }
  }

  async function handleToggleComplete(id, currentStatus) {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update todo");
      }
      router.replace(router.asPath);
    } catch (error) {
      console.error("Toggle failed:", error);
      alert(error.message || "Failed to update todo");
    }
  }

  return (
    <>
      <Head>
        <title>Todo List</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Todo List</h1>

          <form onSubmit={handleAdd} className="bg-white rounded-lg shadow p-4 sm:p-6 mb-8 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Buy groceries"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Details (optional)"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Adding..." : "Add Todo"}
              </button>
            </div>
          </form>

          <ul className="space-y-3">
            {initialTodos.length === 0 && (
              <li className="text-gray-600">No todos yet. Add your first one above.</li>
            )}
            {initialTodos.map((todo) => (
              <li key={todo.id} className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo.id, todo.completed)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <Link 
                      href={`/todos/${todo.id}`} 
                      className={`text-lg font-semibold hover:underline ${todo.completed ? 'line-through text-gray-500' : ''}`}
                    >
                      {todo.title}
                    </Link>
                  </div>
                  {todo.description && (
                    <p className={`text-sm mt-1 line-clamp-2 ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                      {todo.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/todos/${todo.id}/edit`}
                    className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}



