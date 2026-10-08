import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function StudentDetails() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const students = [
    {
      id: "101",
      name: "Rahul",
      branch: "CSE",
      year: "III"
    },
    {
      id: "102",
      name: "Priya",
      branch: "AIML",
      year: "III"
    },
    {
      id: "103",
      name: "Arjun",
      branch: "ECE",
      year: "II"
    }
  ];

  useEffect(() => {
    console.log("Component Mounted");

    setLoading(true);

    const timer = setTimeout(() => {
      const selectedStudent = students.find(
        (student) => student.id === id
      );

      setStudent(selectedStudent);
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      console.log("Component Unmounted");
    };
  }, [id]);

  if (loading) {
    return <p>Loading student information...</p>;
  }

  if (!student) {
    return <p>Student does not exist.</p>;
  }

  return (
    <div>
      <h2>Student Details</h2>

      <p>Student ID: {student.id}</p>
      <p>Name: {student.name}</p>
      <p>Branch: {student.branch}</p>
      <p>Year: {student.year}</p>
      <button onClick={() => navigate(-1)}>
        Back
    </button>
    </div>
  );
}

export default StudentDetails;