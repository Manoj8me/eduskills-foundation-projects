import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import InternshipSection from "../../components/dashboard/InternshipSection";
import TotalSection from "../../components/dashboard/TotalSection";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchInstituteState,
  fetchMembershipPackage,
} from "../../store/Slices/dashboard/statepackageSlice";
import AdminTotalSection from "../../components/dashboard/AdminTotalSection";
import StaffDashboard from "../../components/StaffSection/Dashboard";
import TalentConnectDashboard from "../../components/TalentConnect/Dashboard";
import MembershipCard from "../../components/dashboard/InternshipSection/MembershipCard";
import ComingSoonPage from "../../components/comingsoon/ComingSoon";
import DashboardCountsPage from "../SupportDashboard/DashboardCounts";

export default function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const userRole = useSelector((state) => state.authorise.userRole);
  const dispatch = useDispatch();

  return (
    <>
      <Helmet>
        <title> Dashboard | EduSkills </title>
      </Helmet>

      <Container maxWidth="xl" sx={{ my: 2 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: colors.blueAccent[300] }}
        >
          {/* {userRole === "admin"
            ? "Hi Admin, welcome back to EduSkills!"
            : userRole === "staff"
            ? "Hi Staff, welcome back to EduSkills!"
            : userRole === "talent"
            ? "Hi, welcome back to EduSkills Talent Connect!"
            : "Hi, Welcome back to EduSkills!"} */}
        </Typography>
        {userRole === "admin" ? (
          <AdminTotalSection />
        ) : userRole === "staff" ? (
          <>
            <StaffDashboard />
          </>
        ) : userRole === "spoc" ? (
          <>
            {/* <TotalSection /> */}
            {/* <MembershipCard /> */}
            <InternshipSection />
          </>
        ) : userRole === "dspoc" ? (
          <>
            <InternshipSection />
          </>
        ) : userRole === "leaders" ? (
          <>
            <InternshipSection />
          </>
        ) : userRole === "tpo" ? (
          <>
            <InternshipSection />
          </>
        ) : userRole === "trainer" ? (
          <>
            <ComingSoonPage />
          </>
        ) : userRole === "support" ? (
          <DashboardCountsPage />
        ) : userRole === "talent" ? (
          <TalentConnectDashboard />
        ) : null}
      </Container>
    </>
  );
}
