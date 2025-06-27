import React from "react";
import { Paper, Box, Typography } from "@mui/material";

type StatsCardProps = {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  gradient: string;
};

const StatsCard = ({ icon, title, value, gradient }: StatsCardProps) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        minWidth: 120,
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        borderRadius: 2,
        background: gradient,
        color: "white",
      }}
    >
      {icon}
      <Box>
        <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
          {title}
        </Typography>
        <Typography variant="h6" fontWeight={700} noWrap>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StatsCard;
