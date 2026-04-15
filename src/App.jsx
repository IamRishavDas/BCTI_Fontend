import Navbar from "./components/Navbar"
import { Route, Routes } from "react-router-dom"
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
import NoticesList from "./components/admin/NoticesList"
import NoticeForm from "./components/admin/NoticeForm"
import StudentSearch from "./components/admin/StudentSearch"
import StudentReports from "./components/admin/StudentReports"
import Home from "./pages/Home"
import Courses from "./pages/Courses"
import About from "./pages/About"
import Notice from "./pages/Notice"
import TypingPractice from "./components/typing-practice/TypingPractice"
import { checkForUpdates } from "./desktop-updater/updater"
import { useEffect } from "react"
import TypingProgress from "./components/student/TypingProgress"
import StudentProfile from "./components/student/StudentProfile"

function App() {

    useEffect(() => {
      checkForUpdates();
    }, []);

  return (
    <ConfirmProvider>  
      <Routes>
        {/* Public Routes with Navbar */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/courses" element={<><Navbar /><Courses /></>} />
        <Route path="/about" element={<><Navbar /><About /></>} />
        <Route path="/notice" element={<><Navbar /><Notice /></>} />
        
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
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
          <Route path="notices" element={<NoticesList />} />
          <Route path="notices/new" element={<NoticeForm />} />
          <Route path="notices/edit/:id" element={<NoticeForm />} />
          <Route path="students/search" element={<StudentSearch />} />
          <Route path="students/:studentId/reports" element={<StudentReports />} />
        </Route>

        {/* Student Routes */}
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
          <Route path="typing" element={<TypingPractice />} />
          <Route path="progress" element={<TypingProgress />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        <Route path="*" element={<NotFound/>} />
      </Routes>
    </ConfirmProvider>
  )
}

export default App