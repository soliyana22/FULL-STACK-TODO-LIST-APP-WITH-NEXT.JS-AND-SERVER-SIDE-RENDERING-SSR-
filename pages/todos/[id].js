import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function ViewTodo() {
  const router = useRouter();
  const { id } = router.query;
  const [todo, setTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch todo data when component mounts or id changes
  useEffect(() => {
    if (!id) return;

    const fetchTodo = async () => {
      try {
        setIsLoading(true);
        setError("");
        
        const response = await fetch(`/api/todos/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Todo not found");
            return;
          }
          throw new Error("Failed to fetch todo");
        }
        
        const data = await response.json();
        setTodo(data.todo);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  // Show loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
          <Link href="/" className="text-blue-600 hover:underline">← Back</Link>
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show error state
  if (error && !todo) {
    return (
      <main className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
          <Link href="/" className="text-blue-600 hover:underline">← Back</Link>
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Todo Not Found</h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go to Todo List
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show todo details
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link href="/" className="text-blue-600 hover:underline">← Back</Link>
        <div className="bg-white rounded-lg shadow p-6 mt-4">
          <h1 className="text-2xl font-bold">{todo?.title}</h1>
          {todo?.description && <p className="mt-2 text-gray-700 whitespace-pre-wrap">{todo.description}</p>}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm px-2 py-1 rounded bg-gray-100 border border-gray-200">
              {todo?.completed ? "Completed" : "Pending"}
            </span>
            <Link
              href={`/todos/${todo?.id}/edit`}
              className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}





