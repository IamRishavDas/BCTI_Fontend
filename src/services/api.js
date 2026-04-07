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

  resetStudentPassword: async (rollNo) => {
    const response = await fetch(`${API_BASE_URL}/api/password/reset`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ rollNo }),
    });

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
        confirmPassword: newPassword
      }),
    });
    return res.json();
  },

    // === STUDENT REPORTS ===
  createDailyReport: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/students/reports`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getMyReports: async (pageNumber = 1, pageSize = 10) => {
    const url = `${API_BASE_URL}/api/students/reports?PageNumber=${pageNumber}&PageSize=${pageSize}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    return {
      data: data,
      rawResponse: response,
      ok: response.ok,
    };
  },

  getTypingLeaderboard: async () => {
    const res = await fetch(`${API_BASE_URL}/api/students/reports/typing-leaderboard`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Password Change (for both Student & Admin)
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
    return res.json();
  },

  // === NOTICES ===
  getNotices: async () => {
    const res = await fetch(`${API_BASE_URL}/api/notices`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  getNoticeById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/notices/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Admin only
  createNotice: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/notices`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateNotice: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/notices/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteNotice: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/notices/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return res.json();
  },

    // Search Students by Roll No or Name (Admin only)
  searchStudents: async (searchTerm, pageNumber = 1, pageSize = 10) => {
    const url = `${API_BASE_URL}/api/students/search/${encodeURIComponent(searchTerm)}?PageNumber=${pageNumber}&PageSize=${pageSize}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    return {
      data: data,
      rawResponse: response,
    };
  },

  // Get Student Typing Reports with Pagination (Admin only)
  getStudentTypingReports: async (studentId, pageNumber = 1, pageSize = 10) => {
    const url = `${API_BASE_URL}/api/students/reports/${studentId}?PageNumber=${pageNumber}&PageSize=${pageSize}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    return {
      data: data,
      rawResponse: response,
    };
  },

};