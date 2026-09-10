import React from 'react';

function Header({ collegeName, title, subtitle, student, onToggleMobileSidebar, sidebarOpen }) {
  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="mobile-menu-btn" 
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
        <div className="header-brand">
          <div className="college-logo-badge">SRU</div>
          <div className="college-titles">
            <span className="college-name">{collegeName || "SR UNIVERSITY"}</span>
            <div className="header-subtitles">
              <span className="dashboard-title">{title || "Student Management Dashboard"}</span>
              <span className="subtitle-divider">•</span>
              <span className="system-subtitle">{subtitle || "Student Management System"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="header-right">
        {student && (
          <div className="active-student-pill">
            <div className="header-avatar">
              {student.avatar ? (
                <img src={student.avatar} alt={student.name} />
              ) : (
                <span>{student.initials || student.name?.charAt(0)}</span>
              )}
            </div>
            <div className="header-user-info">
              <span className="header-user-name">{student.name}</span>
              <span className="header-user-roll">{student.rollNumber}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;