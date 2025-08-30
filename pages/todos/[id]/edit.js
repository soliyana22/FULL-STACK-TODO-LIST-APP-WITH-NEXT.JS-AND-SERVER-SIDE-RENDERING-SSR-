import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function EditTodo() {
  const router = useRouter();
  const { id } = router.query;
  const [todo, setTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
        console.log("Fetched todo:", data.todo);
        setTodo(data.todo);
        setFormData({
          title: data.todo.title,
          description: data.todo.description || "",
          completed: data.todo.completed,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!todo) return;
    
    console.log("Submitting form with data:", formData);
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error response:", errorData);
        throw new Error(errorData.error || "Failed to update todo");
      }

      const result = await response.json();
      console.log("Success response:", result);
      
      setSuccess(true);
      
      // Wait a moment to show success message, then redirect
      setTimeout(() => {
        router.push(`/todos/${todo.id}`);
      }, 1000);
      
    } catch (err) {
      console.error("Error during submission:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Show loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to List
          </Link>
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
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
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to List
          </Link>
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

  // Show form
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link href={`/todos/${todo?.id}`} className="text-blue-600 hover:underline">
          ← Back to Todo
        </Link>
        
        <div className="bg-white rounded-lg shadow p-6 mt-4">
          <h1 className="text-2xl font-bold mb-6">Edit Todo</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              ✅ Todo updated successfully! Redirecting...
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter todo title"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter todo description (optional)"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="completed"
                name="completed"
                checked={formData.completed}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="completed" className="ml-2 block text-sm text-gray-900">
                Mark as completed
              </label>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || success}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : success ? "Saved!" : "Save Changes"}
              </button>
              
              <Link
                href={`/todos/${todo?.id}`}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
