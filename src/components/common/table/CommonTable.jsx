// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   Pagination,
//   Table,
//   TableContainer,
//   TableBody,
//   useTheme,
//   Typography,
//   CircularProgress,
//   TableRow,
//   TableCell,
//   Stack,
// } from "@mui/material";
// import UserListToolbar from "../user/UserListToolbar";
// import TogglePage from "../toggleButton/togglePage";
// import { tokens } from "../../../theme";
// import { UserListHead } from "../user";

// const dummyData = [
//   {
//     id: 1,
//     name: "John Doe",
//     age: 25,
//     email: "john@example.com",
//     status: "Active",
//   },
//   {
//     id: 2,
//     name: "Jane Doe",
//     age: 28,
//     email: "jane@example.com",
//     status: "Inactive",
//   },
//   {
//     id: 3,
//     name: "Alice Smith",
//     age: 22,
//     email: "alice@example.com",
//     status: "Active",
//   },
//   {
//     id: 4,
//     name: "Bob Johnson",
//     age: 30,
//     email: "bob@example.com",
//     status: "Inactive",
//   },
//   {
//     id: 5,
//     name: "Eve Williams",
//     age: 26,
//     email: "eve@example.com",
//     status: "Active",
//   },
// ];

// const CommonTable = ({
//   TABLE_HEAD = [],
//   tableData = dummyData || [],
//   setRowsPerPage,
//   rowsPerPage = 10,
//   count = 5,
//   page = 1,
//   setPage,
//   setRefresh,
//   tableLoading,
//   exportData = [],
// }) => {
//   const [orderBy, setOrderBy] = useState("name");
//   const [order, setOrder] = useState("asc");
//   const [filterName, setFilterName] = useState("");
//   const [oldPage, setOldPage] = useState(0);
//   const [selected, setSelected] = useState([]);
//   const [isAllChecked, setIsAllChecked] = useState(true);

//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   const handleRequestSort = (event, property) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   const handleFilterByName = (event) => {
//     setOldPage(0);
//     setFilterName(event.target.value);
//   };

//   const emptyRows =
//     oldPage > 0
//       ? Math.max(0, (1 + oldPage) * rowsPerPage - tableData?.length)
//       : 0;

//   const dynamicTableHead =
//     TABLE_HEAD || (tableData[0] ? Object.keys(tableData[0]) : []);

//   const filteredUsers = applySortFilter(
//     tableData,
//     getComparator(order, orderBy),
//     filterName
//   );

//   const isNotFound = !filteredUsers?.length && !!filterName;

//   const customPagination = () => {
//     return (
//       <Box
//         sx={{
//           py: 1.5,
//           backgroundColor: colors.blueAccent[800],
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             px: 2,
//           }}
//         >
//           <TogglePage
//             onChangePageSize={setRowsPerPage}
//             pageSize={rowsPerPage}
//           />
//           <Pagination
//             sx={{
//               display: "flex",
//               justifyContent: "flex-end",
//               mt: 1,
//             }}
//             count={count}
//             page={page}
//             onChange={(event, newPage) => setPage(newPage)}
//             color="primary"
//           />
//         </Box>
//       </Box>
//     );
//   };

//   return (
//     <Box sx={{ my: 2 }}>
//       <Card>
//         <UserListToolbar
//           filterName={filterName}
//           onFilterName={handleFilterByName}
//           exportData={exportData}
//           searchButton={true}
//         />
//         <TableContainer>
//           <Table>
//             <UserListHead
//               order={order}
//               orderBy={orderBy}
//               headLabel={TABLE_HEAD}
//               rowCount={tableData?.length}
//               numSelected={selected.length}
//               onRequestSort={handleRequestSort}
//               // onSelectAllClick={handleSelectAllClick}
//               tableData={tableData}
//             />
//             <TableBody>
//               {tableLoading ? (
//                 <TableRow sx={{ height: 300 }}>
//                   <TableCell align="center" colSpan={dynamicTableHead.length}>
//                     <CircularProgress color="info" />
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredUsers
//                   .slice(
//                     oldPage * rowsPerPage,
//                     oldPage * rowsPerPage + rowsPerPage
//                   )
//                   .map((row) => {
//                     const selectedUser = selected.indexOf(row.id) !== -1;

//                     return (
//                       <TableRow
//                         hover
//                         key={row.id}
//                         tabIndex={-1}
//                         role="checkbox"
//                         selected={selectedUser}
//                       >
//                         {dynamicTableHead.map((property) => (
//                           <TableCell
//                             key={property}
//                             align="left"
//                             sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
//                           >
//                             <Stack
//                               direction="row"
//                               alignItems="center"
//                               spacing={2}
//                             >
//                               <Typography variant="subtitle2" noWrap>
//                                 {row[property]}
//                               </Typography>
//                             </Stack>
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     );
//                   })
//               )}
//               {emptyRows > 0 && (
//                 <TableRow style={{ height: 53 * emptyRows }}>
//                   <TableCell colSpan={dynamicTableHead.length} />
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         {customPagination()}
//       </Card>
//     </Box>
//   );
// };

// export default CommonTable;

// function applySortFilter(array, comparator, query) {
//   // Implement this function to filter and sort the array
//   // Return the filtered and sorted array
//   return array; // Placeholder, replace with actual implementation
// }

// function getComparator(order, orderBy) {
//   // Implement this function to return a comparator function based on order and orderBy
//   return (a, b) => {
//     // Placeholder, replace with actual implementation
//     return 0;
//   };
// }

import React, { useState } from "react";
import {
  Box,
  Card,
  Pagination,
  Table,
  TableContainer,
  TableBody,
  useTheme,
  Typography,
  CircularProgress,
  TableRow,
  TableCell,
  Stack,
} from "@mui/material";
import UserListToolbar from "../user/UserListToolbar";
import TogglePage from "../toggleButton/togglePage";
import { tokens } from "../../../theme";
import { UserListHead } from "../user";

const dummyData = [
  {
    id: 1,
    name: "John Doe",
    age: 25,
    email: "john@example.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Doe",
    age: 28,
    email: "jane@example.com",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Alice Smith",
    age: 22,
    email: "alice@example.com",
    status: "Active",
  },
  {
    id: 4,
    name: "Bob Johnson",
    age: 30,
    email: "bob@example.com",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Eve Williams",
    age: 26,
    email: "eve@example.com",
    status: "Active",
  },
];

const CommonTable = ({
  TABLE_HEAD = [],
  tableData = dummyData || [],
  setRowsPerPage,
  rowsPerPage = 10,
  count = 5,
  page = 1,
  setPage,
  setRefresh,
  tableLoading,
  exportData = [],
}) => {
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [filterName, setFilterName] = useState("");
  const [oldPage, setOldPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(true);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleFilterByName = (event) => {
    setOldPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows =
    oldPage > 0
      ? Math.max(0, (1 + oldPage) * rowsPerPage - tableData?.length)
      : 0;

  const dynamicTableHead =
    TABLE_HEAD || (tableData[0] ? Object.keys(tableData[0]) : []);

  const filteredUsers = applySortFilter(
    tableData,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers?.length && !!filterName;

  const customPagination = () => {
    return (
      <Box
        sx={{
          py: 1.5,
          backgroundColor: colors.blueAccent[800],
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
          }}
        >
          <TogglePage
            onChangePageSize={setRowsPerPage}
            pageSize={rowsPerPage}
          />
          <Pagination
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 1,
            }}
            count={count}
            page={page}
            onChange={(event, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ my: 2 }}>
      <Card>
        <UserListToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
          exportData={exportData}
          searchButton={true}
        />
        <TableContainer>
          <Table>
            <UserListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData?.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              tableData={tableData}
            />
            <TableBody>
              {tableLoading ? (
                <TableRow sx={{ height: 300 }}>
                  <TableCell align="center" colSpan={dynamicTableHead.length}>
                    <CircularProgress color="info" />
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers
                  .slice(
                    oldPage * rowsPerPage,
                    oldPage * rowsPerPage + rowsPerPage
                  )
                  .map((row) => {
                    const selectedUser = selected.indexOf(row.id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={row.id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={selectedUser}
                      >
                        {dynamicTableHead.map((property) => (
                          <TableCell
                            key={property}
                            align="left"
                            sx={{ paddingTop: 0.3, paddingBottom: 0.3 }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Typography variant="subtitle2" noWrap>
                                {row[property]}
                              </Typography>
                            </Stack>
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={dynamicTableHead.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {customPagination()}
      </Card>
    </Box>
  );
};

export default CommonTable;

function applySortFilter(array, comparator, query) {
  const filteredArray = array.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.email.toLowerCase().includes(query.toLowerCase()) ||
      item.status.toLowerCase().includes(query.toLowerCase())
  );
  return filteredArray.sort(comparator);
}

function getComparator(order, orderBy) {
  return (a, b) => {
    if (order === "asc") {
      if (a[orderBy] < b[orderBy]) return -1;
      if (a[orderBy] > b[orderBy]) return 1;
      return 0;
    } else {
      if (b[orderBy] < a[orderBy]) return -1;
      if (b[orderBy] > a[orderBy]) return 1;
      return 0;
    }
  };
}
