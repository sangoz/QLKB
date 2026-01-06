import { FC } from "react";
import { Typography, Box } from "@mui/material";

const TestPage: FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" color="primary">
        Test Page - This should work!
      </Typography>
      <Typography variant="body1">
        If you can see this, the routing is working.
      </Typography>
    </Box>
  );
};

export default TestPage;
