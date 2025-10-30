import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  Box,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

function TrainerRow({
  trainer,
  isExpanded,
  onToggleExpand,
  onDeleteClick,
  onEditClick,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  // Handle menu open
  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle edit click
  const handleEdit = () => {
    handleMenuClose();
    onEditClick(trainer);
  };

  // Handle delete click
  const handleDelete = () => {
    handleMenuClose();
    onDeleteClick(trainer);
  };

  // Handle domains - can be array, string, or null/undefined
  let domains = [];

  if (Array.isArray(trainer.domains)) {
    domains = trainer.domains;
  } else if (typeof trainer.domains === "string" && trainer.domains.trim()) {
    domains = trainer.domains.split(",").map((domain) => domain.trim());
  }

  const displayDomains = domains.slice(0, 2);
  const hiddenDomains = domains.slice(2);
  const hasMoreDomains = hiddenDomains.length > 0;

  return (
    <>
      <TableRow hover sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell component="th" scope="row">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonIcon color="primary" fontSize="small" />
            <Typography variant="subtitle2" fontWeight={600}>
              {trainer.fullname || "N/A"}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EmailIcon color="action" fontSize="small" />
            <Typography variant="body2">{trainer.email || "N/A"}</Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PhoneIcon color="action" fontSize="small" />
            <Typography variant="body2">{trainer.phone || "N/A"}</Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              alignItems: "center",
            }}
          >
            {domains.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No domains assigned
              </Typography>
            ) : (
              <>
                {displayDomains.map((domain, index) => (
                  <Chip
                    key={index}
                    label={domain}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontSize: "0.75rem" }}
                  />
                ))}
                {hasMoreDomains && (
                  <IconButton
                    size="small"
                    onClick={() => onToggleExpand(trainer.trainer_id)}
                    sx={{
                      transition: "transform 0.3s ease",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                )}
                {hasMoreDomains && !isExpanded && (
                  <Chip
                    label={`+${hiddenDomains.length} more`}
                    size="small"
                    variant="filled"
                    color="secondary"
                    sx={{ fontSize: "0.7rem", cursor: "pointer" }}
                    onClick={() => onToggleExpand(trainer.trainer_id)}
                  />
                )}
              </>
            )}
          </Box>
        </TableCell>
        <TableCell align="center">
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: {
                boxShadow: 2,
                minWidth: 150,
              },
            }}
          >
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
      {hasMoreDomains && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 2 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  component="div"
                  color="primary"
                >
                  All Domains:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {domains.map((domain, index) => (
                    <Chip
                      key={index}
                      label={domain}
                      size="small"
                      variant={index < 2 ? "outlined" : "filled"}
                      color="primary"
                      sx={{
                        fontSize: "0.75rem",
                        animation: index >= 2 ? "fadeInUp 0.3s ease" : "none",
                        "@keyframes fadeInUp": {
                          "0%": {
                            opacity: 0,
                            transform: "translateY(10px)",
                          },
                          "100%": {
                            opacity: 1,
                            transform: "translateY(0)",
                          },
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default TrainerRow;
