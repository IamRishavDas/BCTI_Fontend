import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Navbar from "../Navbar";

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar/>

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 md:p-10 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}