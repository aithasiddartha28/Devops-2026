import { useState } from "react";
import { Link } from "react-router-dom";

function StudentList() {
  const [search, setSearch] = useState("");

  const students = [
    {
      id: 101,
      name: "Rahul",
      branch: "CSE",
      year: "III"
    },
    {
      id: 102,
      name: "Priya",
      branch: "AIML",
      year: "III"
    },
    {
      id: 103,
      name: "Arjun",
      branch: "ECE",
      year: "II"
    }
  ];

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Student List</h2>

      <input
        type="text"
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredStudents.length === 0 ? (
        <p>No student found.</p>
      ) : (
        filteredStudents.map((student) => (
          <div key={student.id}>
            <h3>{student.name}</h3>

            <p>Branch: {student.branch}</p>

            <p>Year: {student.year}</p>

            <Link to={`/students/${student.id}`}>
              View Details
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default StudentList;