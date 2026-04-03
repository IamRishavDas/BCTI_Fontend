const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const api = {
  // === STUDENTS ===
  getStudents: async (pageNumber = 1, pageSize = 10) => {
    const url = `${API_BASE_URL}/api/students?PageNumber=${pageNumber}&PageSize=${pageSize}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    return {
      data: data,                  
      rawResponse: response,         
      ok: response.ok,
      status: response.status
    };
  },

  getStudentLookups: async (pageNumber = 1, pageSize = 10, isDeleted = false) => {
    const url = `${API_BASE_URL}/api/students/lookups?PageNumber=${pageNumber}&PageSize=${pageSize}&isDeleted=${isDeleted}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    return {
      data: data,
      rawResponse: response,
      ok: response.ok,
      status: response.status
    };
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

  // === COURSES ===
  getCourses: async () => {
    const res = await fetch(`${API_BASE_URL}/api/courses`, { 
      headers: getAuthHeaders() 
    });
    return res.json();
  },

  getCourseLookups: async (isDeleted = false) => {
    const res = await fetch(`${API_BASE_URL}/api/courses/lookups?isDeleted=${isDeleted}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  getCourseById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}`, { 
      headers: getAuthHeaders() 
    });
    return res.json();
  },

  createCourse: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/courses`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateCourse: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  softDeleteCourse: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  restoreCourse: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/courses/restore/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};