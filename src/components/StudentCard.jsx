import React from 'react';

function StudentCard({ student, onViewProfile, isSelected }) {
  if (!student) return null;

  const {
    name,
    rollNumber,
    branch,
    year,
    attendance = 0,
    avatar,
    initials
  } = student;

  const isEligible = attendance >= 75;

  return (
    <div className={`student-card ${isSelected ? 'selected-card' : ''}`}>
      <div className="student-card-header">
        <div className="student-avatar-container">
          {avatar ? (
            <img src={avatar} alt={name} className="student-card-avatar" />
          ) : (
            <div className="student-card-initials">{initials || name?.charAt(0)}</div>
          )}
          <span className={`card-status-dot ${isEligible ? 'dot-success' : 'dot-danger'}`} />
        </div>
        <div className="student-card-meta">
          <span className={`status-badge-mini ${isEligible ? 'badge-success' : 'badge-danger'}`}>
            {isEligible ? 'Eligible' : 'Not Eligible'}
          </span>
        </div>
      </div>

      <div className="student-card-body">
        <h3 className="student-card-name">{name}</h3>
        <p className="student-card-roll">Roll No: <strong>{rollNumber}</strong></p>
        
        <div className="student-card-details">
          <div className="detail-pill">
            <span className="pill-label">Branch:</span>
            <span className="pill-value">{branch}</span>
          </div>
          <div className="detail-pill">
            <span className="pill-label">Year:</span>
            <span className="pill-value">{year}</span>
          </div>
          <div className="detail-pill">
            <span className="pill-label">Attendance:</span>
            <span className={`pill-value font-bold ${isEligible ? 'text-success' : 'text-danger'}`}>
              {attendance}%
            </span>
          </div>
        </div>
      </div>

      <div className="student-card-footer">
        <button
          className={`view-profile-btn ${isSelected ? 'btn-selected' : ''}`}
          onClick={() => onViewProfile && onViewProfile(student)}
        >
          {isSelected ? '✓ Currently Viewing' : 'View Profile'}
        </button>
      </div>
    </div>
  );
}

export default StudentCard;