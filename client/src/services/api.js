import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    timeout: 60000, // 60s for AI processing
    headers: { "Content-Type": "application/json" },
});

export const submitIdea = (data) => api.post("/ideas", data);
export const fetchIdeas = () => api.get("/ideas");
export const fetchIdeaById = (id) => api.get(`/ideas/${id}`);
export const deleteIdeaById = (id) => api.delete(`/ideas/${id}`);

export default api;