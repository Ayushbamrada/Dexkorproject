import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import DashboardTeacher from "./pages/DashboardTeacher";
import CreateCourseForm from "./pages/CreateCourseForm";
import RegisterPage from "./pages/RegisterPage";
import CourseDetail from "./pages/CourseDetails";
import TeacherCourseDetails from "./pages/TeacherCourseDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
         <Route path="/login" element={<LoginPage />} />
         <Route path="/Dashboard" element={<Dashboard />} />
         <Route path="/CreateCourseForm" element={<CreateCourseForm />} />
         <Route path="/DashboardTeacher" element={<DashboardTeacher />} />
         <Route path="/register" element={<RegisterPage />} />
         <Route path="/course/:courseId" element={<CourseDetail />} />
         <Route path="/teacher-dashboard/course/:courseId" element={<TeacherCourseDetails />} />



        {/* Add other login routes later */}
      </Routes>
    </Router>
  );
}

export default App;
