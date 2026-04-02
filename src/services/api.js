const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const api = {
  // === STUDENTS ===
  getStudents: async () => {
    const res = await fetch(`${API_BASE_URL}/api/students`, { headers: getAuthHeaders() });
    return res.json();
  },

  getStudentLookups: async (isDeleted = false) => {
    const res = await fetch(`${API_BASE_URL}/api/students/lookups?isDeleted=${isDeleted}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  getDeletedStudents: async () => {
    const res = await fetch(`${API_BASE_URL}/api/students/deleted`, { headers: getAuthHeaders() });
    return res.json();
  },

  getStudentById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/students/${id}`, { headers: getAuthHeaders() });
    return res.json();
  },

  createStudent: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/students`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateStudent: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/students/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  softDeleteStudent: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/students/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  permanentDeleteStudent: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/students/permanent/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  restoreStudent: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/students/restore/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};