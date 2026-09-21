import StudentCard from "./StudentCard";
import Attendance from "./Attendance";

function StudentList({ students, onPresent, onAbsent }) {
  return (
    <div className="student-list">
      {students.map((student) => (
        <StudentCard key={student.id} student={student}>
          <Attendance
            student={student}
            onPresent={() => onPresent(student.id)}
            onAbsent={() => onAbsent(student.id)}
          />
        </StudentCard>
      ))}
    </div>
  );
}

export default StudentList;