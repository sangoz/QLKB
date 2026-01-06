import { FC, useState, useEffect } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Chip,
  Divider,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert
} from "@mui/material";
import { 
  Login as LoginIcon,
  PersonAdd,
  LocalHospital,
  Dashboard as DashboardIcon,
  People,
  CalendarMonth,
  MedicalServices,
  Schedule,
  Business,
  Phone,
  Email,
  LocationOn,
  Home,
  Biotech,
  Hotel,
  AdminPanelSettings
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { departmentAPI, employeeAPI, patientAPI } from "../services/api";
import TestAPI from "../components/TestAPI";

const Dashboard: FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from APIs
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        console.log('Starting to fetch all data...');
        setLoading(true);
        setError(null);

        // Fetch departments
        const deptResponse = await departmentAPI.getAll();
        console.log('Department API response:', deptResponse);
        if (deptResponse?.data && Array.isArray(deptResponse.data)) {
          console.log('Setting departments:', deptResponse.data);
          setDepartments(deptResponse.data);
        } else {
          console.log('No department data array found in response:', deptResponse);
        }

        // Fetch doctors count using dedicated API
        try {
          const doctorsResponse = await employeeAPI.getDoctors();
          console.log('Doctors API response:', doctorsResponse);
          if (doctorsResponse.data && Array.isArray(doctorsResponse.data)) {
            setDoctors(doctorsResponse.data);
            console.log('Doctors count:', doctorsResponse.data.length);
          }
        } catch (docErr) {
          console.error('Error fetching doctors:', docErr);
        }

        // Fetch patients count
        try {
          const patientsResponse = await patientAPI.getAllPatients();
          console.log('Patients API response:', patientsResponse);
          if (patientsResponse.data && Array.isArray(patientsResponse.data)) {
            setPatients(patientsResponse.data);
            console.log('Patients count:', patientsResponse.data.length);
          }
        } catch (patErr) {
          console.error('Error fetching patients:', patErr);
        }

      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const navigationItems = [
    { label: "Trang chủ", icon: <Home />, path: "/" },
    { label: "Bác sĩ", icon: <MedicalServices />, path: "/public/doctors" },
    // { label: "Chuyên khoa", icon: <Biotech />, path: "/public/departments" },
    { label: "Dịch vụ", icon: <LocalHospital />, path: "/public/services" },
    // { label: "Nội trú", icon: <Hotel />, path: "/public/inpatient" },
    { label: "Liên hệ", icon: <Phone />, path: "/contact" }
  ];

  const features = [
    {
      title: "Dành cho Bệnh nhân",
      description: "Đặt lịch khám, theo dõi hóa đơn, xem kết quả khám bệnh",
      actions: [
        { label: "Đăng nhập", action: () => navigate("/login"), variant: "contained" as const },
        { label: "Đăng ký", action: () => navigate("/register"), variant: "outlined" as const }
      ],
      color: "#3da9fc"
    },
    {
      title: "Dành cho Nhân viên",
      description: "Quản lý bệnh nhân, lịch làm việc, xử lý thanh toán",
      actions: [
        { label: "Đăng nhập Nhân viên", action: () => navigate("/login"), variant: "contained" as const }
      ],
      color: "#094067"
    },
    {
      title: "Dành cho Quản trị",
      description: "Quản lý nhân viên, khoa, phòng bệnh, thuốc và dịch vụ",
      actions: [
        { label: "Đăng nhập BGD", action: () => navigate("/login"), variant: "contained" as const }
      ],
      color: "#ef4565"
    }
  ];

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      bgcolor: "#fffffe"
    }}>
      {/* Fixed Navigation Toolbar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          background: "linear-gradient(135deg, rgba(9, 64, 103, 0.95) 0%, rgba(61, 169, 252, 0.95) 100%)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(9, 64, 103, 0.3)",
          zIndex: 1200
        }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
            <Typography variant="h6" sx={{ mr: 3, fontWeight: 600, color: "#fffffe" }}>
              Bệnh viện Đa khoa
            </Typography>
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  color: "#fffffe",
                  bgcolor: "rgba(255,255,255,0.1)",
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                    transform: "translateY(-1px)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Header với thông tin bệnh viện */}
      <Box sx={{ 
        bgcolor: "#094067", 
        py: 8, 
        pt: 12, // Thêm padding top để tránh bị che bởi fixed toolbar
        color: "#fffffe",
        background: "linear-gradient(135deg, #094067 0%, #3da9fc 100%)"
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={12}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Bệnh viện Đại học y dược TPHCM
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, color: "#90b4ce" }}>
                Chăm sóc sức khỏe toàn diện - Công nghệ hiện đại - Đội ngũ chuyên nghiệp
              </Typography>
              
              {/* Thông tin liên hệ */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Thông tin liên hệ
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Phone sx={{ fontSize: 20 }} />
                    <Typography>Hotline: 1900-1234 (24/7)</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Email sx={{ fontSize: 20 }} />
                    <Typography>Email: info@benhviendakhoa.vn</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOn sx={{ fontSize: 20 }} />
                    <Typography>Địa chỉ: 123 Đường Lê Lợi, Quận 1, TP.HCM</Typography>
                  </Box>
                </Box>
              </Box>

              <Box display="flex" gap={2} flexWrap="wrap">
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<LoginIcon />}
                  onClick={() => navigate("/login")}
                  sx={{ 
                    bgcolor: "#fffffe", 
                    color: "#094067",
                    "&:hover": { bgcolor: "#f0f0f0" },
                    fontWeight: 600
                  }}
                >
                  Đăng nhập
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  startIcon={<PersonAdd />}
                  onClick={() => navigate("/register")}
                  sx={{ 
                    borderColor: "#fffffe", 
                    color: "#fffffe",
                    "&:hover": { borderColor: "#f0f0f0", bgcolor: "rgba(255,255,255,0.1)" },
                    fontWeight: 600
                  }}
                >
                  Đăng ký
                </Button>
              </Box>
            </Grid>
            
          </Grid>
        </Container>
      </Box>

      {/* Thông tin chuyên khoa */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ 
          fontWeight: 700, 
          color: "#094067",
          mb: 2
        }}>
          Chuyên khoa của chúng tôi
        </Typography>
        <Typography variant="h6" align="center" sx={{ 
          color: "#5f6c7b", 
          mb: 6,
          maxWidth: "800px",
          mx: "auto"
        }}>
          Với đội ngũ bác sĩ giỏi và trang thiết bị hiện đại, chúng tôi cam kết mang đến dịch vụ y tế chất lượng cao
        </Typography>

        {/* Loading state */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Đang tải danh sách chuyên khoa...</Typography>
          </Box>
        )}

        {/* Error state */}
        {error && (
          <Box display="flex" justifyContent="center" py={4}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* Departments Grid */}
        {!loading && !error && (
          <Grid container spacing={4}>
            {departments.map((department, index) => (
              <Grid item xs={12} md={6} lg={4} key={department.MaKhoa}>
                <Card sx={{ 
                  height: "100%", 
                  borderRadius: 3, 
                  boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 16px 48px rgba(9, 64, 103, 0.2)"
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <LocalHospital sx={{ fontSize: 40, color: "#3da9fc" }} />
                      <Typography variant="h5" sx={{ fontWeight: 600, color: "#094067" }}>
                        {department.TenKhoa}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: "#5f6c7b", mb: 3 }}>
                      {department.MoTa}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/public/departments`)}
                      sx={{
                        borderColor: "#3da9fc",
                        color: "#3da9fc",
                        "&:hover": {
                          borderColor: "#2196f3",
                          bgcolor: "rgba(61, 169, 252, 0.1)"
                        }
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Thống kê và thành tích */}
      <Box sx={{ bgcolor: "#f8f9fa", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ 
            fontWeight: 700, 
            color: "#094067",
            mb: 6
          }}>
            Thành tích của chúng tôi
          </Typography>
          
          <Grid container spacing={4}>
            {[
              { label: "Bệnh nhân đã phục vụ", value: loading ? "..." : `${patients.length.toLocaleString()}+`, icon: <People sx={{ fontSize: 50, color: "#3da9fc" }} /> },
              { label: "Bác sĩ chuyên nghiệp", value: loading ? "..." : `${doctors.length}+`, icon: <LocalHospital sx={{ fontSize: 50, color: "#ef4565" }} /> },
              { label: "Chuyên khoa", value: loading ? "..." : `${departments.length}+`, icon: <Biotech sx={{ fontSize: 50, color: "#f25f4c" }} /> },
              { label: "Năm kinh nghiệm", value: "25+", icon: <DashboardIcon sx={{ fontSize: 50, color: "#90b4ce" }} /> }
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card sx={{ 
                  textAlign: "center", 
                  p: 4, 
                  borderRadius: 3,
                  boxShadow: "0 4px 16px rgba(9, 64, 103, 0.1)",
                  height: "100%"
                }}>
                  {stat.icon}
                  <Typography variant="h3" sx={{ fontWeight: 700, color: "#094067", my: 2 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Hướng dẫn sử dụng hệ thống */}
      <Box sx={{ py: 6, bgcolor: "#fffffe" }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ 
            fontWeight: 700, 
            color: "#094067",
            mb: 6
          }}>
            Các tính năng chính của hệ thống
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  p: 4, 
                  borderRadius: 3, 
                  height: "100%",
                  borderLeft: `4px solid ${feature.color}`,
                  boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)"
                  }
                }}>
                  <Typography variant="h5" gutterBottom sx={{ 
                    fontWeight: 600, 
                    color: feature.color 
                  }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#5f6c7b", mb: 3 }}>
                    {feature.description}
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    {feature.actions.map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        variant={action.variant}
                        onClick={action.action}
                        sx={{ 
                          bgcolor: action.variant === "contained" ? feature.color : "transparent",
                          borderColor: feature.color,
                          color: action.variant === "contained" ? "#fffffe" : feature.color,
                          "&:hover": {
                            bgcolor: action.variant === "contained" ? feature.color : `${feature.color}15`,
                            borderColor: feature.color
                          }
                        }}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#094067", color: "#fffffe", py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Bệnh viện Đại học y dược TPHCM
              </Typography>
              <Typography variant="body2" sx={{ color: "#90b4ce", mb: 2 }}>
                Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe tốt nhất với đội ngũ y bác sĩ chuyên nghiệp và trang thiết bị hiện đại.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Liên kết nhanh
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Button 
                  color="inherit" 
                  sx={{ justifyContent: "flex-start", textTransform: "none" }}
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập hệ thống
                </Button>
                <Button 
                  color="inherit" 
                  sx={{ justifyContent: "flex-start", textTransform: "none" }}
                  onClick={() => navigate("/register")}
                >
                  Đăng ký tài khoản
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, borderColor: "#90b4ce" }} />
          <Typography variant="body2" align="center" sx={{ color: "#90b4ce" }}>
            © 2024 Bệnh viện Đại học y dược TPHCM. Tất cả các quyền được bảo lưu.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
