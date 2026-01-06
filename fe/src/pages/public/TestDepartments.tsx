import React, { FC, useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert
} from "@mui/material";
import {
  Biotech,
  LocalHospital,
  MedicalServices,
  Home,
  Hotel,
  Phone
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { departmentAPI } from "../../services/api";

const TestDepartments: FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        console.log('Fetching departments...');
        const response = await departmentAPI.getAll();
        console.log('API response:', response);
        
        if (response?.data) {
          setDepartments(response.data);
        } else {
          setError('Không có dữ liệu khoa');
        }
      } catch (err: any) {
        console.error('Error fetching departments:', err);
        setError(err?.message || 'Lỗi khi tải danh sách khoa');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải danh sách khoa...</Typography>
      </Box>
    );
  }

  // Error state  
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: "#094067", 
        py: 6, 
        color: "#fffffe",
        background: "linear-gradient(135deg, #094067 0%, #3da9fc 100%)"
      }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              mb: 2
            }}
          >
            Các Chuyên Khoa ({departments.length})
          </Typography>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{
              opacity: 0.9,
              lineHeight: 1.6,
              fontWeight: 300
            }}
          >
            Đội ngũ chuyên gia y tế hàng đầu với trang thiết bị hiện đại
          </Typography>
        </Container>
      </Box>

      {/* Departments Grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {departments.map((department: any) => (
            <Grid item xs={12} sm={6} lg={4} key={department.MaKhoa}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#3da9fc",
                    color: "#fff",
                    p: 3,
                    textAlign: "center"
                  }}
                >
                  <Biotech sx={{ fontSize: "3rem", mb: 1 }} />
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ fontWeight: 700 }}
                  >
                    {department.TenKhoa}
                  </Typography>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      color: "#5f6c7b",
                      lineHeight: 1.6
                    }}
                  >
                    {department.MoTa || "Chuyên khoa chất lượng cao"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Mã khoa: {department.MaKhoa}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<LocalHospital />}
                    sx={{
                      bgcolor: "#3da9fc",
                      "&:hover": {
                        bgcolor: "#2196f3"
                      },
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none"
                    }}
                    onClick={() => navigate(`/departments/${department.MaKhoa}`)}
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Navigation */}
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={() => navigate("/")}
            sx={{ mr: 2, mb: 2 }}
          >
            Trang chủ
          </Button>
          <Button
            variant="outlined"
            startIcon={<MedicalServices />}
            onClick={() => navigate("/public/doctors")}
            sx={{ mr: 2, mb: 2 }}
          >
            Bác sĩ
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default TestDepartments;
