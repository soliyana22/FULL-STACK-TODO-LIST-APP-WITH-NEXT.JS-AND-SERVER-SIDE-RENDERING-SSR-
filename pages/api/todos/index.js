import { readTodos, addTodo } from "../../../lib/todos";

export default function handler(req, res) {
  try {
    if (req.method === "GET") {
      const todos = readTodos();
      return res.status(200).json({ todos });
    }

    if (req.method === "POST") {
      const { title, description, completed } = req.body || {};
      if (!title || String(title).trim().length === 0) {
        return res.status(400).json({ error: "Title is required" });
      }
      const todo = addTodo({ title, description, completed });
      return res.status(201).json({ todo });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end("Method Not Allowed");
  } catch (error) {
    console.error("/api/todos error", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


