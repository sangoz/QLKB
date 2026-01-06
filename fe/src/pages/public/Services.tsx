import { FC, useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert
} from "@mui/material";
import {
  MedicalServices,
  AccessTime,
  LocalHospital,
  Biotech,
  Visibility,
  Healing,
  Star,
  Home,
  Hotel,
  Phone
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { serviceAPI } from "../../services/api";

// Types
interface Service {
  MaDichVu: string;
  TenDichVu: string;
  GiaDichVu: string;
}

const PublicServices: FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services data
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await serviceAPI.getAll();
        console.log('Services response:', response);

        if (response.data && Array.isArray(response.data)) {
          setServices(response.data);
        }
      } catch (err: any) {
        console.error('Error fetching services:', err);
        setError('Không thể tải danh sách dịch vụ');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Helper function to format price
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseInt(price));
  };

  const navigationItems = [
    { label: "Trang chủ", icon: <Home />, path: "/" },
    { label: "Bác sĩ", icon: <MedicalServices />, path: "/public/doctors" },
    // { label: "Chuyên khoa", icon: <Biotech />, path: "/public/departments" },
    { label: "Dịch vụ", icon: <LocalHospital />, path: "/public/services" },
    // { label: "Nội trú", icon: <Hotel />, path: "/public/inpatient" },
    { label: "Liên hệ", icon: <Phone />, path: "/contact" }
  ];

  const serviceCategories = [
    {
      id: 1,
      name: "Khám và tư vấn",
      icon: <MedicalServices />,
      color: "#3da9fc",
      services: [
        { name: "Khám tổng quát", price: "200,000₫", duration: "30 phút" },
        { name: "Khám chuyên khoa Tim mạch", price: "300,000₫", duration: "45 phút" },
        { name: "Khám chuyên khoa Nhi", price: "250,000₫", duration: "30 phút" },
        { name: "Khám chuyên khoa Thần kinh", price: "350,000₫", duration: "45 phút" },
        { name: "Khám sản phụ khoa", price: "280,000₫", duration: "40 phút" },
        { name: "Tư vấn dinh dưỡng", price: "150,000₫", duration: "30 phút" }
      ]
    },
    {
      id: 2,
      name: "Xét nghiệm",
      icon: <Biotech />,
      color: "#27ae60",
      services: [
        { name: "Xét nghiệm máu tổng quát", price: "120,000₫", duration: "2 giờ" },
        { name: "Xét nghiệm sinh hóa máu", price: "200,000₫", duration: "4 giờ" },
        { name: "Xét nghiệm nước tiểu", price: "80,000₫", duration: "1 giờ" },
        { name: "Xét nghiệm hormone", price: "300,000₫", duration: "1 ngày" },
        { name: "Xét nghiệm vi sinh", price: "150,000₫", duration: "2-3 ngày" },
        { name: "Xét nghiệm gen", price: "800,000₫", duration: "7 ngày" }
      ]
    },
    {
      id: 3,
      name: "Chẩn đoán hình ảnh",
      icon: <Visibility />,
      color: "#e74c3c",
      services: [
        { name: "Chụp X-quang", price: "100,000₫", duration: "15 phút" },
        { name: "Siêu âm tổng quát", price: "200,000₫", duration: "30 phút" },
        { name: "Siêu âm 4D thai nhi", price: "400,000₫", duration: "45 phút" },
        { name: "Chụp CT Scanner", price: "800,000₫", duration: "30 phút" },
        { name: "Chụp MRI", price: "1,500,000₫", duration: "60 phút" },
        { name: "Nội soi dạ dày", price: "600,000₫", duration: "45 phút" }
      ]
    },
    {
      id: 4,
      name: "Phẫu thuật",
      icon: <LocalHospital />,
      color: "#f39c12",
      services: [
        { name: "Phẫu thuật ruột thừa", price: "8,000,000₫", duration: "2 giờ" },
        { name: "Phẫu thuật nội soi", price: "12,000,000₫", duration: "3 giờ" },
        { name: "Phẫu thuật tim hở", price: "50,000,000₫", duration: "6 giờ" },
        { name: "Phẫu thuật não", price: "80,000,000₫", duration: "8 giờ" },
        { name: "Phẫu thuật tạo hình", price: "15,000,000₫", duration: "4 giờ" },
        { name: "Phẫu thuật cột sống", price: "25,000,000₫", duration: "5 giờ" }
      ]
    },
    {
      id: 5,
      name: "Điều trị đặc biệt",
      icon: <Healing />,
      color: "#9b59b6",
      services: [
        { name: "Hóa trị liệu", price: "5,000,000₫", duration: "4 giờ" },
        { name: "Xạ trị liệu", price: "3,000,000₫", duration: "30 phút" },
        { name: "Thẩm phân máu", price: "1,200,000₫", duration: "4 giờ" },
        { name: "Vật lý trị liệu", price: "300,000₫", duration: "60 phút" },
        { name: "Châm cứu", price: "200,000₫", duration: "45 phút" },
        { name: "Massage trị liệu", price: "400,000₫", duration: "60 phút" }
      ]
    }
  ];

  const packages = [
    {
      name: "Gói khám sức khỏe cơ bản",
      price: "1,500,000₫",
      duration: "3 giờ",
      services: [
        "Khám tổng quát",
        "Xét nghiệm máu cơ bản",
        "Xét nghiệm nước tiểu",
        "Chụp X-quang phổi",
        "Siêu âm tổng quát"
      ],
      popular: false
    },
    {
      name: "Gói khám sức khỏe toàn diện",
      price: "3,500,000₫",
      duration: "1 ngày",
      services: [
        "Khám tổng quát & chuyên khoa",
        "Xét nghiệm máu mở rộng",
        "Xét nghiệm hormone",
        "Chụp CT Scanner",
        "Siêu âm 4D",
        "Điện tâm đồ",
        "Đo mật độ xương"
      ],
      popular: true
    },
    {
      name: "Gói khám sức khỏe VIP",
      price: "6,000,000₫",
      duration: "2 ngày",
      services: [
        "Tất cả dịch vụ gói toàn diện",
        "Chụp MRI",
        "Xét nghiệm gen",
        "Tư vấn dinh dưỡng cá nhân",
        "Khám bởi giáo sư",
        "Phòng nghỉ VIP",
        "Đưa đón bằng xe riêng"
      ],
      popular: false
    }
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
                  bgcolor: item.path === "/public/services" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
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
            Dịch vụ Y tế
          </Typography>
          <Typography variant="h6" sx={{ color: "#90b4ce", maxWidth: 600 }}>
            Hệ thống dịch vụ y tế đa dạng, chất lượng cao với công nghệ hiện đại
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Loading state */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Đang tải danh sách dịch vũ...</Typography>
          </Box>
        )}

        {/* Error state */}
        {error && (
          <Box display="flex" justifyContent="center" py={4}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* Danh sách dịch vụ từ API */}
        {!loading && !error && services.length > 0 && (
          <>
            <Typography variant="h4" gutterBottom sx={{ color: "#094067", fontWeight: 600, mb: 4 }}>
              Bảng giá dịch vụ ({services.length} dịch vụ)
            </Typography>
            
            <Paper sx={{ mb: 6, overflow: "hidden" }}>
              <Box 
                sx={{ 
                  bgcolor: "#3da9fc", 
                  color: "#fff", 
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2
                }}
              >
                <MedicalServices />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Dịch vụ y tế
                </Typography>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Tên dịch vụ</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Giá dịch vụ</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Mã dịch vụ</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.MaDichVu} hover>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {service.TenDichVu}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body1" sx={{ fontWeight: 600, color: "#3da9fc" }}>
                            {formatPrice(service.GiaDichVu)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary">
                            {service.MaDichVu.slice(0, 8)}...
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => navigate("/login")}
                            sx={{
                              bgcolor: "#3da9fc",
                              "&:hover": { bgcolor: "#2b8fd1" }
                            }}
                          >
                            Đặt lịch
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}

        {/* Call to action */}
        <Paper sx={{ p: 4, textAlign: "center", bgcolor: "#f0f8ff" }}>
          <Typography variant="h5" gutterBottom sx={{ color: "#094067", fontWeight: 600 }}>
            Cần tư vấn về dịch vụ phù hợp?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "#666" }}>
            Liên hệ với chúng tôi để được tư vấn miễn phí về gói dịch vụ phù hợp nhất
          </Typography>
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/register")}
              sx={{ bgcolor: "#3da9fc", "&:hover": { bgcolor: "#2b8fd1" } }}
            >
              Đăng ký dịch vụ
            </Button>
            <Button
              variant="outlined"
              size="large"
              href="tel:19001234"
              sx={{ borderColor: "#094067", color: "#094067" }}
            >
              Tư vấn hotline
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PublicServices;
