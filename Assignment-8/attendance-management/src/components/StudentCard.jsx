function StudentCard({ student, children }) {
  return (
    <div
      className={`student-card ${
        student.attendance < 75 ? "low-attendance" : ""
      }`}
    >
      <div className="student-info">
        <h3>{student.name}</h3>
        <p>
          <strong>Roll Number:</strong> {student.rollNumber}
        </p>
        <p>
          <strong>Branch:</strong> {student.branch}
        </p>
      </div>

      <div className="student-attendance">
        {children}
      </div>
    </div>
  );
}

export default StudentCard;