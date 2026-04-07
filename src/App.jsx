import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import { Route, Routes, useLocation } from "react-router-dom"
import Login from "./pages/Login"
import AdminDashboard from "./components/admin/AdminDashboard"
import AdminLayout from "./components/admin/AdminLayout"
import { Navigate } from "react-router-dom"
import StudentsList from "./components/admin/StudentsList"
import StudentForm from "./components/admin/StudentForm"
import DeletedStudents from "./components/admin/DeletedStudents"
import CoursesList from "./components/admin/CoursesList"
import CourseForm from "./components/admin/CourseForm"
import DeletedCourses from "./components/admin/DeletedCourses"
import { ConfirmProvider } from "./contexts/ConfirmContext"
import StudentLayout from "./components/student/StudentLayout"
import StudentDashboard from "./components/student/StudentDashboard"
import DailyReportForm from "./components/student/DailyReportForm"
import MyReports from "./components/student/MyReports"
import TypingLeaderboard from "./components/student/TypingLeaderboard"
import { isAdmin, isAuthenticated } from "./utils/auth"
import NotFound from "./components/NotFound"

function App() {

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
          <Route path="student/leaderboard" element={<TypingLeaderboard />} />
        </Route>

        <Route 
          path="/student" 
          element={
            isAuthenticated() && !isAdmin() 
              ? <StudentLayout /> 
              : <Navigate to="/login" replace />
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="report" element={<DailyReportForm />} />
          <Route path="my-reports" element={<MyReports />} />
          <Route path="leaderboard" element={<TypingLeaderboard />} />
        </Route>

        <Route path="*" element={<NotFound/>} />
      </Routes>
    </ConfirmProvider>
  )
}

export default App
