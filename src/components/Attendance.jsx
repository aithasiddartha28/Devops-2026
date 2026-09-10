import React from 'react';

function Attendance({ percentage = 87 }) {
  const isEligible = percentage >= 75;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="card attendance-card">
      <div className="card-header-flex">
        <h2>Overall Attendance</h2>
        <span className={`badge ${isEligible ? 'badge-success' : 'badge-danger'}`}>
          {isEligible ? 'Eligible' : 'Not Eligible'}
        </span>
      </div>

      <div className="attendance-body">
        <div className="attendance-metric-container">
          <div className="attendance-big-number">
            <span className={`percentage-val ${isEligible ? 'text-success' : 'text-danger'}`}>
              {clampedPercentage}%
            </span>
            <span className="percentage-label">Total Present</span>
          </div>

          <div className="attendance-status-box">
            <div className="status-title">Eligibility Status</div>
            <div className={`status-highlight ${isEligible ? 'eligible' : 'not-eligible'}`}>
              {isEligible ? '✅ Eligible for Examinations' : '⚠️ Not Eligible (Shortage of Attendance)'}
            </div>
          </div>
        </div>

        {/* Visual Progress Bar Indicator */}
        <div className="progress-bar-container">
          <div className="progress-bar-labels">
            <span>0%</span>
            <span className="threshold-marker" style={{ left: '75%' }}>
              Threshold: 75%
            </span>
            <span>100%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className={`progress-bar-fill ${isEligible ? 'fill-success' : 'fill-danger'}`}
              style={{ width: `${clampedPercentage}%` }}
            />
            <div className="threshold-line" style={{ left: '75%' }} title="75% Minimum Eligibility Required" />
          </div>
        </div>

        <div className={`attendance-notice ${isEligible ? 'notice-info' : 'notice-warning'}`}>
          {isEligible ? (
            <p>
              🎉 Great job! Your attendance is above the mandatory <strong>75% threshold</strong>. You are qualified to download your hall ticket.
            </p>
          ) : (
            <p>
              ⚠️ <strong>Action Required:</strong> Your attendance is currently below 75%. Please contact your class coordinator or department head immediately to submit condonation requests.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Attendance;