import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { blue } from "@mui/material/colors";

const AcademicDetailsTable = () => {
  const rows = [
    {
      id: 213,
      name: "Abby Buckley",
      gender: "Female",
      grade: "Grade 5",
      marks: "88.40%",
      gpa: 3.7,
      participation: "80.00%",
      absent: 2,
      attendance: "93.33%",
    },
    {
      id: 279,
      name: "Abigail Pineda",
      gender: "Female",
      grade: "Grade 2",
      marks: "69.40%",
      gpa: 2.0,
      participation: "80.00%",
      absent: 2,
      attendance: "93.33%",
    },
    {
      id: 236,
      name: "Ada Ochoa",
      gender: "Female",
      grade: "Grade 1",
      marks: "87.60%",
      gpa: 3.7,
      participation: "80.00%",
      absent: 3,
      attendance: "90.00%",
    },
    {
      id: 59,
      name: "Aida Bailey",
      gender: "Female",
      grade: "Grade 2",
      marks: "90.00%",
      gpa: 4.0,
      participation: "100.00%",
      absent: 0,
      attendance: "100.00%",
    },
    {
      id: 167,
      name: "Alba Andrews",
      gender: "Female",
      grade: "Grade 5",
      marks: "94.00%",
      gpa: 4.0,
      participation: "100.00%",
      absent: 0,
      attendance: "100.00%",
    },
    {
      id: 25,
      name: "Alexandra Perkins",
      gender: "Female",
      grade: "Grade 3",
      marks: "78.00%",
      gpa: 2.7,
      participation: "80.00%",
      absent: 2,
      attendance: "93.33%",
    },
    // Add more rows as needed
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(rows[0]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const student = rows.find((row) => row.name.toLowerCase().includes(query));
    setSelectedStudent(student || rows[0]);
  };

  return (
    <Card>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h6" component="div">
              Academic Details of Student
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              label="Search by Name"
              variant="outlined"
              size="small"
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: "auto", minWidth: 200,mb: 2 }}
            />
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: blue[500], color: "white" }}>
                  Student ID
                </TableCell>
                <TableCell sx={{ backgroundColor: blue[500], color: "white" }}>
                  Student Name
                </TableCell>
                <TableCell sx={{ backgroundColor: blue[500], color: "white" }}>
                  Gender
                </TableCell>
                <TableCell sx={{ backgroundColor: blue[500], color: "white" }}>
                  Grade Name
                </TableCell>
                <TableCell sx={{ backgroundColor: blue[500], color: "white" }}>
                  Average Marks
                </TableCell>
                <TableCell sx={{ backgroundColor: blue[500], color: "white" }}>
                  GPA
                </TableCell>
                <TableCell sx={{ backgroundColor: blue[500], color: "white" }}>
                  Class Participation Rate
                </TableCell>
                <TableCell sx={{ backgroundColor: blue[500], color: "white" }}>
                  Days Absent
                </TableCell>
                <TableCell sx={{ backgroundColor: blue[500], color: "white" }}>
                  Attendance Rate
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={selectedStudent.id}>
                <TableCell>{selectedStudent.id}</TableCell>
                <TableCell>{selectedStudent.name}</TableCell>
                <TableCell>{selectedStudent.gender}</TableCell>
                <TableCell>{selectedStudent.grade}</TableCell>
                <TableCell>{selectedStudent.marks}</TableCell>
                <TableCell>{selectedStudent.gpa}</TableCell>
                <TableCell>{selectedStudent.participation}</TableCell>
                <TableCell>{selectedStudent.absent}</TableCell>
                <TableCell>{selectedStudent.attendance}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default AcademicDetailsTable;
