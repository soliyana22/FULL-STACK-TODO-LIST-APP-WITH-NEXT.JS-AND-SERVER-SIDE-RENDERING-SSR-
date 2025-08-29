import { getTodoById, updateTodo, deleteTodo } from "../../../lib/todos";

export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  try {
    if (method === "GET") {
      const todo = getTodoById(id);
      if (!todo) return res.status(404).json({ error: "Not found" });
      return res.status(200).json({ todo });
    }

    if (method === "PUT" || method === "PATCH") {
      const { title, description, completed } = req.body || {};
      const updated = updateTodo(id, { title, description, completed });
      if (!updated) return res.status(404).json({ error: "Not found" });
      return res.status(200).json({ todo: updated });
    }

    if (method === "DELETE") {
      const ok = deleteTodo(id);
      if (!ok) return res.status(404).json({ error: "Not found" });
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
    return res.status(405).end("Method Not Allowed");
  } catch (error) {
    console.error(`/api/todos/${id} error`, error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


