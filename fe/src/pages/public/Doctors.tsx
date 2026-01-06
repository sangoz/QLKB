import { FC, useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Paper,
  Divider,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert
} from "@mui/material";
import {
  MedicalServices,
  Star,
  Schedule,
  LocalHospital,
  School,
  Home,
  Biotech,
  Hotel,
  Phone
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { employeeAPI, departmentAPI } from "../../services/api";

// Types
interface Doctor {
  MaNV: string;
  HoTen: string;
  NgaySinh: string;
  SDT: string;
  DiaChi: string;
  Luong: string;
  LoaiNV: string;
  TrinhDo: string;
  LaTruongKhoa: boolean;
  MaKhoaId: string;
  department?: any;
}

interface Department {
  MaKhoa: string;
  TenKhoa: string;
  MoTa: string;
}

const PublicDoctors: FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch doctors and departments data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch doctors
        const doctorsResponse = await employeeAPI.getDoctors();
        console.log('Doctors response:', doctorsResponse);
        
        // Fetch departments
        const deptResponse = await departmentAPI.getAll();
        console.log('Departments response:', deptResponse);

        if (doctorsResponse.data && Array.isArray(doctorsResponse.data)) {
          // Map departments to doctors
          const doctorsWithDept = doctorsResponse.data.map((doctor: Doctor) => {
            const department = deptResponse.data?.find((dept: Department) => dept.MaKhoa === doctor.MaKhoaId);
            return { ...doctor, department };
          });
          
          setDoctors(doctorsWithDept);
        }
        
        if (deptResponse.data && Array.isArray(deptResponse.data)) {
          setDepartments(deptResponse.data);
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Không thể tải danh sách bác sĩ');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper functions
  const getTrinhDoDisplay = (trinhDo: string) => {
    const mapping: { [key: string]: string } = {
      'ChuyenKhoaI': 'BS.CKI',
      'ChuyenKhoaII': 'BS.CKII',
      'ThacSi': 'ThS.BS',
      'TienSi': 'TS.BS',
      'PhoGiaoSu': 'PGS.TS',
      'GiaoSu': 'GS.TS'
    };
    return mapping[trinhDo] || 'BS';
  };

  const getExperienceYears = (ngaySinh: string) => {
    const birthYear = new Date(ngaySinh).getFullYear();
    const currentYear = new Date().getFullYear();
    const assumedStartAge = 25; // Giả sử bắt đầu hành nghề ở tuổi 25
    return Math.max(0, currentYear - birthYear - assumedStartAge);
  };

  const navigationItems = [
    { label: "Trang chủ", icon: <Home />, path: "/" },
    { label: "Bác sĩ", icon: <MedicalServices />, path: "/public/doctors" },
    // { label: "Chuyên khoa", icon: <Biotech />, path: "/public/departments" },
    { label: "Dịch vụ", icon: <LocalHospital />, path: "/public/services" },
    // { label: "Nội trú", icon: <Hotel />, path: "/public/inpatient" },
    { label: "Liên hệ", icon: <Phone />, path: "/contact" }
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
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
                  bgcolor: item.path === "/public/doctors" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
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

      {/* Header */}
      <Box sx={{ 
        bgcolor: "#094067", 
        py: 6, 
        pt: 12, // Padding top để tránh bị che bởi fixed toolbar
        color: "#fffffe",
        background: "linear-gradient(135deg, #094067 0%, #3da9fc 100%)"
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Đội ngũ Bác sĩ
          </Typography>
          <Typography variant="h6" sx={{ color: "#90b4ce", maxWidth: 600 }}>
            Đội ngũ bác sĩ giàu kinh nghiệm, tận tâm với nghề, luôn đặt sức khỏe bệnh nhân lên hàng đầu
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Loading state */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Đang tải danh sách bác sĩ...</Typography>
          </Box>
        )}

        {/* Error state */}
        {error && (
          <Box display="flex" justifyContent="center" py={4}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* Danh sách bác sĩ */}
        {!loading && !error && (
          <>
            <Typography variant="h4" gutterBottom sx={{ color: "#094067", fontWeight: 600, mb: 4 }}>
              Đội ngũ bác sĩ ({doctors.length} bác sĩ)
            </Typography>
            
            <Grid container spacing={4}>
              {doctors.map((doctor) => (
                <Grid item xs={12} md={6} lg={4} key={doctor.MaNV}>
                  <Card 
                    sx={{ 
                      height: "100%",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 24px rgba(9, 64, 103, 0.15)"
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: "center" }}>
                      <Avatar
                        sx={{ 
                          width: 100, 
                          height: 100, 
                          mx: "auto", 
                          mb: 2,
                          bgcolor: "#3da9fc"
                        }}
                      >
                        <MedicalServices sx={{ fontSize: 40 }} />
                      </Avatar>
                      
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#094067" }}>
                        {getTrinhDoDisplay(doctor.TrinhDo)} {doctor.HoTen}
                        {doctor.LaTruongKhoa && (
                          <Chip 
                            label="Trưởng khoa" 
                            size="small" 
                            sx={{ ml: 1, bgcolor: "#ef4565", color: "white" }}
                          />
                        )}
                      </Typography>
                      
                      <Chip
                        label={doctor.department?.TenKhoa || "Chưa phân khoa"}
                        color="primary"
                        size="small"
                        sx={{ mb: 2, bgcolor: "#3da9fc" }}
                      />
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {doctor.department?.MoTa || "Bác sĩ chuyên khoa"}
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ textAlign: "left", mb: 2 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <School sx={{ fontSize: 16, color: "#666" }} />
                          <Typography variant="body2" color="text.secondary">
                            {doctor.TrinhDo.replace(/([A-Z])/g, ' $1').trim()}
                          </Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <LocalHospital sx={{ fontSize: 16, color: "#666" }} />
                          <Typography variant="body2" color="text.secondary">
                            ~{getExperienceYears(doctor.NgaySinh)} năm kinh nghiệm
                          </Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Schedule sx={{ fontSize: 16, color: "#666" }} />
                          <Typography variant="body2" color="text.secondary">
                            Thứ 2-6: 8:00-17:00
                          </Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="center" gap={1}>
                          <Star sx={{ fontSize: 16, color: "#ffc107" }} />
                          <Typography variant="body2" color="text.secondary">
                            Liên hệ: {doctor.SDT}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate("/login")}
                        sx={{
                          bgcolor: "#3da9fc",
                          "&:hover": { bgcolor: "#2b8fd1" }
                        }}
                      >
                        Đặt lịch khám
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Call to action */}
        <Paper sx={{ p: 4, mt: 6, textAlign: "center", bgcolor: "#f0f8ff" }}>
          <Typography variant="h5" gutterBottom sx={{ color: "#094067", fontWeight: 600 }}>
            Cần đặt lịch khám bệnh?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "#666" }}>
            Đăng ký tài khoản để đặt lịch khám với các bác sĩ chuyên khoa
          </Typography>
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/register")}
              sx={{ bgcolor: "#3da9fc", "&:hover": { bgcolor: "#2b8fd1" } }}
            >
              Đăng ký ngay
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/login")}
              sx={{ borderColor: "#094067", color: "#094067" }}
            >
              Đăng nhập
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PublicDoctors;
