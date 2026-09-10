import React from 'react';

function ExamDetails({ exams }) {
  const defaultExams = [
    {
      id: 1,
      name: "Database Management Systems",
      code: "CS601",
      date: "15 September 2026",
      time: "10:00 AM - 1:00 PM",
      room: "Block A - 204",
      status: "Upcoming"
    },
    {
      id: 2,
      name: "Operating Systems",
      code: "CS602",
      date: "18 September 2026",
      time: "10:00 AM - 1:00 PM",
      room: "Block B - 105",
      status: "Scheduled"
    }
  ];

  const examList = exams && exams.length > 0 ? exams : defaultExams;

  return (
    <div className="card exam-card">
      <div className="card-header-flex">
        <h2>Upcoming Examinations</h2>
        <span className="badge badge-warning">End Semester Exams</span>
      </div>

      <div className="exam-grid">
        {examList.map((exam, index) => (
          <div className="exam-item-card" key={exam.id || index}>
            <div className="exam-item-header">
              <div className="exam-code-tag">{exam.code || "EXAM"}</div>
              <span className={`exam-status-badge ${exam.status?.toLowerCase() === 'upcoming' ? 'status-upcoming' : 'status-scheduled'}`}>
                {exam.status || "Scheduled"}
              </span>
            </div>

            <h3 className="exam-title">{exam.name}</h3>

            <div className="exam-details-list">
              <div className="exam-detail-row">
                <span className="detail-icon">📅</span>
                <span className="detail-text"><strong>Date:</strong> {exam.date}</span>
              </div>
              <div className="exam-detail-row">
                <span className="detail-icon">⏰</span>
                <span className="detail-text"><strong>Time:</strong> {exam.time}</span>
              </div>
              <div className="exam-detail-row">
                <span className="detail-icon">📍</span>
                <span className="detail-text"><strong>Hall:</strong> {exam.room}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExamDetails;