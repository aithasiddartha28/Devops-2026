function Summary({ students }) {
  const totalStudents = students.length;

  const presentStudents = students.filter(
    (student) => student.attendance >= 75
  ).length;

  const absentStudents = totalStudents - presentStudents;

  const averageAttendance =
    totalStudents > 0
      ? (
          students.reduce(
            (total, student) => total + student.attendance,
            0
          ) / totalStudents
        ).toFixed(1)
      : 0;

  return (
    <div className="summary">
      <div className="summary-card">
        <h3>Total Students</h3>
        <p>{totalStudents}</p>
      </div>

      <div className="summary-card">
        <h3>Present</h3>
        <p>{presentStudents}</p>
      </div>

      <div className="summary-card">
        <h3>Absent</h3>
        <p>{absentStudents}</p>
      </div>

      <div className="summary-card">
        <h3>Average Attendance</h3>
        <p>{averageAttendance}%</p>
      </div>
    </div>
  );
}

export default Summary;