import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import { Route, Routes, useLocation } from "react-router-dom"
import Login from "./pages/Login"

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
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
