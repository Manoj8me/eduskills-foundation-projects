import { ArrowBack, Print, Share } from "@mui/icons-material";
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Box,
  IconButton,
} from "@mui/material";
import React from "react";
import Logo from "../../../assets/imgs/logo-dark.svg";

const Invoice = ({ setActive }) => {
  return (
    <Box component={Paper}>
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
        <IconButton onClick={() => setActive(null)}>
          <ArrowBack />
        </IconButton>
        <Box>
          <IconButton>
            <Share />
          </IconButton>
          <IconButton>
            <Print />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <img src={Logo} alt="Eduskills" style={{ maxHeight: 60 }} />
          <Typography variant="h3" color="#1B7CB3">
            Proforma Invoice
          </Typography>
        </Box>
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            {/* Logo goes here */}
            <Typography variant="h6">EduSkills Foundation</Typography>
            <Typography variant="body2">
              #806, DLF Cyber City, Tech Park
            </Typography>
            <Typography variant="body2">
              Bhubaneswar, Odiaha-751024, India
            </Typography>
            <Typography variant="body2">GSTIN:- 21AABTE0262F1ZG</Typography>
            <Typography variant="body2">PAN:- AABTE0262F</Typography>
          </Box>
          <Box>
            <Typography variant="h6">Quote No: ESF/1280</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" , mt:5, mb:2 }}>
          <Box>
            {/* Logo goes here */}
            <Typography variant="body2">Bill To</Typography>
            <Typography variant="h6">
              Avanthi Institute of Engineering & Technology (Vizianagaram)
            </Typography>
            <Typography variant="body2">
            Cherukupally (P),Bhogapuram (M), Near Tagarapuvalasa, NH16,
            </Typography>
            <Typography variant="body2">Kotabhogapuram- 535006 Andhra Pradesh, India</Typography>
            <Typography variant="body2">PAN:- AABTE0262F</Typography>
          </Box>
          <Box>
            <Typography variant='body2'>Date: 04 Jun 2023 </Typography>
            {/* <Typography variant="body2">Bill To</Typography>
            <Typography variant="body2">Date: 18-Oct-2023</Typography> */}
          </Box>
        </Box >

        <TableContainer component={Box}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sl. No</TableCell>
                <TableCell>Item & Description</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>IGST</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Add rows for items here */}
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>Item 1</TableCell>
                <TableCell>Unit 1</TableCell>
                <TableCell>100.00</TableCell>
                <TableCell>10%</TableCell>
                <TableCell>18%</TableCell>
                <TableCell>90.00</TableCell>
              </TableRow>
              {/* Add more rows as needed */}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <Box>
            <Typography variant="body2">Subtotal: 100.00</Typography>
            <Typography variant="body2">IGST (18%): 18.00</Typography>
            <Typography variant="h6">Total: 118.00</Typography>
          </Box>
        </Box>

        <Box style={{ marginTop: "5rem" }}>
          {/* Bank account details */}
          <Typography variant="body2">
            Bank Account Details: Account Name - XXX,
          </Typography>
          <Typography variant="body2">Account Number - XXXXXXX</Typography>
          <Typography variant="body2">Bank Name - XXX Bank</Typography>
        </Box>

        <Box style={{ marginTop: "1rem" }}>
          <Typography variant="body2">
            This is a computer-generated proforma Invoice. No signature is
            required.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Invoice;
