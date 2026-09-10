import React from 'react';

function Sidebar({ activeTab, setActiveTab, mobileOpen, onCloseMobile }) {
  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
    { id: 'profile', label: 'Student Profile', icon: '👤' },
    { id: 'subjects', label: 'Subjects & Marks', icon: '📚' },
    { id: 'attendance', label: 'Attendance', icon: '⏱️' },
    { id: 'exams', label: 'Examinations', icon: '📝' },
    { id: 'students', label: 'Students Directory', icon: '🎓' },
  ];

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={onCloseMobile} />
      )}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="portal-badge">STUDENT PORTAL</div>
          <button className="sidebar-close-btn" onClick={onCloseMobile}>✕</button>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-title">MAIN MENU</p>
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer-box">
          <div className="portal-status-dot"></div>
          <div>
            <div className="portal-status-title">Academic Session</div>
            <div className="portal-status-sub">2025 - 2026 Active</div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
