import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function CustomAccordion({
  panelId,
  heading,
  secondaryText,
  children,
  isOpen,
  onToggle,
  bgColor,
}) {
  const handleChange = (event, isExpanded) => {
    onToggle(panelId, isExpanded);
  };

  return (
    <Accordion
      expanded={isOpen}
      onChange={handleChange}
      sx={{ bgcolor: bgColor }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${panelId}-content`}
        id={`${panelId}-header`}
      >
        <Typography sx={{ width: "20%", flexShrink: 0, fontWeight: 600 }}>
          {heading}
        </Typography>
        {secondaryText && (
          <Typography
            sx={{
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
            }}
          >
            {secondaryText}
          </Typography>
        )}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
