export const PIPELINE_STAGES = ["Applied", "Screen", "Interview", "Offer", "Hired", "Rejected"];

function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function now() {
  return new Date().toISOString();
}

export function createInitialState() {
  const jobs = [
    {
      id: "job-frontend-lead",
      title: "Senior MERN Engineer",
      department: "Product Engineering",
      location: "Remote",
      employmentType: "Full-time",
      status: "Open",
      hiringManager: "Aarav Mehta",
      salaryRange: "18 LPA - 28 LPA",
      priority: "High",
      skills: ["React", "Node.js", "MongoDB", "System Design"],
      description: "Own core product features and mentor engineers on a modern MERN platform.",
      createdAt: now(),
      updatedAt: now()
    },
    {
      id: "job-product-designer",
      title: "Product Designer",
      department: "Design",
      location: "Bengaluru",
      employmentType: "Full-time",
      status: "Open",
      hiringManager: "Neha Kapoor",
      salaryRange: "14 LPA - 22 LPA",
      priority: "Medium",
      skills: ["Figma", "Research", "Design Systems"],
      description: "Design polished workflows for B2B teams and partner closely with product managers.",
      createdAt: now(),
      updatedAt: now()
    },
    {
      id: "job-devops",
      title: "DevOps Engineer",
      department: "Platform",
      location: "Hyderabad",
      employmentType: "Contract",
      status: "Paused",
      hiringManager: "Rohan Iyer",
      salaryRange: "12 LPA - 20 LPA",
      priority: "Low",
      skills: ["AWS", "Docker", "CI/CD", "Monitoring"],
      description: "Improve deployment reliability and observability for customer-facing services.",
      createdAt: now(),
      updatedAt: now()
    }
  ];

  const candidates = [
    {
      id: "cand-kavya",
      name: "Kavya Rao",
      email: "kavya.rao@example.com",
      phone: "+91 98765 43210",
      location: "Pune",
      headline: "MERN engineer with payments and dashboard experience",
      source: "LinkedIn",
      stage: "Interview",
      rating: 5,
      owner: "Priya Shah",
      jobId: "job-frontend-lead",
      skills: ["React", "Express", "MongoDB", "TypeScript"],
      salaryExpectation: "24 LPA",
      noticePeriod: "30 days",
      resumeUrl: "https://example.com/resumes/kavya-rao.pdf",
      nextStep: "Technical interview",
      nextStepDueDate: daysFromNow(1),
      notes: [
        {
          id: "note-kavya-1",
          body: "Strong API design instincts and clear product thinking.",
          author: "Priya Shah",
          createdAt: daysFromNow(-2),
          updatedAt: daysFromNow(-2)
        }
      ],
      timeline: [
        {
          id: "event-kavya-1",
          type: "created",
          message: "Candidate added for Senior MERN Engineer.",
          createdAt: daysFromNow(-5),
          updatedAt: daysFromNow(-5)
        },
        {
          id: "event-kavya-2",
          type: "stage",
          message: "Moved to Interview.",
          createdAt: daysFromNow(-1),
          updatedAt: daysFromNow(-1)
        }
      ],
      createdAt: daysFromNow(-5),
      updatedAt: now()
    },
    {
      id: "cand-omar",
      name: "Omar Khan",
      email: "omar.khan@example.com",
      phone: "+91 99887 77665",
      location: "Mumbai",
      headline: "Backend-heavy full-stack developer",
      source: "Referral",
      stage: "Screen",
      rating: 4,
      owner: "Priya Shah",
      jobId: "job-frontend-lead",
      skills: ["Node.js", "MongoDB", "Redis", "AWS"],
      salaryExpectation: "20 LPA",
      noticePeriod: "45 days",
      resumeUrl: "https://example.com/resumes/omar-khan.pdf",
      nextStep: "Recruiter screen",
      nextStepDueDate: daysFromNow(2),
      notes: [],
      timeline: [
        {
          id: "event-omar-1",
          type: "created",
          message: "Candidate added from referral.",
          createdAt: daysFromNow(-3),
          updatedAt: daysFromNow(-3)
        }
      ],
      createdAt: daysFromNow(-3),
      updatedAt: now()
    },
    {
      id: "cand-isha",
      name: "Isha Menon",
      email: "isha.menon@example.com",
      phone: "+91 91234 56780",
      location: "Chennai",
      headline: "Product designer focused on complex dashboards",
      source: "Portfolio",
      stage: "Offer",
      rating: 5,
      owner: "Priya Shah",
      jobId: "job-product-designer",
      skills: ["Figma", "UX Research", "Design Systems"],
      salaryExpectation: "19 LPA",
      noticePeriod: "Immediate",
      resumeUrl: "https://example.com/resumes/isha-menon.pdf",
      nextStep: "Compensation approval",
      nextStepDueDate: daysFromNow(3),
      notes: [
        {
          id: "note-isha-1",
          body: "Portfolio shows strong enterprise workflow thinking.",
          author: "Priya Shah",
          createdAt: daysFromNow(-4),
          updatedAt: daysFromNow(-4)
        }
      ],
      timeline: [
        {
          id: "event-isha-1",
          type: "created",
          message: "Candidate added from portfolio.",
          createdAt: daysFromNow(-8),
          updatedAt: daysFromNow(-8)
        },
        {
          id: "event-isha-2",
          type: "stage",
          message: "Moved to Offer.",
          createdAt: daysFromNow(-1),
          updatedAt: daysFromNow(-1)
        }
      ],
      createdAt: daysFromNow(-8),
      updatedAt: now()
    },
    {
      id: "cand-ryan",
      name: "Ryan D'Souza",
      email: "ryan.dsouza@example.com",
      phone: "+91 90000 11122",
      location: "Goa",
      headline: "DevOps engineer with AWS migration experience",
      source: "Indeed",
      stage: "Applied",
      rating: 3,
      owner: "Priya Shah",
      jobId: "job-devops",
      skills: ["AWS", "Docker", "GitHub Actions"],
      salaryExpectation: "16 LPA",
      noticePeriod: "60 days",
      resumeUrl: "https://example.com/resumes/ryan-dsouza.pdf",
      nextStep: "Portfolio review",
      nextStepDueDate: daysFromNow(4),
      notes: [],
      timeline: [
        {
          id: "event-ryan-1",
          type: "created",
          message: "Candidate applied through Indeed.",
          createdAt: daysFromNow(-1),
          updatedAt: daysFromNow(-1)
        }
      ],
      createdAt: daysFromNow(-1),
      updatedAt: now()
    },
    {
      id: "cand-meera",
      name: "Meera Nair",
      email: "meera.nair@example.com",
      phone: "+91 90909 30303",
      location: "Kochi",
      headline: "Frontend engineer with accessibility expertise",
      source: "Naukri",
      stage: "Hired",
      rating: 5,
      owner: "Priya Shah",
      jobId: "job-frontend-lead",
      skills: ["React", "Accessibility", "Testing Library"],
      salaryExpectation: "22 LPA",
      noticePeriod: "30 days",
      resumeUrl: "https://example.com/resumes/meera-nair.pdf",
      nextStep: "Onboarding kickoff",
      nextStepDueDate: daysFromNow(7),
      notes: [],
      timeline: [
        {
          id: "event-meera-1",
          type: "created",
          message: "Candidate added from Naukri.",
          createdAt: daysFromNow(-15),
          updatedAt: daysFromNow(-15)
        },
        {
          id: "event-meera-2",
          type: "stage",
          message: "Moved to Hired.",
          createdAt: daysFromNow(-2),
          updatedAt: daysFromNow(-2)
        }
      ],
      createdAt: daysFromNow(-15),
      updatedAt: now()
    }
  ];

  const users = [
    {
      id: "user-priya",
      name: "Priya Shah",
      email: "suraj@talentdeck.dev",
      password: "suraj123",
      role: "owner",
      avatarColor: "#2d8097"
    }
  ];

  return { jobs, candidates, users };
}
