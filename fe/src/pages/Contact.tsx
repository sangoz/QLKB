import { FC } from "react";
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  Schedule,
  ArrowBack,
  MedicalServices,
  Home,
  Biotech,
  LocalHospital,
  Hotel,
  Emergency,
  DirectionsCar,
  Accessible
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Contact: FC = () => {
  const navigate = useNavigate();

  const navigationItems = [
    { label: "Trang chủ", icon: <Home />, path: "/" },
    { label: "Bác sĩ", icon: <MedicalServices />, path: "/public/doctors" },
    { label: "Dịch vụ", icon: <LocalHospital />, path: "/public/services" },
    { label: "Liên hệ", icon: <Phone />, path: "/contact" }
  ];

  const contactInfo = [
    {
      title: "Địa chỉ",
      icon: <LocationOn sx={{ color: "#3da9fc" }} />,
      details: [
        "123 Đường Lê Lợi, Quận 1, TP.HCM",
        "Gần công viên Lê Văn Tám",
        "Đối diện bệnh viện Chợ Rẫy"
      ]
    },
    {
      title: "Điện thoại",
      icon: <Phone sx={{ color: "#27ae60" }} />,
      details: [
        "Hotline: 1900-1234 (24/7)",
        "Đặt lịch: (028) 3822-1234",
        "Cấp cứu: (028) 3822-1111"
      ]
    },
    {
      title: "Email",
      icon: <Email sx={{ color: "#e74c3c" }} />,
      details: [
        "info@benhviendakhoa.vn",
        "datlich@benhviendakhoa.vn",
        "capucu@benhviendakhoa.vn"
      ]
    },
    {
      title: "Giờ làm việc",
      icon: <Schedule sx={{ color: "#f39c12" }} />,
      details: [
        "Thứ 2 - Thứ 6: 7:00 - 17:00",
        "Thứ 7: 7:00 - 12:00",
        "Chủ nhật: 8:00 - 12:00",
        "Cấp cứu: 24/7"
      ]
    }
  ];

  const departments = [
    { name: "Khoa Cấp cứu", phone: "(028) 3822-1111", floor: "Tầng trệt" },
    { name: "Khoa Nội", phone: "(028) 3822-1122", floor: "Tầng 2" },
    { name: "Khoa Ngoại", phone: "(028) 3822-1133", floor: "Tầng 3" },
    { name: "Khoa Sản", phone: "(028) 3822-1144", floor: "Tầng 4" },
    { name: "Khoa Nhi", phone: "(028) 3822-1155", floor: "Tầng 5" },
    { name: "Khoa Tim mạch", phone: "(028) 3822-1166", floor: "Tầng 6" }
  ];

  const facilities = [
    { name: "Bãi đỗ xe", icon: <DirectionsCar />, description: "200 chỗ đỗ xe miễn phí" },
    { name: "Tiếp cận khuyết tật", icon: <Accessible />, description: "Thang máy và đường dốc" },
    { name: "Cấp cứu 24/7", icon: <Emergency />, description: "Dịch vụ cấp cứu liên tục" }
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
                  bgcolor: item.path === "/contact" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
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
            Liên hệ với chúng tôi
          </Typography>
          <Typography variant="h6" sx={{ color: "#90b4ce", maxWidth: 600 }}>
            Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn về các dịch vụ y tế
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Thông tin liên hệ chính */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                height: "100%",
                textAlign: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 20px rgba(9, 64, 103, 0.15)"
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {info.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#094067" }}>
                    {info.title}
                  </Typography>
                  {info.details.map((detail, detailIndex) => (
                    <Typography 
                      key={detailIndex} 
                      variant="body2" 
                      sx={{ mb: 0.5, color: "#666" }}
                    >
                      {detail}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Danh sách khoa */}
        <Typography variant="h4" gutterBottom sx={{ color: "#094067", fontWeight: 600, mb: 4 }}>
          Liên hệ trực tiếp các khoa
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {departments.map((dept, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#094067", mb: 1 }}>
                  {dept.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {dept.floor}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Phone sx={{ fontSize: 16, color: "#3da9fc" }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {dept.phone}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Tiện ích */}
        <Typography variant="h4" gutterBottom sx={{ color: "#094067", fontWeight: 600, mb: 4 }}>
          Tiện ích tại bệnh viện
        </Typography>
        
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {facilities.map((facility, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper sx={{ p: 3, textAlign: "center", height: "100%" }}>
                <Box sx={{ mb: 2, color: "#3da9fc" }}>
                  {facility.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#094067" }}>
                  {facility.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {facility.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Hướng dẫn đến bệnh viện */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ color: "#094067", fontWeight: 600 }}>
            Hướng dẫn đến bệnh viện
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#094067" }}>
                Bằng xe buýt:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Tuyến 01: Bến Thành - Chợ Lớn" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Tuyến 18: Bến xe Miền Đông - Bình Triệu" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Tuyến 152: Ngã tư Hàng Xanh - Bến xe An Sương" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#094067" }}>
                Bằng xe máy/ô tô:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Từ sân bay Tân Sơn Nhất: 30 phút" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Từ bến xe Miền Đông: 25 phút" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Từ ga Sài Gòn: 15 phút" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>

        {/* Call to action */}
        <Paper sx={{ p: 4, textAlign: "center", bgcolor: "#f0f8ff" }}>
          <Typography variant="h5" gutterBottom sx={{ color: "#094067", fontWeight: 600 }}>
            Cần hỗ trợ khẩn cấp?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "#666" }}>
            Liên hệ ngay với chúng tôi để được hỗ trợ nhanh chóng
          </Typography>
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<Phone />}
              href="tel:19001234"
              sx={{ bgcolor: "#e74c3c", "&:hover": { bgcolor: "#c0392b" } }}
            >
              Gọi cấp cứu: 1900-1234
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/register")}
              sx={{ borderColor: "#094067", color: "#094067" }}
            >
              Đặt lịch khám
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Contact;
