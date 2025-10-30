import { Box, Pagination, useTheme } from "@mui/material";
import TogglePage from "../toggleButton/togglePage";
import { tokens } from "../../../theme";

export const CustomPagination = ({
  setRowsPerPage,
  rowsPerPage,
  count,
  page,
  setPage,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      sx={{
        backgroundColor: colors.blueAccent[800],
        py: 1,
        borderRadius: "0px 0px 5px 5px",
        boxShadow: `0px 4px 5px -2px ${colors.grey[900]}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          flexDirection: "column", // Set the default flex direction to "column"
          "@media (min-width: 600px)": {
            flexDirection: "row", // Use "row" for screens wider than 600px
          },
        }}
      >
        <TogglePage onChangePageSize={setRowsPerPage} pageSize={rowsPerPage} />
        <Pagination
          size="small"
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 1,
            "@media (min-width: 600px)": {
              m: 0,
            },
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
