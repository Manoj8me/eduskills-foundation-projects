import React from "react";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Grid,
  Paper,
  useTheme,
  Button,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { QRCodeSVG } from "qrcode.react";

const PrintableResume = ({ data, userId }) => {
  const theme = useTheme();

  

  const colors = {
    primary: "#263238",
    secondary: "#546e7a",
    accent: "#0E619F",
    background: "#ffff",
    white: "#ffff",
  };

  const headerBackground = {
    background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
    color: colors.white,
    borderRadius: "5px 5px 0 0",
    padding: theme.spacing(2),
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };
  const formatYear = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { year: "numeric" });
  };

  const handlePrint = () => {
    const printContent = document.getElementById("resume-content");
    const originalContents = document.body.innerHTML;

    const style = document.createElement("style");
    style.innerHTML = `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        html, body {
          height: 100vh;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const qrCodeValue = userId
    ? `http://ec2-15-206-231-196.ap-south-1.compute.amazonaws.com/api/v1/talent/connect/user_details/${userId}`
    : "default-qr-value";

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper
        id="resume-content"
        elevation={6}
        sx={{
          bgcolor: colors.background,
          pb: 2,
          width: "210mm",
          minHeight: "297mm",
          position: "relative",
          margin: "0 auto",
          "@media print": {
            margin: 0,
            borderRadius: 0,
            boxShadow: "none",
            width: "210mm",
            height: "297mm",
          },
        }}
      >
        <Box sx={headerBackground}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                  src={data?.profile?.profile_pic}
                  sx={{ width: 100, height: 100 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {data?.profile?.name}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Icon icon="el:phone-alt" style={{ fontSize: "1.25rem" }} />
                  {data?.profile?.phone}
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Icon icon="mi:email" style={{ fontSize: "1.25rem" }} />
                  {data?.profile?.email}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {data?.objective?.length > 0 && (
          <>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                color: colors.white,
                mx: 3,
                mt: 2,
                px: 2,
                py: 0.5,
                borderRadius: 1,
                bgcolor: colors.accent,
              }}
            >
              Objective
            </Typography>
            <Box sx={{ mx: 5, borderRadius: 2, mb: 3 }}>
              <Typography variant="body1" sx={{ color: colors.primary }}>
                {data?.objective}
              </Typography>
            </Box>
          </>
        )}

        {data?.education?.length > 0 && (
          <>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                color: colors.white,
                mx: 3,
                mt: 1,
                px: 2,
                py: 0.5,
                borderRadius: 1,
                bgcolor: colors.accent,
              }}
            >
              Education
            </Typography>
            {data?.education?.map((edu, index) => (
              <Box key={index} sx={{ mx: 5, borderRadius: 2, mb: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.primary,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Icon
                      icon="lucide:school"
                      style={{ fontSize: "1.25rem" }}
                    />
                    {`${edu.degree} from ${edu.school}`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.secondary }}>
                    {`${edu?.percentage}% - ${formatYear(edu?.passoutYear)}`}
                  </Typography>
                </Box>
              </Box>
            ))}
          </>
        )}

        {data?.skills?.length > 0 && (
          <>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                color: colors.white,
                mx: 3,
                px: 2,
                mt: 1.5,
                py: 0.5,
                borderRadius: 1,
                bgcolor: colors.accent,
              }}
            >
              Skills
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                ml: 3,
                mb: 3,
                mx: 5,
              }}
            >
              {data?.skills?.map((skill, index) => (
                <Box
                  key={index}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    fontSize: 10,
                    bgcolor: "#72C3FF",
                    borderRadius: "5px",
                  }}
                >
                  {skill}
                </Box>
              ))}
            </Box>
          </>
        )}

        {data?.internship?.length > 0 && (
          <>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                color: colors.white,
                mx: 3,
                px: 2,
                py: 0.5,
                borderRadius: 1,
                bgcolor: colors.accent,
              }}
            >
              Experience
            </Typography>
            {data?.internship?.slice(0, 1).map((intern, index) => (
              <Box
                key={index}
                sx={{ mb: 1, mx: 3, mt: 1, borderRadius: 2, px: 2, pb: 1 }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.primary,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Icon icon="pajamas:work" style={{ fontSize: "1.25rem" }} />
                    {`${intern?.jobTitle} at ${intern?.companyName}`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.secondary }}>
                    {`${intern?.location} (${formatDate(
                      intern?.fromDate
                    )} to ${formatDate(intern?.toDate)})`}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }} color="black">
                  {intern?.roleDescription}
                </Typography>
              </Box>
            ))}
          </>
        )}

        {data?.projects?.length > 0 && (
          <>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                color: colors.white,
                mx: 3,
                px: 2,
                py: 0.5,
                borderRadius: 1,
                bgcolor: colors.accent,
              }}
            >
              Projects
            </Typography>
            {data?.projects?.map((project, index) => (
              <Box
                key={index}
                sx={{ mb: 1, mx: 3, borderRadius: 2, px: 2, pb: 1 }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.primary,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Icon
                      icon="clarity:tasks-solid"
                      style={{ fontSize: "1.25rem" }}
                    />
                    {project?.projectTitle}
                  </Typography>
                </Box>
                <Typography sx={{ mt: 1 }} variant="body2" color="black">
                  {project?.projectDescription}
                </Typography>
              </Box>
            ))}
          </>
        )}

        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            right: 30,
            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              mt: 1,
              mb: 1,
              color: colors.secondary,
            }}
          >
            {/* Barcode for 30 days validity provider EduSkills Foundation */}
          </Typography>
          <QRCodeSVG value={qrCodeValue} size={64} />
        </Box>
      </Paper>

      <Button
        variant="contained"
        color="primary"
        onClick={handlePrint}
        sx={{ mt: 2, display: "block", margin: "20px auto" }}
      >
        Print Resume
      </Button>
    </Container>
  );
};

export default PrintableResume;
