import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import StudentList from "./components/StudentList";
import Summary from "./components/Summary";

const initialStudents = [
  {
    id: 1,
    name: "Rahul Sharma",
    rollNumber: "23CS101",
    branch: "CSE",
    attendance: 85,
  },
  {
    id: 2,
    name: "Priya Reddy",
    rollNumber: "23CS102",
    branch: "CSE-AIML",
    attendance: 72,
  },
  {
    id: 3,
    name: "Arjun Kumar",
    rollNumber: "23CS103",
    branch: "CSE",
    attendance: 91,
  },
  {
    id: 4,
    name: "Sneha Patel",
    rollNumber: "23CS104",
    branch: "CSE-AIML",
    attendance: 68,
  },
  {
    id: 5,
    name: "Vikram Singh",
    rollNumber: "23CS105",
    branch: "CSE",
    attendance: 78,
  },
];

function App() {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");

  const updateAttendance = (id, change) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === id
          ? {
              ...student,
              attendance: Math.min(
                100,
                Math.max(0, student.attendance + change)
              ),
            }
          : student
      )
    );
  };

  const handlePresent = (id) => {
    updateAttendance(id, 1);
  };

  const handleAbsent = (id) => {
    updateAttendance(id, -1);
  };

  const resetAttendance = () => {
    setStudents(initialStudents);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <Summary students={students} />

        <section className="students-section">
          <div className="section-header">
            <h2>Student Attendance</h2>

            <div className="section-actions">
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-box"
              />

              <button
                className="reset-button"
                onClick={resetAttendance}
              >
                Reset Attendance
              </button>
            </div>
          </div>

          <StudentList
            students={filteredStudents}
            onPresent={handlePresent}
            onAbsent={handleAbsent}
          />
        </section>
      </main>
    </div>
  );
}

export default App;