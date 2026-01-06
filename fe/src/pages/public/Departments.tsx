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
  Biotech,
  LocalHospital,
  People,
  CheckCircle,
  MedicalServices,
  Healing,
  Psychology,
  ChildCare,
  Visibility,
  Hearing,
  FitnessCenter,
  Vaccines,
  Home,
  Hotel,
  Phone
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const PublicDepartments: FC = () => {
  const navigate = useNavigate();

  const navigationItems = [
    { label: "Trang chủ", icon: <Home />, path: "/" },
    { label: "Bác sĩ", icon: <MedicalServices />, path: "/public/doctors" },
    { label: "Chuyên khoa", icon: <Biotech />, path: "/public/departments" },
    { label: "Dịch vụ", icon: <LocalHospital />, path: "/public/services" },
    { label: "Nội trú", icon: <Hotel />, path: "/public/inpatient" },
    { label: "Liên hệ", icon: <Phone />, path: "/contact" }
  ];

  const departments = [
    {
      id: 1,
      name: "Khoa Tim mạch",
      description: "Chuyên điều trị các bệnh lý về tim mạch, mạch máu",
      icon: <LocalHospital />,
      services: [
        "Siêu âm tim",
        "Điện tâm đồ",
        "Holter tim",
        "Thông tim",
        "Phẫu thuật tim hở",
        "Đặt máy tạo nhịp tim"
      ],
      doctors: 8,
      beds: 25,
      established: "2010",
      color: "#e74c3c"
    },
    {
      id: 2,
      name: "Khoa Nhi",
      description: "Chăm sóc sức khỏe toàn diện cho trẻ em từ 0-16 tuổi",
      icon: <ChildCare />,
      services: [
        "Khám tổng quát trẻ em",
        "Tiêm chủng",
        "Dinh dưỡng trẻ em",
        "Điều trị bệnh nhiễm trùng",
        "Theo dõi phát triển",
        "Cấp cứu nhi khoa"
      ],
      doctors: 12,
      beds: 30,
      established: "2008",
      color: "#f39c12"
    },
    {
      id: 3,
      name: "Khoa Thần kinh",
      description: "Chẩn đoán và điều trị các bệnh lý thần kinh",
      icon: <Psychology />,
      services: [
        "Chụp CT, MRI não",
        "Điện não đồ",
        "Điều trị đột quỵ",
        "Điều trị động kinh",
        "Phục hồi chức năng",
        "Tư vấn tâm lý"
      ],
      doctors: 6,
      beds: 20,
      established: "2012",
      color: "#9b59b6"
    },
    {
      id: 4,
      name: "Khoa Sản phụ khoa",
      description: "Chăm sóc sức khỏe sinh sản và phụ khoa",
      icon: <Healing />,
      services: [
        "Khám thai định kỳ",
        "Siêu âm 4D",
        "Sinh thường",
        "Sinh mổ",
        "Điều trị vô sinh",
        "Phẫu thuật nội soi"
      ],
      doctors: 10,
      beds: 35,
      established: "2009",
      color: "#e91e63"
    },
    {
      id: 5,
      name: "Khoa Ngoại tổng hợp",
      description: "Phẫu thuật các bệnh lý ngoại khoa",
      icon: <MedicalServices />,
      services: [
        "Phẫu thuật ổ bụng",
        "Phẫu thuật nội soi",
        "Điều trị chấn thương",
        "Phẫu thuật tuyến giáp",
        "Phẫu thuật ruột thừa",
        "Điều trị ung thư"
      ],
      doctors: 15,
      beds: 40,
      established: "2007",
      color: "#27ae60"
    },
    {
      id: 6,
      name: "Khoa Mắt",
      description: "Chẩn đoán và điều trị các bệnh lý về mắt",
      icon: <Visibility />,
      services: [
        "Đo thị lực",
        "Đo nhãn áp",
        "Chụp đáy mắt",
        "Phẫu thuật đục thủy tinh thể",
        "Điều trị tăng nhãn áp",
        "Phẫu thuật khúc xạ"
      ],
      doctors: 5,
      beds: 15,
      established: "2015",
      color: "#3498db"
    },
    {
      id: 7,
      name: "Khoa Tai mũi họng",
      description: "Điều trị các bệnh lý tai mũi họng",
      icon: <Hearing />,
      services: [
        "Đo thính lực",
        "Nội soi tai mũi họng",
        "Phẫu thuật amidan",
        "Điều trị viêm xoang",
        "Phẫu thuật polyp mũi",
        "Điều trị ngủ ngáy"
      ],
      doctors: 4,
      beds: 12,
      established: "2013",
      color: "#f1c40f"
    },
    {
      id: 8,
      name: "Khoa Chấn thương chỉnh hình",
      description: "Điều trị chấn thương và bệnh lý xương khớp",
      icon: <FitnessCenter />,
      services: [
        "Nắn xương gãy",
        "Phẫu thuật xương khớp",
        "Điều trị thoái hóa khớp",
        "Phục hồi chức năng",
        "Điều trị chấn thương thể thao",
        "Cấy ghép xương"
      ],
      doctors: 8,
      beds: 28,
      established: "2011",
      color: "#95a5a6"
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
                  bgcolor: item.path === "/public/departments" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
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
            Các Khoa - Chuyên môn
          </Typography>
          <Typography variant="h6" sx={{ color: "#90b4ce", maxWidth: 600 }}>
            Hệ thống khoa chuyên môn đầy đủ với trang thiết bị hiện đại, đội ngũ bác sĩ giàu kinh nghiệm
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Thống kê tổng quan */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h3" sx={{ color: "#3da9fc", fontWeight: 700 }}>
                {departments.length}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Khoa chuyên môn
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h3" sx={{ color: "#27ae60", fontWeight: 700 }}>
                {departments.reduce((total, dept) => total + dept.doctors, 0)}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Bác sĩ chuyên khoa
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h3" sx={{ color: "#e74c3c", fontWeight: 700 }}>
                {departments.reduce((total, dept) => total + dept.beds, 0)}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Giường bệnh
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h3" sx={{ color: "#f39c12", fontWeight: 700 }}>
                24/7
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Cấp cứu
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Danh sách khoa */}
        <Typography variant="h4" gutterBottom sx={{ color: "#094067", fontWeight: 600, mb: 4 }}>
          Danh sách các khoa
        </Typography>
        
        <Grid container spacing={4}>
          {departments.map((department) => (
            <Grid item xs={12} md={6} key={department.id}>
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
                        bgcolor: department.color,
                        color: "#fff"
                      }}
                    >
                      {department.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#094067" }}>
                        {department.name}
                      </Typography>
                      <Chip 
                        label={`Thành lập ${department.established}`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {department.description}
                  </Typography>
                  
                  <Box display="flex" gap={3} mb={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <People sx={{ fontSize: 16, color: "#666" }} />
                      <Typography variant="body2" color="text.secondary">
                        {department.doctors} bác sĩ
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocalHospital sx={{ fontSize: 16, color: "#666" }} />
                      <Typography variant="body2" color="text.secondary">
                        {department.beds} giường
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#094067" }}>
                    Dịch vụ chính:
                  </Typography>
                  <List dense>
                    {department.services.slice(0, 4).map((service, index) => (
                      <ListItem key={index} sx={{ py: 0, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <CheckCircle sx={{ fontSize: 16, color: "#27ae60" }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={service}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                    ))}
                    {department.services.length > 4 && (
                      <ListItem sx={{ py: 0, px: 0 }}>
                        <ListItemText 
                          primary={`... và ${department.services.length - 4} dịch vụ khác`}
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
                      bgcolor: department.color,
                      "&:hover": { 
                        bgcolor: department.color,
                        filter: "brightness(0.9)"
                      }
                    }}
                  >
                    Đặt lịch khám
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Call to action */}
        <Paper sx={{ p: 4, mt: 6, textAlign: "center", bgcolor: "#f0f8ff" }}>
          <Typography variant="h5" gutterBottom sx={{ color: "#094067", fontWeight: 600 }}>
            Cần tư vấn về chuyên khoa phù hợp?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "#666" }}>
            Liên hệ hotline 1900-1234 để được tư vấn miễn phí về chuyên khoa phù hợp với tình trạng sức khỏe
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
              Gọi hotline
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PublicDepartments;
