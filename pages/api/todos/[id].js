import { getTodoById, updateTodo, deleteTodo } from "../../../lib/todos";

export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  console.log(`API ${method} /api/todos/${id}`, { body: req.body });

  try {
    if (method === "GET") {
      const todo = getTodoById(id);
      if (!todo) return res.status(404).json({ error: "Todo not found" });
      return res.status(200).json({ todo });
    }

    if (method === "PUT" || method === "PATCH") {
      const { title, description, completed } = req.body || {};
      
      console.log("Update request:", { id, title, description, completed });
      
      // Validate input
      if (title !== undefined && (!title || String(title).trim().length === 0)) {
        console.log("Validation failed: empty title");
        return res.status(400).json({ error: "Title cannot be empty" });
      }
      
      const updated = updateTodo(id, { title, description, completed });
      if (!updated) {
        console.log("Todo not found for update:", id);
        return res.status(404).json({ error: "Todo not found" });
      }
      
      console.log("Update successful:", updated);
      return res.status(200).json({ todo: updated });
    }

    if (method === "DELETE") {
      const ok = deleteTodo(id);
      if (!ok) return res.status(404).json({ error: "Todo not found" });
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error(`/api/todos/${id} error`, error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}


