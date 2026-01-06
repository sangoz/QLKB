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
  Chip,
  AppBar,
  Toolbar
} from "@mui/material";
import {
  Hotel,
  People,
  LocalHospital,
  CheckCircle,
  Star,
  Wifi,
  Restaurant,
  Tv,
  AcUnit,
  Emergency,
  DirectionsCar,
  Accessible,
  Home,
  MedicalServices,
  Biotech,
  Phone
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const PublicInpatient: FC = () => {
  const navigate = useNavigate();

  const navigationItems = [
    { label: "Trang chủ", icon: <Home />, path: "/" },
    { label: "Bác sĩ", icon: <MedicalServices />, path: "/public/doctors" },
    // { label: "Chuyên khoa", icon: <Biotech />, path: "/public/departments" },
    { label: "Dịch vụ", icon: <LocalHospital />, path: "/public/services" },
    // { label: "Nội trú", icon: <Hotel />, path: "/public/inpatient" },
    { label: "Liên hệ", icon: <Phone />, path: "/contact" }
  ];

  const roomTypes = [
    {
      id: 1,
      name: "Phòng VIP",
      description: "Phòng đơn cao cấp với tiện nghi 5 sao",
      price: "2,000,000₫/ngày",
      beds: 1,
      features: [
        "Phòng riêng biệt",
        "Giường điện tử cao cấp",
        "TV màn hình lớn",
        "Tủ lạnh mini",
        "Sofa cho người nhà",
        "Phòng tắm riêng",
        "Dịch vụ room service",
        "Wifi miễn phí"
      ],
      amenities: [
        { icon: <Wifi />, name: "Wifi miễn phí" },
        { icon: <Restaurant />, name: "Room service" },
        { icon: <Tv />, name: "TV Cable" },
        { icon: <AcUnit />, name: "Điều hòa" }
      ],
      color: "#e74c3c",
      available: 8
    },
    {
      id: 2,
      name: "Phòng đơn",
      description: "Phòng đơn tiêu chuẩn thoải mái",
      price: "800,000₫/ngày",
      beds: 1,
      features: [
        "Phòng riêng",
        "Giường y tế tiêu chuẩn",
        "TV",
        "Bàn làm việc",
        "Tủ quần áo",
        "Phòng tắm riêng",
        "Wifi miễn phí"
      ],
      amenities: [
        { icon: <Wifi />, name: "Wifi miễn phí" },
        { icon: <Tv />, name: "TV" },
        { icon: <AcUnit />, name: "Điều hòa" }
      ],
      color: "#3da9fc",
      available: 15
    },
    {
      id: 3,
      name: "Phòng đôi",
      description: "Phòng 2 giường chia sẻ tiết kiệm",
      price: "500,000₫/ngày",
      beds: 2,
      features: [
        "2 giường y tế",
        "Rèm ngăn riêng tư",
        "TV chung",
        "Tủ cá nhân",
        "Phòng tắm chung",
        "Wifi miễn phí"
      ],
      amenities: [
        { icon: <Wifi />, name: "Wifi miễn phí" },
        { icon: <Tv />, name: "TV chung" },
        { icon: <AcUnit />, name: "Điều hòa" }
      ],
      color: "#27ae60",
      available: 20
    },
    {
      id: 4,
      name: "Phòng tập thể",
      description: "Phòng nhiều giường dành cho điều trị dài hạn",
      price: "300,000₫/ngày",
      beds: 6,
      features: [
        "6-8 giường y tế",
        "Không gian rộng rãi",
        "TV chung",
        "Tủ cá nhân",
        "Phòng tắm chung",
        "Khu vực sinh hoạt chung"
      ],
      amenities: [
        { icon: <Wifi />, name: "Wifi miễn phí" },
        { icon: <Tv />, name: "TV chung" },
        { icon: <People />, name: "Khu sinh hoạt" }
      ],
      color: "#f39c12",
      available: 25
    }
  ];

  const facilities = [
    {
      name: "Hệ thống báo gọy y tá",
      description: "Hệ thống báo gọi khẩn cấp 24/7"
    },
    {
      name: "Phòng ăn tập thể",
      description: "Khu vực ăn uống chung thoải mái"
    },
    {
      name: "Khu vực thăm bệnh",
      description: "Không gian đón tiếp thân nhân"
    },
    {
      name: "Thang máy y tế",
      description: "Thang máy chuyên dụng cho bệnh nhân"
    },
    {
      name: "Hệ thống an ninh",
      description: "Camera giám sát và bảo vệ 24/7"
    },
    {
      name: "Bãi đỗ xe",
      description: "Bãi đỗ xe miễn phí cho thân nhân"
    }
  ];

  const services = [
    "Chăm sóc y tế 24/7",
    "Dịch vụ ăn uống 3 bữa/ngày",
    "Giặt ủi đồ bệnh nhân",
    "Dọn vệ sinh phòng hàng ngày",
    "Hỗ trợ vật lý trị liệu",
    "Tư vấn tâm lý",
    "Dịch vụ tôn giáo",
    "Thủ tục xuất viện"
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
                  bgcolor: item.path === "/public/inpatient" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
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
            Nội trú - Nhập viện
          </Typography>
          <Typography variant="h6" sx={{ color: "#90b4ce", maxWidth: 600 }}>
            Hệ thống phòng bệnh hiện đại với nhiều lựa chọn phù hợp mọi nhu cầu và điều kiện
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Thống kê tổng quan */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h3" sx={{ color: "#3da9fc", fontWeight: 700 }}>
                {roomTypes.reduce((total, room) => total + room.available, 0)}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Phòng bệnh
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h3" sx={{ color: "#27ae60", fontWeight: 700 }}>
                200
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Giường bệnh
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h3" sx={{ color: "#e74c3c", fontWeight: 700 }}>
                24/7
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Chăm sóc
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h3" sx={{ color: "#f39c12", fontWeight: 700 }}>
                4
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Loại phòng
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Loại phòng */}
        <Typography variant="h4" gutterBottom sx={{ color: "#094067", fontWeight: 600, mb: 4 }}>
          Các loại phòng bệnh
        </Typography>
        
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {roomTypes.map((room) => (
            <Grid item xs={12} md={6} key={room.id}>
              <Card 
                sx={{ 
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(9, 64, 103, 0.15)"
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box 
                      sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        bgcolor: room.color,
                        color: "#fff"
                      }}
                    >
                      <Hotel />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#094067" }}>
                        {room.name}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: room.color }}>
                        {room.price}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {room.description}
                  </Typography>
                  
                  <Box display="flex" gap={2} mb={3}>
                    <Chip 
                      icon={<Hotel />}
                      label={`${room.beds} giường`}
                      variant="outlined"
                      size="small"
                    />
                    <Chip 
                      icon={<CheckCircle />}
                      label={`${room.available} phòng trống`}
                      variant="outlined"
                      size="small"
                      sx={{ color: "#27ae60", borderColor: "#27ae60" }}
                    />
                  </Box>
                  
                  {/* Tiện ích */}
                  <Box display="flex" gap={1} mb={3} flexWrap="wrap">
                    {room.amenities.map((amenity, index) => (
                      <Box 
                        key={index}
                        display="flex" 
                        alignItems="center" 
                        gap={0.5}
                        sx={{ 
                          bgcolor: "#f5f5f5", 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1,
                          fontSize: "0.75rem"
                        }}
                      >
                        {amenity.icon}
                        <Typography variant="caption">
                          {amenity.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#094067" }}>
                    Tiện nghi bao gồm:
                  </Typography>
                  <List dense>
                    {room.features.slice(0, 4).map((feature, index) => (
                      <ListItem key={index} sx={{ py: 0, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <CheckCircle sx={{ fontSize: 16, color: "#27ae60" }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                    ))}
                    {room.features.length > 4 && (
                      <ListItem sx={{ py: 0, px: 0 }}>
                        <ListItemText 
                          primary={`... và ${room.features.length - 4} tiện nghi khác`}
                          primaryTypographyProps={{ 
                            variant: "body2", 
                            fontStyle: "italic",
                            color: "text.secondary"
                          }}
                        />
                      </ListItem>
                    )}
                  </List>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate("/login")}
                    sx={{
                      mt: 2,
                      bgcolor: room.color,
                      "&:hover": { 
                        bgcolor: room.color,
                        filter: "brightness(0.9)"
                      }
                    }}
                  >
                    Đặt phòng ngay
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tiện ích chung */}
        <Typography variant="h4" gutterBottom sx={{ color: "#094067", fontWeight: 600, mb: 4 }}>
          Tiện ích chung
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {facilities.map((facility, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <LocalHospital sx={{ color: "#3da9fc" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#094067" }}>
                    {facility.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {facility.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Dịch vụ nội trú */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
            Dịch vụ nội trú
          </Typography>
          <Grid container spacing={2}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Star sx={{ fontSize: 16, color: "#27ae60" }} />
                  <Typography variant="body2">
                    {service}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Call to action */}
        <Paper sx={{ p: 4, textAlign: "center", bgcolor: "#f0f8ff" }}>
          <Typography variant="h5" gutterBottom sx={{ color: "#094067", fontWeight: 600 }}>
            Cần tư vấn về nhập viện?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "#666" }}>
            Liên hệ với chúng tôi để được tư vấn chi tiết về các loại phòng và thủ tục nhập viện
          </Typography>
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/register")}
              sx={{ bgcolor: "#3da9fc", "&:hover": { bgcolor: "#2b8fd1" } }}
            >
              Đăng ký khám bệnh
            </Button>
            <Button
              variant="outlined"
              size="large"
              href="tel:19001234"
              sx={{ borderColor: "#094067", color: "#094067" }}
            >
              Hotline tư vấn
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PublicInpatient;
