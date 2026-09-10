import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import SummaryCards from "./components/SummaryCards";
import StudentProfile from "./components/StudentProfile";
import SubjectList from "./components/SubjectList";
import Attendance from "./components/Attendance";
import ExamDetails from "./components/ExamDetails";
import StudentCard from "./components/StudentCard";
import Footer from "./components/Footer";
import { collegeInfo, studentsData } from "./data/mockData";
import "./App.css";

function App() {
  const [students] = useState(studentsData);
  const [selectedStudent, setSelectedStudent] = useState(studentsData[0]);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    // Smooth scroll up to profile / main view if user selected from directory
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-container">
      {/* Header Bar */}
      <Header
        collegeName={collegeInfo.name}
        title={collegeInfo.dashboardTitle}
        subtitle={collegeInfo.subtitle}
        student={selectedStudent}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        sidebarOpen={mobileSidebarOpen}
      />

      {/* Main Layout Grid with Sidebar */}
      <div className="app-layout">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <main className="main-content">
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-text">
              <h2>Welcome back, {selectedStudent.name}! 👋</h2>
              <p>
                Student Portal • <strong>{selectedStudent.branch}</strong> ({selectedStudent.year})
              </p>
            </div>
            <div className="quick-switch-wrapper">
              <label htmlFor="student-select">Active Student:</label>
              <select
                id="student-select"
                className="student-dropdown"
                value={selectedStudent.id}
                onChange={(e) => {
                  const target = students.find((s) => s.id === Number(e.target.value));
                  if (target) handleSelectStudent(target);
                }}
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.rollNumber} - {st.shortBranch})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="tab-view view-overview">
              {/* Summary Cards */}
              <SummaryCards student={selectedStudent} />

              {/* Main 2-Column Grid */}
              <div className="dashboard-grid">
                <div className="grid-column">
                  <StudentProfile student={selectedStudent} />
                  <SubjectList subjects={selectedStudent.subjects} />
                </div>

                <div className="grid-column">
                  <Attendance percentage={selectedStudent.attendance} />
                  <ExamDetails exams={selectedStudent.exams} />
                </div>
              </div>

              {/* Multiple Students Directory Cards Section */}
              <section className="students-directory-section">
                <div className="section-header-flex">
                  <div>
                    <h2 className="section-title">All Registered Students</h2>
                    <p className="section-subtitle">
                      Click "View Profile" on any student card to view their complete academic record.
                    </p>
                  </div>
                  <span className="badge badge-primary">{students.length} Students</span>
                </div>

                <div className="students-cards-grid">
                  {students.map((studentItem) => (
                    <StudentCard
                      key={studentItem.id}
                      student={studentItem}
                      isSelected={selectedStudent.id === studentItem.id}
                      onViewProfile={handleSelectStudent}
                    />
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === "profile" && (
            <div className="tab-view view-profile">
              <SummaryCards student={selectedStudent} />
              <StudentProfile student={selectedStudent} />
            </div>
          )}

          {/* TAB 3: SUBJECTS */}
          {activeTab === "subjects" && (
            <div className="tab-view view-subjects">
              <SubjectList subjects={selectedStudent.subjects} />
            </div>
          )}

          {/* TAB 4: ATTENDANCE */}
          {activeTab === "attendance" && (
            <div className="tab-view view-attendance">
              <Attendance percentage={selectedStudent.attendance} />
            </div>
          )}

          {/* TAB 5: EXAMINATIONS */}
          {activeTab === "exams" && (
            <div className="tab-view view-exams">
              <ExamDetails exams={selectedStudent.exams} />
            </div>
          )}

          {/* TAB 6: STUDENTS DIRECTORY */}
          {activeTab === "students" && (
            <div className="tab-view view-students">
              <div className="section-header-flex">
                <div>
                  <h2 className="section-title">Students Directory</h2>
                  <p className="section-subtitle">
                    Select a student to load their full profile into the active dashboard view.
                  </p>
                </div>
              </div>

              <div className="students-cards-grid">
                {students.map((studentItem) => (
                  <StudentCard
                    key={studentItem.id}
                    student={studentItem}
                    isSelected={selectedStudent.id === studentItem.id}
                    onViewProfile={(selected) => {
                      handleSelectStudent(selected);
                      setActiveTab("overview");
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;