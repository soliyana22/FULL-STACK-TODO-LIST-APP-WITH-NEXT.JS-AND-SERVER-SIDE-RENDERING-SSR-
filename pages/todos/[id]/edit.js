import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getTodoById } from "../../../lib/todos";

export async function getServerSideProps({ params }) {
  const todo = getTodoById(params.id);
  if (!todo) return { notFound: true };
  return { props: { todo } };
}

export default function EditTodo({ todo }) {
  const router = useRouter();
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [completed, setCompleted] = useState(Boolean(todo.completed));
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, completed }),
      });
      if (!res.ok) throw new Error("Failed to update");
      router.push(`/todos/${todo.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link href={`/todos/${todo.id}`} className="text-blue-600 hover:underline">← Back</Link>
        <form onSubmit={handleSave} className="bg-white rounded-lg shadow p-6 mt-4 space-y-4">
          <h1 className="text-2xl font-bold">Edit Todo</h1>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} />
            <span>Completed</span>
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
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
    </main>
  );
}


