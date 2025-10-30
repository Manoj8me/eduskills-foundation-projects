// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Drawer,
//   IconButton,
//   Chip,
//   Rating,
//   Card,
//   CardContent,
//   Grid,
//   InputBase,
//   Button,
//   Divider,
//   Stack,
//   Container,
//   Avatar,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import CloseIcon from "@mui/icons-material/Close";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import { motion, AnimatePresence } from "framer-motion";

// // Add custom CSS style to the component to fix drawer animation
// const styleSheet = document.createElement("style");
// styleSheet.type = "text/css";
// styleSheet.innerText = `
//   .MuiDrawer-root.MuiDrawer-modal {
//     z-index: 1400 !important; 
//   }
//   .MuiBackdrop-root {
//     background-color: rgba(0, 0, 0, 0.5);
//     z-index: 1300 !important;
//   }
//   .drawer-content-wrapper {
//     width: 100%;
//     height: 100%;
//     background-color: white;
//     overflow-y: auto;
//     overflow-x: hidden;
//     position: relative;
//     z-index: 1500 !important;
//   }
// `;
// document.head.appendChild(styleSheet);


// // Job Details Drawer Component
// const JobDetailsDrawer = ({ open, job, onClose }) => {
//   if (!job) return null;

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onClose}
//       sx={{
//         position: "fixed",
//         zIndex: 1300, // Higher than any other element
//         "& .MuiBackdrop-root": {
//           zIndex: 1299, // Just below the drawer
//         },
//         "& .MuiDrawer-paper": {
//           width: "100%",
//           maxWidth: 550,
//           p: 0,
//           boxSizing: "border-box",
//           zIndex: 1300, // Same as drawer container
//         },
//       }}
//     >
//       <Box sx={{ position: "relative", p: 4 }}>
//         <IconButton
//           onClick={onClose}
//           sx={{
//             position: "absolute",
//             top: 16,
//             right: 16,
//             color: "text.secondary",
//             "&:hover": {
//               color: "primary.main",
//               backgroundColor: "rgba(25, 118, 210, 0.08)",
//             },
//           }}
//         >
//           <CloseIcon />
//         </IconButton>

//         <Box display="flex" alignItems="center" mb={3}>
//           <Avatar
//             sx={{
//               width: 60,
//               height: 60,
//               borderRadius: 2,
//               mr: 3,
//               // Replace gradient with solid colors to avoid z-index issues
//               backgroundColor: job.id % 2 === 0 ? "#FF7043" : "#2196F3",
//               fontWeight: "bold",
//               fontSize: "1.5rem",
//             }}
//           >
//             {job.companyInitial}
//           </Avatar>
//           <Box>
//             <Typography variant="h5" fontWeight="700" gutterBottom>
//               {job.title}
//             </Typography>
//             <Box display="flex" alignItems="center">
//               <LocationOnIcon
//                 sx={{ fontSize: 18, color: "text.secondary", mr: 0.5 }}
//               />
//               <Typography variant="body2" color="text.secondary">
//                 {job.location}
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
//                 • Posted {job.postedTime}
//               </Typography>
//             </Box>
//           </Box>
//         </Box>

//         <Paper
//           elevation={0}
//           sx={{
//             p: 3,
//             mb: 4,
//             borderRadius: 2,
//             backgroundColor: "rgba(25, 118, 210, 0.04)",
//           }}
//         >
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={4}>
//               <Typography variant="body2" color="text.secondary" gutterBottom>
//                 Hourly Rate
//               </Typography>
//               <Typography variant="body1" fontWeight="600">
//                 ${job.hourlyMin} - ${job.hourlyMax}/hr
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <Typography variant="body2" color="text.secondary" gutterBottom>
//                 Location
//               </Typography>
//               <Typography variant="body1" fontWeight="600">
//                 Remote {job.remoteFriendly}
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <Typography variant="body2" color="text.secondary" gutterBottom>
//                 Duration
//               </Typography>
//               <Typography variant="body1" fontWeight="600">
//                 {job.duration}
//               </Typography>
//             </Grid>
//           </Grid>
//         </Paper>

//         <Typography variant="h6" fontWeight="700" mb={2}>
//           About the job
//         </Typography>

//         <Typography
//           variant="body1"
//           color="text.secondary"
//           sx={{ mb: 4, lineHeight: 1.7 }}
//         >
//           {job.description}
//           {job.fullDescription && (
//             <>
//               <br />
//               <br />
//               {job.fullDescription}
//             </>
//           )}
//         </Typography>

//         {job.requiredExperience && (
//           <>
//             <Typography variant="h6" fontWeight="700" mb={2}>
//               Required Experience
//             </Typography>

//             <Box mb={4}>
//               {job.requiredExperience.map((exp, index) => (
//                 <Box
//                   key={index}
//                   display="flex"
//                   alignItems="flex-start"
//                   mb={2}
//                   sx={{
//                     "&:last-child": {
//                       mb: 0,
//                     },
//                   }}
//                 >
//                   <CheckCircleIcon
//                     color="primary"
//                     sx={{
//                       fontSize: 20,
//                       mr: 1.5,
//                       mt: 0.5,
//                     }}
//                   />
//                   <Typography variant="body1">{exp}</Typography>
//                 </Box>
//               ))}
//             </Box>
//           </>
//         )}

//         <Typography variant="h6" fontWeight="700" mb={2}>
//           Skills and Expertise
//         </Typography>

//         <Box display="flex" flexWrap="wrap" gap={1.5} mb={4}>
//           {job.skills.map((skill, index) => (
//             <Chip
//               key={index}
//               label={skill}
//               sx={{
//                 backgroundColor: "rgba(25, 118, 210, 0.08)",
//                 color: "primary.dark",
//                 borderRadius: 1,
//                 fontWeight: 500,
//                 py: 0.5,
//               }}
//             />
//           ))}
//         </Box>

//         <Divider sx={{ my: 4 }} />

//         <Typography variant="h6" fontWeight="700" mb={2}>
//           About the client
//         </Typography>

//         <Box display="flex" alignItems="center" mb={2}>
//           {job.paymentVerified && (
//             <Box display="flex" alignItems="center" mr={3}>
//               <Typography
//                 variant="body2"
//                 color="primary"
//                 sx={{ mr: 0.5, fontWeight: 500 }}
//               >
//                 Payment Verified
//               </Typography>
//               <CheckCircleIcon color="primary" sx={{ fontSize: 18 }} />
//             </Box>
//           )}
//           <Rating value={job.rating} readOnly precision={0.5} />
//           <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
//             ({job.rating})
//           </Typography>
//         </Box>

//         <Button
//           variant="contained"
//           fullWidth
//           disableElevation
//           sx={{
//             mt: 4,
//             py: 1.5,
//             borderRadius: 2,
//             textTransform: "none",
//             fontWeight: 600,
//             fontSize: "1rem",
//             backgroundColor: "#2196F3",
//             "&:hover": {
//               backgroundColor: "#1976D2",
//             },
//           }}
//           onClick={onClose}
//         >
//           View More Jobs
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// // Main App Component
// const JobListingApp = () => {
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // Simulate loading
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 800);

//     return () => clearTimeout(timer);
//   }, []);

//   // Remove custom styles that might be causing z-index issues
//   useEffect(() => {
//     // Find and remove any style elements that might be causing issues
//     const styleElements = document.head.querySelectorAll("style");
//     styleElements.forEach((element) => {
//       if (
//         element.innerText.includes("z-index") &&
//         element.innerText.includes("MuiDrawer")
//       ) {
//         element.remove();
//       }
//     });
//   }, []);

//   const handleJobClick = (job) => {
//     setSelectedJob(job);
//     setDrawerOpen(true);
//   };

//   const handleCloseDrawer = () => {
//     setDrawerOpen(false);
//   };

//   // Sample job data
//   const jobs = [
//     {
//       id: 1,
//       companyInitial: "A",
//       title: "Create Figma Designs for Web Application",
//       postedTime: "2 hours ago",
//       hourlyMin: 100,
//       hourlyMax: 400,
//       remoteFriendly: "Friendly",
//       estTime: "1d+",
//       duration: "1 to 3 months",
//       description:
//         "Looking for an experienced UI/UX designer for an ongoing project. You will work with an existing SCRUM team for this project. The SCRUM team is comprised of consultants in EU and Asia, working on a bespoke software development project.",
//       fullDescription:
//         "We are rapidly growing and need a designer to create UI/UX designs for a new web application that differentiates between environments (test vs. prod). Your first task will be to create a design for a new web application that differentiates environments (test vs. prod).",
//       requiredExperience: [
//         "Figma - and using it 'the right way'",
//         "Designing with design systems and design languages",
//         "Designing for modern web and app development, including progressive and responsive designs",
//         "Develop final designs from conceptual mockups and wireframes",
//       ],
//       skills: [
//         "User Interface Design",
//         "Figma",
//         "Wireframing",
//         "User Experience",
//         "Styleguide",
//         "Prototyping",
//       ],
//       paymentVerified: true,
//       rating: 4.5,
//       location: "New York, Manhattan",
//     },
//     {
//       id: 2,
//       companyInitial: "B",
//       title: "Looking for a Graphic Designer",
//       postedTime: "2 hours ago",
//       hourlyMin: 200,
//       hourlyMax: 800,
//       remoteFriendly: "Friendly",
//       estTime: "Est. Time: 1 to 3 months",
//       duration: "Less than 30 hrs/week",
//       description:
//         "We are a direct-to-consumer sales company looking to improve and optimize our checkout experience. We need a designer to develop variations of flows that optimize conversion and retention.",
//       skills: [
//         "User Interface",
//         "User Experience",
//         "Web Design",
//         "Human-Centered Design",
//         "Figma",
//         "Wireframing",
//       ],
//       paymentVerified: true,
//       rating: 5,
//       location: "New York, Manhattan",
//     },
//     {
//       id: 3,
//       companyInitial: "C",
//       title: "UI/UX Designer for Mobile App",
//       postedTime: "3 hours ago",
//       hourlyMin: 150,
//       hourlyMax: 500,
//       remoteFriendly: "Friendly",
//       estTime: "1d+",
//       duration: "3 to 6 months",
//       description:
//         "Looking for a talented UI/UX designer to redesign our mobile application with focus on user engagement and retention. Experience with mobile design patterns is essential.",
//       skills: [
//         "Mobile Design",
//         "UI/UX",
//         "Figma",
//         "Prototyping",
//         "User Research",
//         "App Design",
//       ],
//       paymentVerified: true,
//       rating: 4,
//       location: "San Francisco, CA",
//     },
//   ];

//   // Updated JobListing component with fixed z-index and gradient issues
//   const JobListing = ({ job, onClick }) => {
//     return (
//       <Card
//         sx={{
//           mb: 3,
//           cursor: "pointer",
//           boxShadow: "0px 2px 10px rgba(0,0,0,0.08)",
//           borderRadius: 2,
//           position: "relative", // Add relative positioning
//           zIndex: 1, // Lower z-index than drawer
//         }}
//         onClick={() => onClick(job)}
//       >
//         <CardContent sx={{ p: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={9}>
//               <Box display="flex" alignItems="flex-start">
//                 <Avatar
//                   sx={{
//                     width: 50,
//                     height: 50,
//                     borderRadius: 1.5,
//                     mr: 2.5,
//                     // Replace gradient with solid colors
//                     backgroundColor: job.id % 2 === 0 ? "#FF7043" : "#2196F3",
//                     fontWeight: "bold",
//                     fontSize: "1.2rem",
//                   }}
//                 >
//                   {job.companyInitial}
//                 </Avatar>
//                 <Box>
//                   <Typography variant="h6" fontWeight="600" gutterBottom>
//                     {job.title}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ mb: 1.5 }}
//                   >
//                     Posted {job.postedTime} • {job.duration}
//                   </Typography>

//                   <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         fontWeight: 500,
//                         color: "primary.main",
//                       }}
//                     >
//                       ${job.hourlyMin} - ${job.hourlyMax}/hr
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Remote {job.remoteFriendly}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Est. Time: {job.estTime}
//                     </Typography>
//                   </Stack>

//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ mb: 2.5, lineHeight: 1.6 }}
//                   >
//                     {job.description}
//                   </Typography>

//                   <Box display="flex" flexWrap="wrap" gap={1}>
//                     {job.skills.map((skill, index) => (
//                       <Chip
//                         key={index}
//                         label={skill}
//                         size="small"
//                         sx={{
//                           backgroundColor: "rgba(25, 118, 210, 0.08)",
//                           color: "primary.dark",
//                           borderRadius: 1,
//                           fontWeight: 500,
//                           fontSize: "0.75rem",
//                         }}
//                       />
//                     ))}
//                   </Box>
//                 </Box>
//               </Box>
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <Box
//                 display="flex"
//                 flexDirection="column"
//                 alignItems="flex-end"
//                 height="100%"
//                 justifyContent="space-between"
//               >
//                 <IconButton
//                   size="small"
//                   sx={{
//                     color: "text.secondary",
//                     "&:hover": {
//                       color: "primary.main",
//                     },
//                   }}
//                 >
//                   <BookmarkBorderIcon fontSize="small" />
//                 </IconButton>

//                 <Box
//                   display="flex"
//                   flexDirection="column"
//                   alignItems="flex-end"
//                   mt={2}
//                 >
//                   {job.paymentVerified && (
//                     <Box display="flex" alignItems="center" mb={1.5}>
//                       <Typography
//                         variant="body2"
//                         color="primary"
//                         sx={{ mr: 0.5, fontSize: "0.75rem", fontWeight: 500 }}
//                       >
//                         Payment Verified
//                       </Typography>
//                       <CheckCircleIcon color="primary" sx={{ fontSize: 16 }} />
//                     </Box>
//                   )}

//                   <Rating
//                     value={job.rating}
//                     readOnly
//                     size="small"
//                     precision={0.5}
//                     sx={{ mb: 1 }}
//                   />

//                   <Box display="flex" alignItems="center">
//                     <LocationOnIcon
//                       sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }}
//                     />
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       sx={{ fontSize: "0.75rem" }}
//                     >
//                       {job.location}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Box>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>
//     );
//   };

//   return (
//     <>
//       <Container maxWidth="md" sx={{ py: 4, position: "relative", zIndex: 1 }}>
//         {/* Search Bar */}
//         <Paper
//           elevation={0}
//           sx={{
//             p: "4px 16px",
//             display: "flex",
//             alignItems: "center",
//             mb: 4,
//             border: "1px solid #e0e0e0",
//             borderRadius: 2,
//             height: 56,
//             overflow: "hidden",
//             position: "relative",
//             zIndex: 1,
//           }}
//         >
//           <InputBase
//             sx={{ ml: 1, flex: 1, fontSize: "0.95rem" }}
//             placeholder="Search by Title, Company or any Jobs keyword..."
//           />
//           <Button
//             variant="contained"
//             disableElevation
//             sx={{
//               borderRadius: 1.5,
//               backgroundColor: "#2196F3",
//               textTransform: "none",
//               px: 3,
//               py: 1,
//               fontWeight: 600,
//               "&:hover": {
//                 backgroundColor: "#1976D2",
//               },
//             }}
//             startIcon={<SearchIcon />}
//           >
//             Find Jobs
//           </Button>
//         </Paper>

//         {/* Job Listings */}
//         <Box>
//           {isLoading
//             ? // Loading placeholders
//               [1, 2, 3].map((_, index) => (
//                 <Paper
//                   key={index}
//                   sx={{
//                     mb: 3,
//                     height: 180,
//                     borderRadius: 2,
//                     backgroundColor: "#f5f5f5",
//                   }}
//                 />
//               ))
//             : jobs.map((job) => (
//                 <JobListing key={job.id} job={job} onClick={handleJobClick} />
//               ))}
//         </Box>
//       </Container>

//       {/* Job Details Drawer */}
//       <JobDetailsDrawer
//         open={drawerOpen}
//         job={selectedJob}
//         onClose={handleCloseDrawer}
//       />
//     </>
//   );
// };

// export default JobListingApp;
