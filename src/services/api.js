import { showError } from "../utils/toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const handleUnauthorized = () => {
  localStorage.clear();
  setTimeout(() => {
    window.location.replace("/login");
  }, 1000);
  showError("Session expired");
};

export const api = {
  // === STUDENTS ===
  getStudents: async (pageNumber = 1, pageSize = 10) => {
    const url = `${API_BASE_URL}/api/students?PageNumber=${pageNumber}&PageSize=${pageSize}`;

    const response = await fetch(url, { headers: getAuthHeaders() });
    if (response.status === 401) handleUnauthorized();

    const data = await response.json();

    return { data, rawResponse: response, ok: response.ok, status: response.status };
  },

  getStudentLookups: async (pageNumber = 1, pageSize = 10, isDeleted = false) => {
    const url = `${API_BASE_URL}/api/students/lookups?PageNumber=${pageNumber}&PageSize=${pageSize}&isDeleted=${isDeleted}`;

    const response = await fetch(url, { headers: getAuthHeaders() });
    if (response.status === 401) handleUnauthorized();

    const data = await response.json();

    return { data, rawResponse: response, ok: response.ok, status: response.status };
  },

  getDeletedStudents: async () => {
    const res = await fetch(`${API_BASE_URL}/api/students/deleted`, { headers: getAuthHeaders() });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  getStudentById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/students/${id}`, { headers: getAuthHeaders() });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  createStudent: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/students`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  updateStudent: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/students/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  softDeleteStudent: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/students/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  permanentDeleteStudent: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/students/permanent/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  restoreStudent: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/students/restore/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  getStudentCount: async (isDeleted) => {
    const res = await fetch(`${API_BASE_URL}/api/students/count?isDeleted=${isDeleted}`, {
      headers: getAuthHeaders(),
    });
    if(res.status === 401) handleUnauthorized();
    return res.json();
  },

  // === COURSES ===
  getCourses: async () => {
    const res = await fetch(`${API_BASE_URL}/api/courses`, { headers: getAuthHeaders() });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  getCourseLookups: async (isDeleted = false) => {
    const res = await fetch(`${API_BASE_URL}/api/courses/lookups?isDeleted=${isDeleted}`, {
      headers: getAuthHeaders(),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  getCourseById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}`, { headers: getAuthHeaders() });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  createCourse: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/courses`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  updateCourse: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  softDeleteCourse: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  restoreCourse: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/courses/restore/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  resetStudentPassword: async (rollNo) => {
    const response = await fetch(`${API_BASE_URL}/api/password/reset`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ rollNo }),
    });
    if (response.status === 401) handleUnauthorized();

    const data = await response.json();
    return { data, rawResponse: response };
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await fetch(`${API_BASE_URL}/api/password/change`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      }),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  // === STUDENT REPORTS ===
  createDailyReport: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/students/reports`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  getMyReports: async (pageNumber = 1, pageSize = 10) => {
    const url = `${API_BASE_URL}/api/students/reports?PageNumber=${pageNumber}&PageSize=${pageSize}`;

    const response = await fetch(url, { headers: getAuthHeaders() });
    if (response.status === 401) handleUnauthorized();

    const data = await response.json();

    return { data, rawResponse: response, ok: response.ok };
  },

  getTypingLeaderboard: async () => {
    const res = await fetch(`${API_BASE_URL}/api/students/reports/typing-leaderboard`, {
      headers: getAuthHeaders(),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  // === NOTICES ===
  getNotices: async () => {
    const res = await fetch(`${API_BASE_URL}/api/notices`, {
      headers: getAuthHeaders(),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  getNoticeById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/notices/${id}`, {
      headers: getAuthHeaders(),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  createNotice: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/notices`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  updateNotice: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/notices/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  deleteNotice: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/notices/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  searchStudents: async (searchTerm, pageNumber = 1, pageSize = 10) => {
    const url = `${API_BASE_URL}/api/students/search/${encodeURIComponent(searchTerm)}?PageNumber=${pageNumber}&PageSize=${pageSize}`;

    const response = await fetch(url, { headers: getAuthHeaders() });
    if (response.status === 401) handleUnauthorized();

    const data = await response.json();

    return { data, rawResponse: response };
  },

  getStudentTypingReports: async (studentId, pageNumber = 1, pageSize = 10) => {
    const url = `${API_BASE_URL}/api/students/reports/${studentId}?PageNumber=${pageNumber}&PageSize=${pageSize}`;

    const response = await fetch(url, { headers: getAuthHeaders() });
    if (response.status === 401) handleUnauthorized();

    const data = await response.json();

    return { data, rawResponse: response };
  },

  // === NEW SUMMARY ENDPOINTS ===
  getMySummary: async () => {
    const res = await fetch(`${API_BASE_URL}/api/students/reports/summary`, {
      headers: getAuthHeaders(),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  getStudentSummary: async (studentId) => {
    const res = await fetch(`${API_BASE_URL}/api/students/reports/${studentId}/summary`, {
      headers: getAuthHeaders(),
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },
};