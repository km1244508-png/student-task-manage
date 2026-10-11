// All backend API calls live here
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/tasks";

const handleResponse = async (response) => {
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }
  return result;
};

export const fetchTasks = async () => {
  const response = await fetch(API_URL);
  const result = await handleResponse(response);
  return result.data;
};

export const createTask = async (title) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  const result = await handleResponse(response);
  return result.data;
};

export const updateTaskTitle = async (id, title) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  const result = await handleResponse(response);
  return result.data;
};

export const removeTask = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return handleResponse(response);
};

export const toggleTaskStatus = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { method: "PATCH" });
  const result = await handleResponse(response);
  return result.data;
};
