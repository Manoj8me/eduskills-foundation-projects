import React from "react";
import { Navigate } from "react-router-dom";

// publicRoutes...................
import Login from "../pages/Auth/Login";
import PageNotFound from "../pages/404/PageNotFound";

// authProtectedSpoc..............
import Dashboard from "../pages/Dashboard";
import Internship from "../pages/Internship";
// import Company from "../pages/Company";
import Placement from "../pages/Placement";
import Resume from "../pages/Resume";
import Support from "../pages/Support";
import AcademyProgram from "../pages/AcademyProgram";
import InstitutionStatus from "../pages/InstitutionStatus";
import CorporateProgram from "../pages/CorporateProgram";
import Educator from "../pages/Educator";
import NewsEvents from "../pages/News&Events";
import Publication from "../pages/Publication";
import AwardsRecognition from "../pages/Awards&Recognition";

import Settings from "../pages/Auth/Settings";
import InternshipApproval from "../pages/Internship/InternApproval";
// import Membership from "../pages/Membership";
import TalentConnect from "../pages/TalentConnect";
import Agreements from "../pages/Membership/agreements";
// import Payment from "../pages/Membership/payment";
import InstitutionalProfile from "../pages/Membership/InstitutionalProfile/InstitutionalProfile";
import FeedbackForm from "../pages/Feedback";
// Admin
import AdminEducator from "../pages/Admin/Educator";
import Academy from "../pages/Admin/Academy";
import Institute from "../pages/Admin/Institute";
import ProgramAssign from "../pages/Admin/Program Assign/programAssign"; //pratyukticode
import AdminStaff from "../pages/Admin/Staff";
import ApplicationsPage from "../pages/TalentConnect/ApplicationsPage";
import JobDescriptionPage from "../pages/TalentConnect/JobDescriptionPage";
import JobPostPage from "../pages/TalentConnect/JobPostPage";
import CompanyPage from "../pages/TalentConnect/CompanyPage";
import Notification from "../pages/Notifications";
import Apsche from "../pages/Certificate/Apsche Certificate/Apsche";
import StaffEvent from "../pages/staffevent/StaffEvent";
import EventForm from "../pages/Admin/Event/EventForm";
import InternshipAll from "../pages/StudentInfo/InternshipAll";
import EmailDraft from "../pages/EmailDraft/EmailDraft";
import ExternalRedirect from "./ExternalRedirect";
import TailLogin from "../pages/Auth/TailLogin";
import LayoutInfo from "../pages/StudentInfo/LayoutInfo";
import InteractiveIndiaMap from "../pages/Map/InteractiveIndiaMap";
import PDFViewer from "../pages/StudentInfo/PDFviewer";
import MaterialExcelInterface from "../pages/StudentInfo/ExcelPasteInterface";
import SpocDashboard from "../pages/spoc dashboard/Dashboard";
import JobsApps from "../pages/talentconnectspoc/JobApps";
import InternshipTrackingTable from "../components/spocstatus/InternshipTrackingTable";
import MembersList from "../components/spocstatus/Faculty Database/MembersList";
import CohortDashboard from "../components/StaffSection/NewStatus/CohortDashboard";
import CheckboxSidebar from "../pages/sidebar/CheckboxSidebar";
import ComingSoonPage from "../components/comingsoon/ComingSoon";
import StudentStatusApp from "../components/studentstatus";
import SubscriptionDashboard from "../pages/subscription/Subscription";
import IntakeData from "../pages/StudentInfo/IntakeData";
import ReportSidebar from "../pages/reportsidebar/ReportSidebar";
import KnowledgeHubPage from "../pages/1guide/KnowledgehubPage";
import FilterForm from "../components/Applied/ReportAll";
import AnnouncementPage from "../pages/Announcement/Announcement";
import NewSidebar from "../pages/sidebar/NewSidebar";
import FDPManagement from "../pages/Trainer FDP/FDPManagement";
import TicketRaiseComponent from "../pages/TicketRaise/TicketRaiseComponent";
import AdminTicketManagement from "../pages/TicketRaise/AdminTicketManagement";
import SupportTicketManagementSystem from "../pages/supports/SupportTicketManagementSystem";
import JobListingApp from "../pages/TConnect/JobListingApp";
import FDPDetails from "../pages/Trainer FDP/FDPDetails";
import FDPParticipantsView from "../pages/Trainer FDP/FDPParticipants";
import TalentConnectDashboard from "../pages/TConnect/TalentConnectDashboard";
import MainSidebar from "../pages/mainsidebar/MainSidebar";
import ReportsLayout from "../components/New Report/ReportsLayout";
import NewMaterialExcelInterface from "../pages/StudentInfo/NewExcelPasteInterface";
import InstituteProfileView from "../pages/InstituteProfile/InstituteProfileDisplay";
import ManageUser from "../pages/mainsidebar/ManageUser";
import ProcessViewer from "../components/StudentSteps/StudentStep";
import InstituteProfile from "../pages/InstituteProfile/NewEducationForm";
import InstituteProfileDisplay from "../pages/InstituteProfile/InstituteProfileDisplay";
import NewTotalInternship from "../components/dashboard/InternshipSection/NewTotalInternship";
import StaffSidebar from "../pages/mainsidebar/StaffSidebar";
import FigmaStyleEditor from "../components/manage/FigmaStyleEditor";
import Deleted from "../components/Deleted/Deleted";
import EventDashboard from "../components/Event/EventDashboard";
import EduSkillsLoader from "../components/1Loader/EduSkillsLoader";
import MultiStepForm from "../components/1Loader/MultiForm";
import ProfilePage from "../components/Event/ProfileEditDrawer";
import SubDashboard from "../pages/subscription/SubDashboard";
import MembershipTable from "../pages/subscription/Subscription";
import NewSubs from "../pages/subscription/NewSubs";
import CompactRMForm from "../pages/1BDFrom/CompactRMForm";
import CollegeDataTable from "../pages/1BDFrom/CollegeDataTable";
import CombinedTableDrawer from "../pages/1BDFrom/CombinedTableDrawer";
import StaffManageUser from "../pages/mainsidebar/StaffManageUser";
import Archived from "../components/Archive/Archived";
import AwardsAccordion from "../pages/Connect25/AwardsAccordion";
import PersonalInfoForm from "../pages/Connect25/Nomination/NominationForm";
import PlacementMultiStepForm from "../pages/Connect25/tponomination/PlacementForm";
import MaintenancePage from "../pages/mainsidebar/Maintenancepage";
import AwardManagementSystem from "../pages/Admin/NominationMarking/AwardManagementSystem";
import MainVotingApp from "../pages/Trainer FDP/Example/MainVotingApp";
import MainCorporate from "../pages/Connect25/CorporateVoting/MainCorporate";
import Agenda from "../pages/AdminAgenda/Addagenda";
import FeedbackTable from "../pages/Admin/NominationMarking/FeedbackTable";
import FormBuilder from "../pages/Trainer FDP/FormBuilder";
import ConnectRegistrations from "../pages/Admin/NominationMarking/ConnectRegistrations";
import { BadgeCard } from "../pages/Connect25/BadgeCard";
import QRCodeScanner from "../Layouts/top/QrCodeScanner";
import EventQRPlanner from "../pages/Connect25/qrcode/EventQR";
import WinnerBanner from "../pages/Connect25/qrcode/WinnerBanner";
import ModernCalendar from "../pages/Trainer FDP/Slots/ModernCalendar";
import AttendanceSystem from "../pages/Trainer FDP/Slots/AttendanceSystem";
import ConferenceTicketGenerator from "../pages/Trainer FDP/Slots/ConferenceTicketGenerator";
import CalendarApp from "../pages/Trainer FDP/Calendars/CalendarApp";
import TrainerManagement from "../pages/Trainer FDP/TrainerAdd/TrainerManagement";
import AdminTrainerAvailabilityCalendar from "../pages/Trainer FDP/Calendars/AdminTrainerAvailabilityCalendar";
import BookingCalendar from "../pages/Trainer FDP/spocevent/BookingCalendar";
import EventFeedbackForm from "../pages/Admin/NominationMarking/EventFeedbackForm";
import FeedbackTables from "../pages/Trainer FDP/Example/FeedbackTable";
import AdminSupportDashboard from "../pages/Itsupport/AdminSupportDashboard";
import StudentQuestionsHistory from "../pages/Itsupport/StudentQuestionsHistory";
import ITSupportStaff from "../pages/Admin/itsupport/ITSupportStaff";
import SupportDashboard from "../pages/Admin/itsupport/SupportDashboard";
import Tickets from "../pages/Itsupport/Tickets";
import EventTabsComponent from "../pages/Connect25/EventTabsComponent";
import SpocEvents from "../pages/Trainer FDP/SpocEvent";
import TechCampsTable from "../pages/Trainer FDP/spocevent/Certificate/TechCampCertificate";
import DomainManagement from "../pages/supports/DomainManagement";
import WeekManagement from "../pages/supports/WeekManagement";
import Modules from "../pages/supports/Modules";
import StudentPreview from "../pages/supports/StudentPreview";
import AwardsByCategory from "../pages/Connect25/AwardsByCategory";
import SearchStudent from "../pages/Suport_Student/SearchStudent";
import StudentDashboard from "../pages/Suport_Student/StudentSupportDashboard";
import IntershipDetailTable from "../pages/Suport_Student/IntershipDetailTable";
import StaffTrainerAvailability from "../pages/Trainer FDP/Example/StaffTrainerAvailability";
import OnboardingForm from "../pages/staffevent/OnboardingForm";
import OnboardingManagement from "../pages/staffevent/OnboardingManagement";
import FacultyEventTable from "../pages/Trainer FDP/spocevent/FDPEDP/FacultyEventTable";
import BookingsList from "../pages/Trainer FDP/Calendars/BookingsList";
import TechCamp from "../pages/Trainer FDP/Calendars/TechCamp";
import FDPEvent from "../pages/Trainer FDP/Calendars/FDPEvent";
import EDPEvent from "../pages/Trainer FDP/Calendars/EDPEvent";
import EDPBookCalendar from "../pages/Trainer FDP/Calendars/EDPBookCalendar";
import TechCampDashboard from "../pages/Trainer FDP/Example/TechCampDashboard";
import FdpDashboard from "../pages/Trainer FDP/Example/FdpDashboard";
import EdpDashboard from "../pages/Trainer FDP/Example/EdpDashboard";

import CertificateCanvas from "../pages/Admin/Certificates/canvaFiles/CertificateCanvas";
import CertificateManager from "../pages/Admin/Certificates/certificateManagement/CertificateManager";


// import ColumnSelector from "../components/New Report/ColumnSelector";

const authProtected = [
  {
    path: "/dashboard",
    component: <Dashboard />,
    roles: [
      "spoc",
      "manager",
      "management",
      "educator",
      "account_manager",
      "talent_module",
      "admin",
      "staff",
      "talent",
      "leaders",
      "dspoc",
      "trainer",
      "support",
    ],
  },
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

//

const authProtectedRoutes = [
  {
    path: "/dashboard",
    component: <Dashboard />,
    roles: [
      "spoc",
      "manager",
      "management",
      "educator",
      "account_manager",
      "talent_module",
      "admin",
      "staff",
      "talent",
      "leaders",
      "dspoc",
      "tpo",
      "trainer",
      "support",
    ],
  },

  {
    path: "/feedback",
    component: <FeedbackForm />,
    roles: [
      "spoc",
      "manager",
      "management",
      "educator",
      "account_manager",
      "admin",
    ],
  },
  {
    path: "/settings",
    component: <Settings />,
    roles: [
      "spoc",
      "manager",
      "management",
      "educator",
      "account_manager",
      "admin",
      "staff",
    ],
  },

  {
    path: "/internship",
    component: <MainSidebar />,
    roles: [
      "spoc",
      "manager",
      "management",
      "educator",
      "account_manager",
      "admin",
      "staff",
    ],
  },

  // {
  //   path: "/company",
  //   component: <Company />,
  //   roles: ["talent_module"],
  // },

  {
    path: "/placement",
    component: <Placement />,
    roles: ["talent_module"],
  },
  {
    path: "/internship-approval",
    component: <InternshipApproval />,
    roles: ["spoc"],
  },
  {
    path: "/sidebar-checkbox",
    component: <CheckboxSidebar />,
    roles: ["spoc"],
  },
  {
    path: "/apsche-certificate",
    component: <Apsche />,
    roles: ["spoc"],
  },
  {
    path: "/internship-all",
    component: <LayoutInfo />,
    roles: ["spoc"],
  },
  {
    path: "/total-staff",
    component: <NewTotalInternship />,
    roles: ["staff"],
  },
  {
    path: "/student-staff",
    component: <StaffManageUser />,
    roles: ["staff"],
  },
  {
    path: "/internship-all-staff",
    component: <StaffSidebar />,
    roles: ["staff"],
  },

  {
    path: "/interactive",
    component: <InteractiveIndiaMap />,
    roles: ["spoc"],
  },
  {
    path: "/pfile",
    component: <ProfilePage />,
    roles: ["spoc"],
  },
  {
    path: "/archived",
    component: <Archived />,
    roles: ["spoc"],
  },

  {
    path: "/figma",
    component: <FigmaStyleEditor />,
    roles: ["spoc"],
  },
  {
    path: "/coming-soon",
    component: <ComingSoonPage />,
    roles: ["spoc", "dspoc", "leaders"],
  },
  {
    path: "/student-status",
    component: <StudentStatusApp />,
    roles: ["spoc"],
  },
  {
    path: "/subscription",
    component: <NewSubs />,
    roles: ["spoc", "dspoc", "leaders", "tpo"],
  },
  {
    path: "/new-report",
    component: <FilterForm />,
    roles: ["spoc"],
  },
  {
    path: "/loader",
    component: <EduSkillsLoader />,
    roles: ["spoc", "dspoc", "leaders"],
  },
  {
    path: "/multi",
    component: <AwardsAccordion />,
    roles: ["spoc", "dspoc", "leaders", "tpo"],
  },
  {
    path: "/maintenance",
    component: <MaintenancePage />,
    roles: ["spoc", "dspoc", "leaders", "tpo"],
  },

  // {
  //   path: "/award",
  //   component: <PersonalInfoForm />,
  //   roles: ["spoc", "dspoc", "leaders", "tpo"],
  // },
  {
    path: "/event",
    component: <EventDashboard />,
    roles: ["spoc"],
  },
  {
    path: "/student-step",
    component: <ProcessViewer />,
    roles: ["spoc"],
  },

  // {
  //   path: "/email-draft",
  //   component: <EmailDraft />,
  //   roles: ["spoc"],
  // },
  {
    path: "/resume",
    component: <Resume />,
    roles: ["talent_module"],
  },

  // {
  //   path: "/admin-events",
  //   component: <EventForm />,
  //   roles: ["admin"],
  // },

  {
    path: "/support",
    component: <Support />,
    roles: ["spoc", "manager", "talent_module", "educator", "admin"],
  },

  // Admin..........................................

  {
    path: "/academy",
    component: <Academy />,
    roles: ["admin"],
  },
  {
    path: "/support staff",
    component: <ITSupportStaff />,
    roles: ["admin"],
  },
  {
    path: "/supportdashboard",
    component: <SupportDashboard />,
    roles: ["admin"],
  },
  {
    path: "/getticket",
    component: <Tickets />,
    roles: ["support"],
  },
  {
    path: "/history",
    component: <StudentQuestionsHistory />,
    roles: ["support"],
  },
  {
    path: "/Token",
    component: <AdminSupportDashboard />,
    roles: ["support"],
  },
  {
    //pratyukticode three lines
    path: "/programassign",
    component: <ProgramAssign />,
    roles: ["admin"],
  },
  {
    path: "/institute",
    component: <Institute />,
    roles: ["admin", "staff"],
  },
  {
    path: "/admin-educator",
    component: <AdminEducator />,
    roles: ["admin"],
  },
  {
    path: "/admin-feedback",
    component: <FeedbackTable />,
    roles: ["admin"],
  },
  {
    path: "/staff",
    component: <AdminStaff />,
    roles: ["admin", "staff"],
  },

  // {
  //   path: "/event-details",
  //   component: <StaffEvent />,
  //   roles: ["staff"],
  // },

  // Talent Connect.................................................
  {
    path: "/applications",
    component: <ApplicationsPage />,
    roles: ["talent"],
  },
  {
    path: "/job-description",
    component: <JobDescriptionPage />,
    roles: ["talent"],
  },
  {
    path: "/job-post",
    component: <JobPostPage />,
    roles: ["talent"],
  },
  {
    path: "/company",
    component: <CompanyPage />,
    roles: ["talent"],
  },

  //.................................................

  {
    path: "/academy-program",
    component: <AcademyProgram />,
    roles: ["account_manager", "manager", "educator", "admin"],
  },
  {
    path: "/institution-status",
    component: <InstitutionStatus />,
    roles: ["spoc", "manager", "account_manager", "admin"],
  },
  {
    path: "/corporate-program",
    component: <CorporateProgram />,
    roles: ["spoc", "management"],
  },
  {
    path: "/educator",
    component: <Educator />,
    roles: ["spoc", "educator", "management", "staff"],
  },
  {
    path: "/news-events",
    component: <NewsEvents />,
    roles: ["spoc"],
  },
  {
    path: "/publication",
    component: <Publication />,
    roles: ["spoc"],
  },
  {
    path: "/awards-recognition",
    component: <AwardsRecognition />,
    roles: ["spoc"],
  },
  {
    path: "/add-student",
    component: <ManageUser />,
    roles: ["spoc", "dspoc", "leaders"],
  },
  // {
  //   path: "/vote",
  //   component: <NominationVotingSystem />,
  //   roles: ["spoc", "dspoc", "leaders"],
  // },
  {
    path: "/spocdashboard",
    component: <SpocDashboard />,
    roles: ["spoc"],
  },
  {
    path: "/job-apps",
    component: <JobsApps />,
    roles: ["spoc"],
  },
  {
    path: "/institute-profile",
    component: <InstituteProfile />,
    roles: ["spoc"],
  },
  {
    path: "/rm",
    component: <CompactRMForm />,
    roles: ["staff"],
  },
  {
    path: "/rmd",
    component: <CombinedTableDrawer />,
    roles: ["staff"],
  },

  {
    path: "/institute-profile-view",
    component: <InstituteProfileDisplay />,
    roles: ["spoc"],
  },
  {
    path: "/announcement",
    component: <AnnouncementPage />,
    roles: ["spoc"],
  },
  {
    path: "/internship-tracking",
    component: <InternshipTrackingTable />,
    roles: ["spoc"],
  },
  {
    path: "/membership-list",
    component: <MembersList />,
    roles: ["spoc"],
  },
  {
    path: "/cohort-dash",
    component: <CohortDashboard />,
    roles: ["spoc"],
  },
  {
    path: "/report-sidebar",
    component: <ReportSidebar />,
    roles: ["spoc"],
  },
  {
    path: "/ins-profile",
    component: <InstituteProfileView />,
    roles: ["spoc"],
  },

  // {
  //   path: "/membership",
  //   component: <Membership />,
  //   roles: ["manager", "management", "spoc"],
  // },
  {
    path: "/membership/agreements",
    component: <Agreements />,
    roles: ["manager", "management", "spoc", "admin"],
  },
  // {
  //   path: "/membership/payment",
  //   component: <Payment />,
  //   roles: ["manager", "management", "spoc","admin"],
  // },
  {
    path: "/membership/institutional-details",
    component: <InstitutionalProfile />,
    roles: ["manager", "management", "spoc", "admin"],
  },

  {
    path: "/talent-connect",
    component: <TalentConnectDashboard />,
    roles: ["spoc", "dspoc", "leaders"],
  },
  {
    path: "/fdp-details",
    component: <FDPDetails />,
    roles: ["spoc"],
  },
  {
    path: "/fdp-view",
    component: <FDPParticipantsView />,
    roles: ["spoc"],
  },
  {
    path: "/ticket",
    component: <TicketRaiseComponent />,
    roles: ["spoc"],
  },
  {
    path: "/admin-ticket",
    component: <AdminTicketManagement />,
    roles: ["spoc"],
  },
  {
    path: "/support-ticket",
    component: <SupportTicketManagementSystem />,
    roles: ["spoc"],
  },
  {
    path: "/notifications",
    component: <Notification />,
    roles: ["spoc", "staff", "admin"],
  },
  {
    path: "/coe",
    component: <PDFViewer />,
    roles: ["spoc"],
  },
  {
    path: "/award-management",
    component: <AwardManagementSystem />,
    roles: ["admin"],
  },
  // new item
  {
    // path: "/issue-certificates",
    // component: <IssueCertificate/>,
    path: "/certificate-manager",
    component: <CertificateManager />,
    roles: ["admin"],
  },
  // new item
  {
    path: "/certificate-canvas",
    component: <CertificateCanvas />,
    roles: ["admin"],
  },

  {
    path: "/trainer-management",
    component: <TrainerManagement />,
    roles: ["admin"],
  },
  {
    path: "/agenda-manage",
    component: <Agenda />,
    roles: ["admin"],
  },
  {
    path: "/connect-reg",
    component: <ConnectRegistrations />,
    roles: ["admin", "staff"],
  },
  {
    path: "/delete",
    component: <Deleted />,
    roles: ["spoc"],
  },
  {
    path: "/fdp",
    component: <FDPManagement />,
    roles: ["spoc"],
  },
  {
    path: "/new-sidebar",
    component: <NewSidebar />,
    roles: ["spoc"],
  },
  {
    path: "/event-connect",
    component: <EventTabsComponent />,
    roles: ["admin"],
  },
  {
    path: "/main-sidebar",
    component: <MainSidebar />,
    roles: ["spoc", "dspoc", "leaders"],
  },
  // {
  //   path: "/att",
  //   component: <AttendanceSystem />,
  //   roles: ["spoc", "dspoc", "leaders","trainer"],
  // },
  {
    path: "/tech-camp-calendar",
    component: <BookingCalendar />,
    roles: ["spoc", "dspoc", "leaders"],
  },
  {
    path: "/tech-camp-certificate",
    component: <TechCampsTable />,
    roles: ["spoc", "dspoc", "leaders"],
  },
  {
    path: "/spoc-event",
    component: <SpocEvents />,
    roles: ["spoc"],
  },
  {
    path: "/ti",
    component: <ConferenceTicketGenerator />,
    roles: ["spoc", "dspoc", "leaders"],
  },
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  {
    path: "/Domain",
    component: <DomainManagement />,
    roles: ["support"],
  },
  {
    path: "/Week",
    component: <WeekManagement />,
    roles: ["support"],
  },
  {
    path: "/Modules/:week_id",
    component: <Modules />,
    roles: ["support"],
  },
  {
    path: "/StudentPreview",
    component: <StudentPreview />,
    roles: ["support"],
  },
  {
    path: "/awards",
    component: <AwardsByCategory />,
    roles: ["spoc"],
  },
  {
    path: "/get-student",
    component: <SearchStudent />,
    roles: ["support"],
  },
  {
    path: "/student/:user_id",
    component: <StudentDashboard />,
    roles: ["support"],
  },
  {
    path: "/internship_details/:internship_id",
    component: <IntershipDetailTable />,
    roles: ["support"],
  },
  { path: "/mcalendar", component: <CalendarApp />, roles: ["trainer"] },
  {
    path: "/acalendar",
    component: <StaffTrainerAvailability />,
    roles: ["staff", "admin"],
  },
  {
    path: "/techcamp_dashboard",
    component: <TechCampDashboard />,
    roles: ["staff", "admin"],
  },
  {
    path: "/fdp_dashboard",
    component: <FdpDashboard />,
    roles: ["staff", "admin"],
  },
  {
    path: "/edp_dashboard",
    component: <EdpDashboard />,
    roles: ["staff", "admin"],
  },
  {
    path: "/att/:bookingId",
    component: <AttendanceSystem />,
    roles: ["trainer"],
  },
  {
    path: "/onboarding",
    component: <OnboardingManagement />,
    roles: ["staff", "admin"],
  },
  {
    path: "/faculty-event",
    component: <FacultyEventTable />,
    roles: ["spoc", "admin"],
  },
  {
    path: "/fdp-event",
    component: <FDPEvent />,
    roles: ["trainer"],
  },
  {
    path: "/techcamp-event",
    component: <TechCamp />,
    roles: ["trainer"],
  },
  {
    path: "/edp-event",
    component: <EDPBookCalendar />,
    roles: ["trainer"],
  },
];

const publicRoutes = [
  // { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  // { path: "/", exact: true },
  // { path: "/mcalendar", component: <CalendarApp /> },
  { path: "/scalendar", component: <StaffTrainerAvailability /> },
  { path: "/atts", component: <EventFeedbackForm /> },
  // {
  //   path: "/att/:bookingId",
  //   component: <AttendanceSystem />,
  // },
  // { path: "/admin/feedback", component: <FeedbackTables /> },

  //  { path: "/award-management", component: <AwardManagementSystem /> },
  {
    path: "e344rtyuty6/rt576/:leaderId/:categoryId",
    component: <MainCorporate />,
  },
  { path: "/tpoaward", component: <PlacementMultiStepForm /> },
  { path: "/winner", component: <WinnerBanner /> },
  { path: "/badge", component: <BadgeCard /> },
  { path: "/qr", component: <EventQRPlanner /> },
  { path: "/formbuilder", component: <FormBuilder /> },
  { path: "/award/e3454-345", component: <PersonalInfoForm /> },
  // { path: "/vote", component: <NominationVotingSystem /> },
  { path: "/page-not-found", component: <PageNotFound /> },
  { path: "/guide", component: <KnowledgeHubPage /> },
  { path: "/voting", component: <MainVotingApp /> },
  {
    path: "*",
    component: (
      <ExternalRedirect url="https://eduskillsfoundation.org/login/" />
    ),
  },
];

// const publicRoutes = [
//    { path: "/login", component: <TailLogin /> },
//   // { path: "/interactive", component: <InteractiveIndiaMap /> },
//   { path: "/page-not-found", component: <PageNotFound /> },
//   { path: "*", component: <Navigate to="/page-not-found" /> },
// ];

export { authProtectedRoutes, publicRoutes, authProtected };
