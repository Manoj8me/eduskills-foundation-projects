// import React from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { Button, Container, Grid, TableCell, Typography,useTheme } from "@mui/material";
// import Widgets from "./Widgets";
// // import { useState } from "react";
// // import Invoice from "./Invoice";
// import { Helmet } from "react-helmet-async";
// import { tokens } from "../../../theme";

// function Payments() {
//   // const [active, setActive] = useState(null); // Define state here
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const handleInvoice = (id) => {
//     // setActive(id);
//     console.log(id)
//   };

//   const columns = [
//     { field: "id", headerName: "Sl.No", width: 100 },
//     { field: "invoiceType", headerName: "Invoice Description", width: 200 },
//     { field: "paymentDate", headerName: "Payment Date", width: 150 },
//     { field: "renewalDate", headerName: "Renewal Date", width: 150 },
//     {
//       field: "status",
//       headerName: "Status",
//       width: 150,
//       renderCell: (params) => {
//         const status = params.row.status;
//         return (
//           <TableCell
//             style={{
//               padding: "2px 10px",
//               borderRadius: "10px",
//               color: status === "active" ? "white" : "gray",
//               backgroundColor: status === "active" ? "green" : "lightgray",
//             }}
//           >
//             {status}
//           </TableCell>
//         );
//       },
//     },
//     {
//       field: "Action",
//       headerName: "Action",
//       width: 190,
//       headerAlign: "center",
//       renderHeader: (params) => (
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontWeight: 500,
//           }}
//         >
//           {params.field}
//         </div>
//       ),
//       renderCell: (params) => {
//         const status = params.row.status;

//         return (
//           <TableCell>
//             {status === "deactivate" ? (
//               <Button size="small" variant="contained" color="info">
//                 Pay
//               </Button>
//             ) : (
//               <Button size="small" variant="contained" disabled>
//                 Pay
//               </Button>
//             )}
//             {
//               <Button
//                 size="small"
//                 variant="contained"
//                 color="inherit"
//                 sx={{ ml: 1 }}
//                 onClick={() => handleInvoice(params.row.id)}
//               >
//                 View
//               </Button>
//             }
//           </TableCell>
//         );
//       },
//     },
//   ];

//   const rows = [
//     {
//       id: 1,
//       invoiceType: "Proforma Invoice",
//       paymentDate: "08 Sep 2023",
//       renewalDate: "20 Nov 2023",
//       status: "active",
//     },
//     {
//       id: 2,
//       invoiceType: "Tax Invoice",
//       paymentDate: "14 Jan 2023",
//       renewalDate: "18 Sep 2023",
//       status: "deactivate",
//     },
//     {
//       id: 3,
//       invoiceType: "Proforma Invoice",
//       paymentDate: "15 Sep 2023",
//       renewalDate: "11 Dec 2023",
//       status: "active",
//     },
//   ];

//   return (
//     <Container sx={{ my: 2 }}>
//       <Helmet>
//         <title> Payments | EduSkills </title>
//       </Helmet>
//       <Typography
//         variant="h5"
//         sx={{ mb: 2, fontWeight: "bold", color: colors.blueAccent[300] }}
//       >
//         Welcome back to Payments !
//       </Typography>
//       <Widgets />
//       <Grid container spacing={1} my={2}>
//         <Grid item xs={12}>
//           <DataGrid
//             rows={rows}
//             columns={columns}
//             disableSelectionOnClick
//             disableColumnMenu
//           />
//         </Grid>
//       </Grid>
//     </Container>
//   );
// }
// // {
// //   active > 0 && <Invoice setActive={setActive} />;
// // }

// export default Payments;
