import React from 'react';

function Footer() {
  const currentYear = 2026;

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand font-weight-bold">
          SR UNIVERSITY
        </div>
        <p className="footer-copy">
          © {currentYear} SR UNIVERSITY. Student Management System. All Rights Reserved.
        </p>
        <div className="footer-links">
          <span className="footer-link">Privacy Policy</span>
          <span className="footer-link-divider">•</span>
          <span className="footer-link">Terms of Service</span>
          <span className="footer-link-divider">•</span>
          <span className="footer-link">Academic Helpdesk</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;