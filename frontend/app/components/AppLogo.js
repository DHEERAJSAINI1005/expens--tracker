import { Typography, Box } from "@mui/material";

export default function AppLogo() {
  return (
    <Box display="flex" alignItems="center" gap={1.2}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{
          letterSpacing: 0.5,
          color: "text.primary",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Expense
        <Typography
          component="span"
          sx={{
            color: "primary.main",
            fontWeight: 800,
            ml: 0.5,
          }}
        >
          Dashboard
        </Typography>
      </Typography>
    </Box>
  );
}
