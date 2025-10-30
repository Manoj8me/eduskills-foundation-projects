import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Badge,
  Box,
  ButtonBase,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { tokens } from "../../../theme";

const NotificationCard = ({ title, count, onClick, icon, color }) => {
  const hasCount = count > 0;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box position="relative" display="inline-block" width="100%">
      <ButtonBase onClick={onClick} sx={{ width: "100%", borderRadius: 1 }}>
        <Card
          sx={{
            backgroundColor: color
              ? color
              : hasCount
              ? colors.blueAccent[800]
              : colors.background[100],
            display: "flex",
            alignItems: "center",
            px: 2,
            position: "relative",
            width: "100%", // Ensure card occupies full width of the parent container
          }}
          elevation={5}
        >
          <Icon
            icon={icon ? icon : "uim:comment-alt-message"}
            width={30}
            height={30}
          />
          <Box sx={{ flexGrow: 1, my: 2 }}>
            <Typography variant="h6">{title}</Typography>
          </Box>
        </Card>
      </ButtonBase>
      {hasCount && (
        <Badge
          badgeContent={count}
          color="info"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
          }}
        />
      )}
    </Box>
  );
};

export default NotificationCard;
