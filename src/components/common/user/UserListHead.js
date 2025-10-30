import PropTypes from "prop-types";
// @mui
import {
  Box,
  Checkbox,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../theme";
// import { useSelector } from "react-redux";

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: "1px",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  clip: "rect(0 0 0 0)",
};

UserListHead.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};

export default function UserListHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick,
  tableData,
  isCheckShow,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // let superAdmin = false;

  // const userRole = useSelector((state) => state.authorise.userRole);

  const newSelecteds = tableData?.filter(
    (item) =>
      item.status !== "Approved" &&
      item.status !== "Rejected" &&
      item.status !== "Cancel"
  );

  return (
    <TableHead sx={{ bgcolor: colors.blueAccent[800] }}>
      <TableRow>
        {isCheckShow && (
          <Box>
            {/* {userRole === "spoc" && ( */}
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
                disabled={newSelecteds?.length === 0}
              />
            </TableCell>
            {/* )} */}
          </Box>
        )}

        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ paddingTop: 1, paddingBottom: 1, whiteSpace: "nowrap" }}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
