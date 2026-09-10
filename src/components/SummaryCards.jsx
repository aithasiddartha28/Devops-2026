import React from 'react';

function SummaryCards({ student }) {
  if (!student) return null;

  const totalSubjects = student.subjects ? student.subjects.length : 0;
  const attendance = student.attendance || 0;
  const upcomingExams = student.exams ? student.exams.length : 0;
  const cgpa = student.cgpa || "N/A";
  const isEligible = attendance >= 75;

  return (
    <div className="summary-cards-grid">
      <div className="summary-card">
        <div className="summary-icon icon-subjects">📚</div>
        <div className="summary-details">
          <span className="summary-label">Total Subjects</span>
          <h3 className="summary-value">{totalSubjects}</h3>
          <span className="summary-subtext">Active Enrolled</span>
        </div>
      </div>

      <div className="summary-card">
        <div className={`summary-icon icon-attendance ${isEligible ? 'eligible-bg' : 'not-eligible-bg'}`}>
          {isEligible ? '⏱️' : '⚠️'}
        </div>
        <div className="summary-details">
          <span className="summary-label">Overall Attendance</span>
          <h3 className="summary-value">{attendance}%</h3>
          <span className={`summary-badge ${isEligible ? 'badge-success' : 'badge-danger'}`}>
            {isEligible ? 'Eligible' : 'Not Eligible'}
          </span>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-icon icon-exams">📝</div>
        <div className="summary-details">
          <span className="summary-label">Upcoming Exams</span>
          <h3 className="summary-value">{upcomingExams}</h3>
          <span className="summary-subtext">Scheduled</span>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-icon icon-cgpa">⭐</div>
        <div className="summary-details">
          <span className="summary-label">Current CGPA</span>
          <h3 className="summary-value">{cgpa}</h3>
          <span className="summary-subtext">Out of 10.0</span>
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;
