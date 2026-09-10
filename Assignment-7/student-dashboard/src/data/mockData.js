export const collegeInfo = {
  name: "ABC College of Engineering",
  dashboardTitle: "Student Management Dashboard",
  subtitle: "Student Management System",
  academicYear: "2025 - 2026",
  code: "ABC-ENG-2026"
};

export const studentsData = [
  {
    id: 1,
    name: "Siddartha",
    rollNumber: "22A81A0501",
    branch: "Computer Science and Engineering",
    shortBranch: "CSE",
    year: "3rd Year",
    semester: "6th Semester",
    email: "student@example.com",
    phone: "+91 9876543210",
    attendance: 87,
    cgpa: 8.6,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    initials: "S",
    subjects: [
      {
        code: "CS601",
        name: "Database Management Systems",
        faculty: "Dr. Kumar",
        credits: 4,
        marks: 85,
        grade: "A"
      },
      {
        code: "CS602",
        name: "Operating Systems",
        faculty: "Dr. Priya",
        credits: 4,
        marks: 78,
        grade: "B+"
      },
      {
        code: "CS603",
        name: "Web Technologies & Full Stack",
        faculty: "Prof. Rajesh",
        credits: 3,
        marks: 92,
        grade: "O"
      },
      {
        code: "CS604",
        name: "Computer Networks",
        faculty: "Dr. Anitha",
        credits: 4,
        marks: 88,
        grade: "A+"
      },
      {
        code: "CS605",
        name: "Software Engineering",
        faculty: "Prof. Ramesh",
        credits: 3,
        marks: 81,
        grade: "A"
      },
      {
        code: "CS606",
        name: "Artificial Intelligence Lab",
        faculty: "Dr. Sneha",
        credits: 2,
        marks: 95,
        grade: "O"
      }
    ],
    exams: [
      {
        id: 101,
        name: "Database Management Systems",
        code: "CS601",
        date: "15 September 2026",
        time: "10:00 AM - 1:00 PM",
        room: "Block A - 204",
        status: "Upcoming"
      },
      {
        id: 102,
        name: "Operating Systems",
        code: "CS602",
        date: "18 September 2026",
        time: "10:00 AM - 1:00 PM",
        room: "Block B - 105",
        status: "Scheduled"
      },
      {
        id: 103,
        name: "Web Technologies & Full Stack",
        code: "CS603",
        date: "21 September 2026",
        time: "2:00 PM - 5:00 PM",
        room: "Lab 3 - IT Block",
        status: "Scheduled"
      }
    ]
  },
  {
    id: 2,
    name: "Rahul",
    rollNumber: "22A81A0502",
    branch: "Electronics & Communication Engineering",
    shortBranch: "ECE",
    year: "3rd Year",
    semester: "6th Semester",
    email: "rahul@example.com",
    phone: "+91 9876543211",
    attendance: 72,
    cgpa: 7.8,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    initials: "R",
    subjects: [
      {
        code: "EC601",
        name: "Digital Signal Processing",
        faculty: "Dr. V. Sharma",
        credits: 4,
        marks: 74,
        grade: "B+"
      },
      {
        code: "EC602",
        name: "VLSI Design Systems",
        faculty: "Prof. Sunita",
        credits: 4,
        marks: 70,
        grade: "B"
      },
      {
        code: "EC603",
        name: "Microcontrollers",
        faculty: "Dr. Karthik",
        credits: 3,
        marks: 68,
        grade: "C+"
      },
      {
        code: "EC604",
        name: "Antennas & Wave Propagation",
        faculty: "Dr. Reddy",
        credits: 4,
        marks: 76,
        grade: "B+"
      }
    ],
    exams: [
      {
        id: 201,
        name: "Digital Signal Processing",
        code: "EC601",
        date: "16 September 2026",
        time: "10:00 AM - 1:00 PM",
        room: "Block C - 302",
        status: "Upcoming"
      },
      {
        id: 202,
        name: "VLSI Design Systems",
        code: "EC602",
        date: "19 September 2026",
        time: "10:00 AM - 1:00 PM",
        room: "Block C - 302",
        status: "Scheduled"
      }
    ]
  },
  {
    id: 3,
    name: "Priya",
    rollNumber: "22A81A0503",
    branch: "Information Technology",
    shortBranch: "IT",
    year: "3rd Year",
    semester: "6th Semester",
    email: "priya@example.com",
    phone: "+91 9876543212",
    attendance: 91,
    cgpa: 9.2,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    initials: "P",
    subjects: [
      {
        code: "IT601",
        name: "Cloud Computing & AWS",
        faculty: "Dr. Mehra",
        credits: 4,
        marks: 94,
        grade: "O"
      },
      {
        code: "IT602",
        name: "Information Security",
        faculty: "Prof. Arvind",
        credits: 4,
        marks: 89,
        grade: "A+"
      },
      {
        code: "IT603",
        name: "Data Analytics & Mining",
        faculty: "Dr. Lakshmi",
        credits: 3,
        marks: 91,
        grade: "O"
      },
      {
        code: "IT604",
        name: "Mobile App Development",
        faculty: "Prof. Sandeep",
        credits: 3,
        marks: 87,
        grade: "A"
      }
    ],
    exams: [
      {
        id: 301,
        name: "Cloud Computing & AWS",
        code: "IT601",
        date: "15 September 2026",
        time: "2:00 PM - 5:00 PM",
        room: "Block D - Lab 1",
        status: "Upcoming"
      },
      {
        id: 302,
        name: "Information Security",
        code: "IT602",
        date: "18 September 2026",
        time: "2:00 PM - 5:00 PM",
        room: "Block D - Hall 2",
        status: "Scheduled"
      }
    ]
  },
  {
    id: 4,
    name: "Ananya",
    rollNumber: "22A81A0504",
    branch: "Computer Science & AI",
    shortBranch: "CS-AI",
    year: "3rd Year",
    semester: "6th Semester",
    email: "ananya@example.com",
    phone: "+91 9876543213",
    attendance: 68,
    cgpa: 7.4,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    initials: "A",
    subjects: [
      {
        code: "AI601",
        name: "Deep Learning Foundations",
        faculty: "Dr. Shastri",
        credits: 4,
        marks: 72,
        grade: "B"
      },
      {
        code: "AI602",
        name: "Natural Language Processing",
        faculty: "Prof. Geetha",
        credits: 4,
        marks: 66,
        grade: "C+"
      },
      {
        code: "AI603",
        name: "Computer Vision Lab",
        faculty: "Dr. Nair",
        credits: 3,
        marks: 75,
        grade: "B+"
      }
    ],
    exams: [
      {
        id: 401,
        name: "Deep Learning Foundations",
        code: "AI601",
        date: "17 September 2026",
        time: "10:00 AM - 1:00 PM",
        room: "AI Lab - 101",
        status: "Upcoming"
      }
    ]
  },
  {
    id: 5,
    name: "Vikram",
    rollNumber: "22A81A0505",
    branch: "Mechanical Engineering",
    shortBranch: "ME",
    year: "4th Year",
    semester: "8th Semester",
    email: "vikram@example.com",
    phone: "+91 9876543214",
    attendance: 84,
    cgpa: 8.1,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    initials: "V",
    subjects: [
      {
        code: "ME801",
        name: "Robotics & Automation",
        faculty: "Dr. Joshi",
        credits: 4,
        marks: 82,
        grade: "A"
      },
      {
        code: "ME802",
        name: "Heat & Mass Transfer",
        faculty: "Prof. Nambiar",
        credits: 4,
        marks: 80,
        grade: "A"
      },
      {
        code: "ME803",
        name: "CAD/CAM Engineering",
        faculty: "Dr. Deshmukh",
        credits: 3,
        marks: 86,
        grade: "A+"
      }
    ],
    exams: [
      {
        id: 501,
        name: "Robotics & Automation",
        code: "ME801",
        date: "16 September 2026",
        time: "2:00 PM - 5:00 PM",
        room: "Mech Workshop",
        status: "Upcoming"
      }
    ]
  }
];
