import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import { Route, Routes, useLocation } from "react-router-dom"
import Login from "./pages/Login"
import StudentDashboard from "./pages/StudentDashboard"
import AdminDashboard from "./pages/AdminDashboard"

function App() {

  const location = useLocation();
  
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
          </>
        } />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
