import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import { Route, Routes, useLocation } from "react-router-dom"
import Login from "./pages/Login"
import AdminDashboard from "./components/admin/AdminDashboard"
import ProtectedRoute from "./components/common/ProtectedRoute"
import AdminLayout from "./components/admin/AdminLayout"
import { Navigate } from "react-router-dom"
import StudentsList from "./components/admin/StudentsList"
import StudentForm from "./components/admin/StudentForm"
import DeletedStudents from "./components/admin/DeletedStudents"
import CoursesList from "./components/admin/CoursesList"
import CourseForm from "./components/admin/CourseForm"
import StudentLookups from "./components/admin/StudentLookups"
import DeletedCourses from "./components/admin/DeletedCourses"
import { ConfirmProvider } from "./contexts/ConfirmContext"

function App() {

  const location = useLocation();
  
  const hideNavbar = location.pathname === "/login";

  return (
      <ConfirmProvider>  
      <Routes>
        <Route path="/" element={<><Navbar /><Hero /></>} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<StudentsList />} />
          <Route path="students/new" element={<StudentForm />} />
          <Route path="students/edit/:id" element={<StudentForm />} />
          <Route path="students/deleted" element={<DeletedStudents />} />
          <Route path="courses" element={<CoursesList />} />
          <Route path="courses/new" element={<CourseForm />} />
          <Route path="courses/edit/:id" element={<CourseForm />} />
          <Route path="courses/deleted" element={<DeletedCourses />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ConfirmProvider>
  )
}

export default App
