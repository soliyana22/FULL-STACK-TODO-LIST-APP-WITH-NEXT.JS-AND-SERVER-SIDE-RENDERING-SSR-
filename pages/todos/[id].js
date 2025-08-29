import Link from "next/link";
import { getTodoById } from "../../lib/todos";

export async function getServerSideProps({ params }) {
  const todo = getTodoById(params.id);
  if (!todo) {
    return { notFound: true };
  }
  return { props: { todo } };
}

export default function ViewTodo({ todo }) {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link href="/" className="text-blue-600 hover:underline">← Back</Link>
        <div className="bg-white rounded-lg shadow p-6 mt-4">
          <h1 className="text-2xl font-bold">{todo.title}</h1>
          {todo.description && <p className="mt-2 text-gray-700 whitespace-pre-wrap">{todo.description}</p>}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm px-2 py-1 rounded bg-gray-100 border border-gray-200">
              {todo.completed ? "Completed" : "Pending"}
            </span>
            <Link
              href={`/todos/${todo.id}/edit`}
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


