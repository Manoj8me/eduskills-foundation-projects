import { Icon } from "@iconify/react";
import { AutoMode, Book, CorporateFare } from "@mui/icons-material";
import connectimg from "../assets/imgs/favicon (3).png"; // Import the connect registration image
// -----------------------------------------------------------------
const navConfig = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <Icon icon="mingcute:classify-2-fill" height={22} width={22} />,
  },

  {
    title: "Academy Program",
    path: "/academy-program",
    icon: <Icon icon="mdi:google-classroom" height={22} width={22} />,
  },

  // Admin....................................

  {
    title: "Institute",
    path: "/institute",
    icon: <Icon icon="fa:university" height={22} width={22} />,
  },
  {
    title: "Awards",
    path: "/award-management",
    icon: <Icon icon="gg:awards" height={22} width={22} />,
  },
  // new item
{
  title: "Certificates",
  icon: <Icon icon="lineicons:certificate-badge-1" height={22} width={22} />,
  children: [
    {
      title: "Issue Certificates",
      // path: "/issue-certificates",
      path: "/certificate-manager",
      icon: <Icon icon="mdi:certificate-outline" height={20} width={20} />,
    },
  ],
},

  {
    title: "Academy",
    path: "/academy",
    icon: <Icon icon="ic:round-corporate-fare" height={22} width={22} />,
  },
  {
    title: "Educators",
    path: "/admin-educator",
    icon: <Icon icon="ph:chalkboard-teacher-bold" height={22} width={22} />,
  },
  //

  {
    title: "Student",
    path: "/add-student",
    icon: <Icon icon="mdi:account-plus" height={22} width={22} />,
  },
  {
    title: "Manage User",
    path: "/manage-user",
    icon: <Icon icon="mdi:account-group" height={22} width={22} />,
    children: [
      {
        title: "Student",
        path: "/add-student",
        parent: "Manage User",
        icon: <Icon icon="mdi:account-plus" height={22} width={22} />,
      },
      {
        title: "Staff",
        path: "/membership-list",
        parent: "Manage User",
        icon: (
          <Icon icon="icon-park-outline:file-staff" height={22} width={22} />
        ),
      },
    ],
  },
  {
    title: "Institutes",
    path: "/institutes",
    icon: <Icon icon="fa:university" height={22} width={22} />,
    children: [
      {
        title: "Institute Dashboard",
        path: "/total-staff",
        parent: "Institutes",
        icon: <Icon icon="mingcute:classify-2-fill" height={22} width={22} />,
      },
      {
        title: "Student",
        path: "/student-staff",
        parent: "Institutes",
        icon: <Icon icon="mdi:account-school" height={22} width={22} />, // student icon
      },
      {
        title: "Internship",
        path: "/internship-all-staff",
        parent: "Institutes",
        icon: <Icon icon="vaadin:academy-cap" height={22} width={22} />,
      },
    ],
  },
  {
    title: "Internship",
    path: "/main-sidebar",
    icon: <Icon icon="mdi:account-graduation-outline" height={25} width={25} />,
  },
  {
    title: "Connect Registrations",
    path: "/connect-reg",
    icon: <img src={connectimg} alt="Connect" height={22} width={22} />,
  },
  {
    title: "Talent Connect",
    path: "/coming-soon",
    icon: <Icon icon="tabler:users-group" height={22} width={22} />,
  },
  // {
  //   title: "Tech Camp",
  //   path: "/acalendar",
  //   parent: "Activities",
  //   icon: <Icon icon="carbon:user-activity" height={22} width={22} />,
  //   badge: "Testing", // Added testing badge
  // },
  // {
  //   title: "Events",
  //   path: "/multi",
  //   icon: <Icon icon="ic:round-event" height={22} width={22} />,
  //   children: [
  //     {
  //       title: "Connect",
  //       path: "/multi",
  //       parent: "Events",
  //       icon: <img src={connectimg} alt="Connect" height={22} width={22} />,
  //     },
  //   ],
  // },
  {
    title: "Activities",
    path: "/activity",
    icon: (
      <Icon
        icon="material-symbols-light:browse-activity-rounded"
        height={22}
        width={22}
      />
    ),
    children: [
      {
        title: "Tech Camp",
        path: "/tech-camp-calendar",
        parent: "Activities",
        icon: <Icon icon="carbon:user-activity" height={22} width={22} />,
        badge: "Testing", // Added testing badge
      },
      {
        title: "Certificate",
        path: "/spoc-event",
        parent: "Activities",
        icon: (
          <Icon icon="lineicons:certificate-badge-1" height={22} width={22} />
        ),
      },
    ],
  },

  {
    title: "Activity",
    path: "/multi",
    icon: <Icon icon="ic:round-event" height={22} width={22} />,
    children: [
      {
        title: "My Calendar",
        path: "/mcalendar",
        parent: "Activity",
        icon: <Icon icon="ic:round-event" height={22} width={22} />,
        // badge: "Testing", // Added testing badge
      },
      {
        title: "Tech Camp",
        path: "/techcamp-event",
        parent: "Activity",
        icon: <Icon icon="carbon:event" height={22} width={22} />,
        // badge: "Testing", // Added testing badge
      },
      {
        title: "FDP",
        path: "/fdp-event",
        parent: "Activity",
        icon: (
          <Icon
            icon="material-symbols:event-seat-sharp"
            height={22}
            width={22}
          />
        ),
        // badge: "Testing", // Added testing badge
      },
      {
        title: "EDP",
        path: "/edp-event",
        parent: "Activity",
        icon: (
          <Icon
            icon="majesticons:hand-pointer-event-line"
            height={22}
            width={22}
          />
        ),
        // badge: "Testing", // Added testing badge
      },
    ],
  },
  {
    title: "Event",
    path: "/agenda-manage",
    icon: <Icon icon="ic:round-event" height={22} width={22} />,
    children: [
      // {
      //   title: "Connect",
      //   path: "/event-connect",
      //   parent: "Event",
      //   icon: <img src={connectimg} alt="Connect" height={22} width={22} />,
      // },
      // {
      //   title: "Connect Agenda",
      //   path: "/agenda-manage",
      //   parent: "Event",
      //   icon: <img src={connectimg} alt="Connect" height={22} width={22} />,
      // },
      // {
      //   title: "Connect Registrations",
      //   path: "/connect-reg",
      //   parent: "Event",
      //   icon: <img src={connectimg} alt="Connect" height={22} width={22} />,
      // },
      {
        title: "Connect",
        path: "/multi",
        parent: "Event",
        icon: <img src={connectimg} alt="Connect" height={22} width={22} />,
        badge: "Testing",
      },
      {
        title: "Trainers Availability",
        path: "/acalendar",
        parent: "Event",
        icon: <Icon icon="ic:round-event" height={22} width={22} />,
        badge: "Testing", // Added testing badge
      },
      {
        title: "Tech Camp",
        path: "/techcamp_dashboard",
        parent: "Event",
        icon: <Icon icon="ic:round-event" height={22} width={22} />,
        badge: "Testing", // Added testing badge
      },
      {
        title: "FDP",
        path: "/fdp_dashboard",
        parent: "Event",
        icon: <Icon icon="ic:round-event" height={22} width={22} />,
        badge: "Testing", // Added testing badge
      },
      {
        title: "EDP",
        path: "/edp_dashboard",
        parent: "Event",
        icon: <Icon icon="ic:round-event" height={22} width={22} />,
        badge: "Testing", // Added testing badge
      },
    ],
  },
  {
    title: "Subscription",
    path: "/subscription",
    icon: <Icon icon="mdi:credit-card-outline" height={22} width={22} />,
  },
  {
    //pratyukticode three lines
    title: "Domain Assign",
    path: "/programassign",
    icon: <Icon icon="mdi:credit-card-outline" height={22} width={22} />,
  },
  //............................................

  {
    title: "COE",
    path: "/coe",
    icon: <Icon icon="solar:documents-broken" height={25} width={25} />,
  },

  {
    title: "News & Events",
    path: "/news-events",
    icon: (
      <Icon icon="material-symbols:event-note-rounded" height={22} width={22} />
    ),
  },
  {
    title: "Publication",
    path: "/publication",
    icon: <Book />,
  },

  {
    title: "Resume",
    path: "/resume",
    icon: <Icon icon="pepicons-pop:cv" height={22} width={22} />,
  },
  // {
  //   title: "Staff",
  //   path: "/staff",
  //   icon: <Icon icon="clarity:employee-solid" height={22} width={22} />,
  // },
  {
    title: "Staff",
    path: "/staff",
    icon: <Icon icon="clarity:employee-solid" height={22} width={22} />,
    parent: "Staff",
    children: [
      {
        title: "RM",
        path: "/staff",
        icon: <Icon icon="clarity:employee-solid" height={22} width={22} />,
      },
      {
        title: "Trainer",
        path: "/trainer-management",
        icon: <Icon icon="mdi:account-tie" height={22} width={22} />,
      },
    ],
  },
  {
    title: "Placement",
    path: "/placement",
    icon: <Icon icon="ic:twotone-work" height={22} width={22} />,
    parent: "Placement",
    children: [
      {
        title: "Resume",
        path: "/placement",
        icon: <CorporateFare />,
      },
      {
        title: "Job Details",
        path: "/placement",
        icon: <CorporateFare />,
      },
      {
        title: "Interview",
        path: "/placement",
        icon: <CorporateFare />,
      },
    ],
  },
  {
    title: "Support",
    path: "/support",
    icon: (
      <Icon icon="fluent:person-support-20-filled" height={22} width={22} />
    ),
  },
  {
    title: "Report",
    // path: "/report",
    icon: <Icon icon="mdi:report-box" height={22} width={22} />,
    children: [
      {
        title: "Student",
        path: "/payment",
        icon: <CorporateFare />,
      },
      {
        title: "Resume",
        path: "/report",
        icon: <CorporateFare />,
      },
    ],
  },

  {
    title: "Tickets",
    path: "/get token",
    icon: <Icon icon="material-symbols:token-rounded" height={22} width={22} />,
    parent: "Tickets",
    children: [
      {
        title: "All Tickets",
        path: "/getticket",
        icon: <CorporateFare />,
      },
      {
        title: "My Tickets",
        path: "/token",
        icon: <CorporateFare />,
      },
      {
        title: "History",
        path: "/history",
        icon: <Icon icon="material-symbols:history" height={22} width={22} />,
      },
    ],
  },

  {
    title: "IT Support",
    path: "/Itsupport",
    icon: (
      <Icon icon="fluent:person-support-20-filled" height={22} width={22} />
    ),
    parent: "IT Support",
    children: [
      {
        title: "Support Dashboard",
        path: "/supportdashboard",
        icon: <Icon icon="mdi:report-box" height={22} width={22} />,
      },
      {
        title: "Support Staff",
        path: "/support staff",
        icon: (
          <Icon icon="fluent:person-support-20-filled" height={22} width={22} />
        ),
      },
    ],
  },
  // Talaent Connect..................
  {
    title: "Company",
    path: "/company",
    icon: (
      <Icon
        icon="material-symbols:corporate-fare-rounded"
        height={22}
        width={22}
      />
    ),
  },

  {
    title: "Job Description",
    path: "/job-description",
    icon: <Icon icon="carbon:batch-job" height={22} width={22} />,
  },
  {
    title: "Job Post",
    path: "/job-post",
    icon: <Icon icon="material-symbols:post-outline" height={22} width={22} />,
  },
  {
    title: "Activities Calendar",
    path: "/acalendar",
    icon: <Icon icon="ic:round-event" height={22} width={22} />,
    badge: "Testing", // Added testing badge
  },
  {
    title: "Job Applications",
    path: "/applications",
    icon: <Icon icon="pepicons-print:cv" height={22} width={22} />,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <Icon icon="material-symbols:settings" height={22} width={22} />,
  },
  {
    title: "Process Document",
    path: "/Domain",
    icon: <Icon icon="material-symbols:token-rounded" height={22} width={22} />,
    parent: "Tickets",
  },
  {
    title: "Students",
    path: "/get-student",
    icon: <Icon icon="hugeicons:students" height={22} width={22} />,
  },
];

const roleTitles = {
  spoc: [
    "Dashboard",
    "Internship",
    // "Event/Activity",
    "Activities",
    // "Events",
    "Jobs",
    "Student Info",
    "Corporate",
    "Educator",
    "COE",
    "Manage User",
    // "Activity",
    "Talent Connect",
    "Subscription",
    "Internship Testing",
    // "Reports",

    // "Awards & Recognition",
    // "News & Events",
    // "Talent Connect",
    // "Publication",
    "Membership",
    "Certificate",
    "Institutional Details",

    // "Support",
  ],
  management: [
    "Dashboard",
    "Internship",
    "Educator",
    "Corporate",
    "Membership",
  ],
  educator: ["Dashboard", "Internship", "Academy Program", "Support"],

  leaders: [
    "Dashboard",
    "Internship",
    "Student",
    "Talent Connect",
    "Event/Activity",
    "Subscription",
    "COE",
  ],
  dspoc: [
    "Dashboard",
    "Internship",
    "Student",
    "Talent Connect",
    "Event/Activity",
    "Subscription",
    "COE",
  ],
  tpo: [
    "Dashboard",
    // "Internship",
    // "Student",
    "Talent Connect",
    "Event/Activity",
    "Subscription",
    // "COE",
  ],
  trainer: [
    "Dashboard",
    "Activity",

    // "Internship",
    // "Student",
    // "Talent Connect",
    // "Event/Activity",
    // "Subscription",
    // "COE",
  ],
  manager: [
    "Dashboard",
    "Internship",
    "College List",
    "Academy Program",
    "Institutional Details",
    "Academy",
  ],
  account_manager: [
    "Dashboard",
    "Internship",
    "College List",
    "Academy Program",
    "Institutional Details",
  ],
  talent: [
    "Dashboard",
    "Company",
    "Job Description",
    "Job Post",
    "Job Applications",
    // "Placement",
    // "Resume",
    // "Report",
    // "Support"
  ],
  admin: [
    "Certificates",  // ✅ New item
    "Dashboard",
    "Event",
    "IT Support",
    "Trainer",
    // "Internship",
    "Institute",
    // "Academy Program",
    // "Institutional Details",
    "Educators",
    "Academy",
    "Awards",
    "Staff",
    "Domain Assign", //pratyukticode
    // "Educator",
    // "Settings",
  ],
  support: ["Dashboard", "History", "Tickets", "Process Document", "Students"],
  staff: [
    "Dashboard",
    "Institutes",
    // "Connect Registrations",
    // "Internship",
    "Event Details",
    "Tech Camp",
    "Event",
    // "Institute",
    // "Academy Program",
    // "Institutional Details",
    //  "Educator",

    // "Academy",
  ],
};

const filterNavConfig = (roles) => {
  const allowedTitles = [];

  // ✅ Collect allowed titles based on role
  for (const role in roles) {
    if (roles[role]) {
      allowedTitles.push(...roleTitles[role]);
    }
  }

  //  Filter and map nav items
  const menuItems = navConfig
    .filter((item) => allowedTitles.includes(item.title))
    .map((item) => {
      let children = item.children || [];

      //  For staff: remove "Connect" from Events submenu
      if (roles.staff && item.title === "Event") {
        children = children.filter((child) => child.title !== "Connect");
      }

      //  For staff: remove extra top-level "Tech Camp" (outside Events)
      if (roles.staff && item.title === "Tech Camp") {
        return null; // exclude this entry
      }

      return {
        title: item.title,
        path: item.path,
        icon: item.icon,
        children,
        badge: item.badge, // Include badge property
      };
    })
    .filter(Boolean); // remove null entries like the excluded Tech Camp

  return menuItems;
};

// const filterNavConfig = (roles) => {
//   const allowedTitles = [];

//   for (const role in roles) {
//     if (roles[role]) {
//       allowedTitles.push(...roleTitles[role]);
//     }
//   }

//   const menuItems = navConfig
//     .filter((item) => allowedTitles.includes(item.title))
//     .map((item) => ({
//       title: item.title,
//       path: item.path,
//       icon: item.icon,
//       children: item.children,
//       badge: item.badge, // Include badge property
//     }));

//   return menuItems;
// };

export const MenuItems = () => {
  const authorise = localStorage.getItem("Authorise");
  const roles = {
    admin: authorise === "admin" ? true : false,
    staff: authorise === "staff" ? true : false,
    spoc: authorise === "spoc" ? true : false,
    manager: authorise === "manager" ? true : false,
    management: authorise === "management" ? true : false,
    educator: authorise === "educator" ? true : false,
    account_manager: authorise === "account_manager" ? true : false,
    talent: authorise === "talent" ? true : false,
    leaders: authorise === "leaders" ? true : false,
    dspoc: authorise === "dspoc" ? true : false,
    tpo: authorise === "tpo" ? true : false,
    trainer: authorise === "trainer" ? true : false,
    support: authorise === "support" ? true : false,
  };

  return filterNavConfig(roles);
};
