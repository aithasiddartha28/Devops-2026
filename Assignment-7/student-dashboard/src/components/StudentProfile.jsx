import React from 'react';

function StudentProfile(props) {
  // Support either student object prop or direct destructured props
  const student = props.student || props;
  
  const {
    name = "Siddartha",
    rollNumber = "22A81A0501",
    branch = "Computer Science and Engineering",
    year = "3rd Year",
    semester = "6th Semester",
    email = "student@example.com",
    phone = "+91 9876543210",
    avatar = null,
    cgpa = "8.6",
    attendance = 87
  } = student;

  const isEligible = attendance >= 75;

  return (
    <div className="card profile-card">
      <div className="profile-header-banner">
        <div className="profile-avatar-wrapper">
          {avatar ? (
            <img src={avatar} alt={name} className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-fallback">{name.charAt(0)}</div>
          )}
          <span className={`profile-status-indicator ${isEligible ? 'online-eligible' : 'online-warning'}`} title={isEligible ? 'Eligible' : 'Not Eligible'} />
        </div>
        <div className="profile-main-title">
          <h2 className="student-name">{name}</h2>
          <p className="student-roll">Roll No: <span className="roll-highlight">{rollNumber}</span></p>
          <div className="profile-tag-group">
            <span className="profile-badge badge-primary">{year}</span>
            <span className="profile-badge badge-secondary">{semester}</span>
            <span className={`profile-badge ${isEligible ? 'badge-success' : 'badge-danger'}`}>
              {isEligible ? 'Eligible for Exams' : 'Attendance Shortage'}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-info-grid">
        <div className="info-item">
          <span className="info-icon">🏛️</span>
          <div className="info-content">
            <span className="info-label">Branch & Department</span>
            <span className="info-value">{branch}</span>
          </div>
        </div>

        <div className="info-item">
          <span className="info-icon">📧</span>
          <div className="info-content">
            <span className="info-label">Email Address</span>
            <span className="info-value">{email}</span>
          </div>
        </div>

        <div className="info-item">
          <span className="info-icon">📱</span>
          <div className="info-content">
            <span className="info-label">Phone Number</span>
            <span className="info-value">{phone}</span>
          </div>
        </div>

        <div className="info-item">
          <span className="info-icon">🎓</span>
          <div className="info-content">
            <span className="info-label">Academic Status</span>
            <span className="info-value">{year} • {semester}</span>
          </div>
        </div>

        <div className="info-item">
          <span className="info-icon">⏱️</span>
          <div className="info-content">
            <span className="info-label">Current Attendance</span>
            <span className={`info-value ${isEligible ? 'text-success' : 'text-danger'}`}>{attendance}%</span>
          </div>
        </div>

        <div className="info-item">
          <span className="info-icon">⭐</span>
          <div className="info-content">
            <span className="info-label">Cumulative GPA</span>
            <span className="info-value">{cgpa} / 10.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;