function Attendance({ student, onPresent, onAbsent }) {
  return (
    <div className="attendance">
      <p>
        Attendance: <strong>{student.attendance}%</strong>
      </p>

      <p
        className={
          student.attendance >= 75
            ? "eligible"
            : "not-eligible"
        }
      >
        {student.attendance >= 75 ? "Eligible" : "Not Eligible"}
      </p>

      <div className="attendance-buttons">
        <button onClick={onPresent}>Present</button>
        <button onClick={onAbsent}>Absent</button>
      </div>
    </div>
  );
}

export default Attendance;