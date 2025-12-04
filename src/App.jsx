import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Forgot from "./pages/Forgot";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Academics from "./pages/Academics";
import Subject from "./pages/Subject";
import Playlist from "./pages/Playlist";
import SkillCourses from "./pages/SkillCourses";
import GuruAI from "./pages/GuruAI";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Privacy from "./pages/Privacy";
import Policy from "./pages/Policy";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/home" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/academics" element={<Academics />} />
      <Route path="/academics/subject/:subjectId" element={<Subject />} />
      <Route path="/playlist/:subjectId/:unitNumber" element={<Playlist />} />
      <Route path="/skill-courses" element={<SkillCourses />} />
      <Route path="/guru-ai" element={<GuruAI />} />
      <Route path="/about" element={<About />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/policy" element={<Policy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
