// studentDataService.js
// This service will simulate API calls to fetch student data

// Helper to generate random student data
const generateStudentData = (count, options = {}) => {
  const domains = [
    "Web Development",
    "Data Science",
    "Mobile Development",
    "Cloud Computing",
    "AI/ML",
    "DevOps",
  ];
  const branches = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
  ];
  const cohorts = ["Spring 2024", "Fall 2023", "Summer 2023", "Winter 2023"];
  const years = [1, 2, 3, 4];
  const names = [
    "Alex Smith",
    "Jordan Taylor",
    "Morgan Lee",
    "Casey Jones",
    "Riley Brown",
    "Quinn Wilson",
    "Avery Davis",
    "Jamie Miller",
    "Taylor Moore",
    "Jordan Williams",
    "Sam Johnson",
    "Bailey Martinez",
    "Reese Thompson",
    "Drew Garcia",
    "Cameron Rodriguez",
    "Hayden Wilson",
    "Parker Thomas",
    "Charlie Anderson",
  ];
  const rejectionReasons = [
    "Incomplete submission",
    "Missing documentation",
    "Plagiarism detected",
    "Low quality work",
    "Incorrect format",
  ];

  return Array(count)
    .fill(0)
    .map((_, index) => {
      const name = names[Math.floor(Math.random() * names.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const branch = branches[Math.floor(Math.random() * branches.length)];
      const cohort = cohorts[Math.floor(Math.random() * cohorts.length)];
      const year = years[Math.floor(Math.random() * years.length)];

      return {
        id: index + 1,
        name,
        email: name.toLowerCase().replace(" ", ".") + "@university.edu",
        rollNo: `R${2023000 + index}`,
        year,
        cohort,
        branch,
        domain,
        // Only include rejection reason if specified in options
        ...(options.includeRejectionReason && {
          rejectionReason:
            rejectionReasons[
              Math.floor(Math.random() * rejectionReasons.length)
            ],
        }),
      };
    });
};

// Simulated API endpoints for different student categories
const studentDataService = {
  // Certificate Status
  getCertificateVerified: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateStudentData(157));
      }, 600);
    });
  },

  getVerificationInProgress: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateStudentData(43));
      }, 600);
    });
  },

  getCertificateNotUploaded: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateStudentData(75));
      }, 600);
    });
  },

  getCertificateRejected: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateStudentData(12, { includeRejectionReason: true }));
      }, 600);
    });
  },

  // Assessment Status
  getFirstAttemptCompleted: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateStudentData(185));
      }, 600);
    });
  },

  getFirstAttemptPending: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateStudentData(62));
      }, 600);
    });
  },

  getSecondAttemptCompleted: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateStudentData(43));
      }, 600);
    });
  },

  getSecondAttemptPending: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateStudentData(27));
      }, 600);
    });
  },

  // Final Certificate
  getEligibleStudents: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateStudentData(203));
      }, 600);
    });
  },

  getCertificatePending: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateStudentData(77));
      }, 600);
    });
  },

  getCertificateIssued: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateStudentData(126));
      }, 600);
    });
  },
};

export default studentDataService;
