import React from 'react';

function SubjectList({ subjects = [] }) {
  if (!subjects || subjects.length === 0) {
    return (
      <div className="card">
        <h2>Enrolled Subjects</h2>
        <p className="empty-state-text">No subjects found for this student.</p>
      </div>
    );
  }

  // Handle case if subjects array is simple array of strings
  const formattedSubjects = subjects.map((subj, index) => {
    if (typeof subj === 'string') {
      return {
        code: `SUB-10${index + 1}`,
        name: subj,
        faculty: 'Faculty Member',
        credits: 3,
        marks: 80,
        grade: 'A'
      };
    }
    return subj;
  });

  return (
    <div className="card subject-card">
      <div className="card-header-flex">
        <h2>Enrolled Subjects</h2>
        <span className="badge badge-info">{formattedSubjects.length} Courses</span>
      </div>

      <div className="table-responsive">
        <table className="subject-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Subject Name</th>
              <th>Faculty</th>
              <th>Credits</th>
              <th>Marks</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {formattedSubjects.map((subject, index) => (
              <tr key={subject.code || index}>
                <td>
                  <span className="code-badge">{subject.code}</span>
                </td>
                <td className="subject-title-cell">{subject.name}</td>
                <td>{subject.faculty}</td>
                <td>
                  <span className="credit-pill">{subject.credits} Credits</span>
                </td>
                <td className="marks-cell font-weight-bold">{subject.marks} / 100</td>
                <td>
                  <span className={`grade-badge grade-${subject.grade?.replace('+', '-plus') || 'A'}`}>
                    {subject.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SubjectList;