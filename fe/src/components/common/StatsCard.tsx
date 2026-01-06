import { FC } from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Skeleton
} from "@mui/material";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  loading?: boolean;
}

const StatsCard: FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = "primary",
  loading = false 
}) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {loading ? <Skeleton width={100} /> : title}
            </Typography>
            <Typography variant="h4">
              {loading ? <Skeleton width={60} /> : value}
            </Typography>
          </Box>
          <Box color={`${color}.main`}>
            {loading ? <Skeleton variant="circular" width={40} height={40} /> : icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
