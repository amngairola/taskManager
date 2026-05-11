import api from "./context/axios";

// ─── API Calls ───────────────────────────────────────────────────────────────
export const fetchTasks = async (projectId) => {
  const res = await api.get(`/tasks?projectId=${projectId}`);
  console.log("fetching task... ");
  return res.data.data;
};

export const fetchUsers = async () => {
  const res = await api.get("/admin/getAllusers");
  console.log("fetching user again..");
  return res.data.data;
};

export const fetchProjects = async () => {
  const res = await api.get("/projects");

  console.log("fetching dashboard..");
  return res.data.data;
};
