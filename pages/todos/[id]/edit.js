import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getTodoById } from "../../../lib/todos";

export async function getServerSideProps({ params }) {
  const todo = getTodoById(params.id);
  if (!todo) {
    return { notFound: true };
  }
  return { props: { todo } };
}

export default function EditTodo({ todo }) {
  const router = useRouter();
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [completed, setCompleted] = useState(todo.completed);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, completed }),
      });
      if (!res.ok) throw new Error("Failed to update");
      router.push(`/todos/${todo.id}`);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update todo");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link href={`/todos/${todo.id}`} className="text-blue-600 hover:underline">← Back</Link>
        
        <div className="bg-white rounded-lg shadow p-6 mt-4">
          <h1 className="text-2xl font-bold mb-6">Edit Todo</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Todo title"
                required
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
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="completed"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="completed" className="ml-2 block text-sm text-gray-900">
                Mark as completed
              </label>
            </div>
            
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Updating..." : "Update Todo"}
              </button>
              <Link
                href={`/todos/${todo.id}`}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
