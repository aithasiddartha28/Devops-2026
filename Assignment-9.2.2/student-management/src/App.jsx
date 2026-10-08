import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import StudentList from "./components/StudentList";
import StudentDetails from "./components/StudentDetails";
import CourseList from "./components/CourseList";
import About from "./components/About";
import NotFound from "./components/NotFound";
function App() {
  return (
    <BrowserRouter>

      <h1>College Student Management Portal</h1>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route
          path="/students"
          element={<StudentList />}
        />
        <Route
          path="/students/:id"
          element={<StudentDetails />}
        />
        <Route
          path="/courses"
          element={<CourseList />}
        />

        <Route
          path="/about"
          element={<About />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;