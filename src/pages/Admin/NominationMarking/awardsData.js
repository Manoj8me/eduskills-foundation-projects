// Sample data for Award Management System
export const awardData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    designation: "Professor",
    institute: "MIT",
    email: "sarah.johnson@mit.edu",
    category: "Research Excellence",
    personalInfo: {
      phone: "+1-617-555-0123",
      department: "Computer Science",
      experience: "15 years",
    },
    achievements: {
      publications: "45 peer-reviewed papers",
      grants: "$2.5M in research grants",
      awards: "IEEE Fellow, ACM Distinguished Scientist",
    },
    files: [
      { name: "Research Portfolio.pdf", type: "pdf" },
      { name: "Publications List.docx", type: "docx" },
    ],
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    designation: "Associate Professor",
    institute: "Stanford University",
    email: "m.chen@stanford.edu",
    category: "Teaching Excellence",
    personalInfo: {
      phone: "+1-650-555-0456",
      department: "Mathematics",
      experience: "12 years",
    },
    achievements: {
      courses: "20+ courses taught",
      rating: "4.8/5 student evaluation",
      innovation: "Developed 3 new curriculum modules",
    },
    files: [
      { name: "Teaching Philosophy.pdf", type: "pdf" },
      { name: "Student Feedback.xlsx", type: "xlsx" },
    ],
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    designation: "Assistant Professor",
    institute: "Harvard University",
    email: "e.rodriguez@harvard.edu",
    category: "Innovation Award",
    personalInfo: {
      phone: "+1-617-555-0789",
      department: "Biomedical Engineering",
      experience: "8 years",
    },
    achievements: {
      patents: "5 patents filed",
      startups: "Co-founded 2 biotech startups",
      funding: "$1.8M in innovation grants",
    },
    files: [
      { name: "Innovation Portfolio.pdf", type: "pdf" },
      { name: "Patent Documents.zip", type: "zip" },
    ],
  },
  {
    id: 4,
    name: "Prof. David Kim",
    designation: "Professor",
    institute: "MIT",
    email: "d.kim@mit.edu",
    category: "Research Excellence",
    personalInfo: {
      phone: "+1-617-555-0321",
      department: "Mechanical Engineering",
      experience: "20 years",
    },
    achievements: {
      publications: "78 peer-reviewed papers",
      citations: "15,000+ citations",
      collaborations: "International research collaborations",
    },
    files: [
      { name: "Research Summary.pdf", type: "pdf" },
      { name: "Collaboration Letters.pdf", type: "pdf" },
    ],
  },
];

export const categories = [
  "Research Excellence",
  "Teaching Excellence",
  "Innovation Award",
  "Community Service",
];
