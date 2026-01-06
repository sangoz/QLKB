import { FC, useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip
} from "@mui/material";
import {
  People,
  LocalHospital,
  MedicalServices,
  AttachMoney,
  TrendingUp,
  Assignment,
  Business,
  Inventory
} from "@mui/icons-material";
import { dashboardAPI, Lich, HoaDon, NhanVien, PhongBenh, Khoa, BenhNhan } from "../../utils/api/dashboardAPI";

const AdminDashboard: FC = () => {
  const [systemStats, setSystemStats] = useState({
    totalEmployees: 0,
    totalPatients: 0,
    totalDepartments: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    activeAppointments: 0,
    totalRooms: 0,
    occupiedRooms: 0
  });

  const [recentActivities, setRecentActivities] = useState<HoaDon[]>([]);
  const [departmentStats, setDepartmentStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load all data in parallel
      const [lichData, hoaDonData, nhanVienData, phongBenhData, khoaData, benhNhanData] = await Promise.all([
        dashboardAPI.getAllLich(),
        dashboardAPI.getAllHoaDon(),
        dashboardAPI.getAllNhanVien(),
        dashboardAPI.getAllPhongBenh(),
        dashboardAPI.getAllKhoa(),
        dashboardAPI.getAllBenhNhan()
      ]);

      // Calculate system stats from real data
      const totalEmployees = nhanVienData.length;
      const totalPatients = benhNhanData.length;
      const totalDepartments = khoaData.length;
      const totalRooms = phongBenhData.length;
      const occupiedRooms = phongBenhData.filter(room => room.SoBNHienTai > 0).length;
      const activeAppointments = lichData.filter(lich => lich.SoBNHienTai > 0).length;
      
      // Calculate revenue from invoices
      const totalRevenue = hoaDonData.reduce((sum, hd) => sum + Number(hd.TongTien), 0);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = hoaDonData
        .filter(hd => {
          const hdDate = new Date(hd.NgayTao);
          return hdDate.getMonth() === currentMonth && hdDate.getFullYear() === currentYear;
        })
        .reduce((sum, hd) => sum + Number(hd.TongTien), 0);

      setSystemStats({
        totalEmployees,
        totalPatients,
        totalDepartments,
        totalRevenue,
        monthlyRevenue,
        activeAppointments,
        totalRooms,
        occupiedRooms
      });

      // Set recent activities (using recent invoices as activities)
      const recentHoaDon = hoaDonData
        .sort((a, b) => new Date(b.NgayTao).getTime() - new Date(a.NgayTao).getTime())
        .slice(0, 8);
      setRecentActivities(recentHoaDon);

      // Calculate department stats - improved logic
      const deptStats = khoaData.map(khoa => {
        const employeesInDept = nhanVienData.filter(nv => nv.MaKhoaId === khoa.MaKhoa).length;
        
        // Calculate patients in department based on room assignments
        const roomsInDept = phongBenhData.filter(room => {
          // Find employee managing this room and check their department
          const roomManager = nhanVienData.find(nv => nv.MaNV === room.MaNV);
          return roomManager?.MaKhoaId === khoa.MaKhoa;
        });
        const patientsInDept = roomsInDept.reduce((sum, room) => sum + room.SoBNHienTai, 0);
        
        return {
          MaKhoa: khoa.MaKhoa,
          TenKhoa: khoa.TenKhoa,
          NhanVienCount: employeesInDept,
          BenhNhanCount: patientsInDept
        };
      });
      setDepartmentStats(deptStats);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Tổng nhân viên",
      value: systemStats.totalEmployees,
      icon: <People sx={{ fontSize: 40, color: "#3da9fc" }} />,
      color: "#3da9fc",
      trend: `${systemStats.totalEmployees} nhân viên đang làm việc`
    },
    {
      title: "Tổng bệnh nhân",
      value: systemStats.totalPatients,
      icon: <LocalHospital sx={{ fontSize: 40, color: "#28a745" }} />,
      color: "#28a745",
      trend: `${systemStats.totalPatients} bệnh nhân trong hệ thống`
    },
    {
      title: "Doanh thu tháng",
      value: `${systemStats.monthlyRevenue.toLocaleString('vi-VN')}đ`,
      icon: <AttachMoney sx={{ fontSize: 40, color: "#ef4565" }} />,
      color: "#ef4565",
      trend: `${Math.round((systemStats.monthlyRevenue / (systemStats.totalRevenue || 1)) * 100)}% tổng doanh thu`
    },
    {
      title: "Lịch đang hoạt động",
      value: systemStats.activeAppointments,
      icon: <Assignment sx={{ fontSize: 40, color: "#90b4ce" }} />,
      color: "#90b4ce",
      trend: `${systemStats.activeAppointments} lịch có bệnh nhân đặt`
    }
  ];

  const quickStats = [
    {
      label: "Khoa",
      value: systemStats.totalDepartments,
      icon: <Business sx={{ color: "#3da9fc" }} />
    },
    {
      label: "Phòng bệnh",
      value: systemStats.totalRooms,
      icon: <MedicalServices sx={{ color: "#28a745" }} />
    },
    {
      label: "Phòng đang sử dụng",
      value: systemStats.occupiedRooms,
      icon: <Inventory sx={{ color: "#ef4565" }} />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Dashboard Ban Giám Đốc
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Tổng quan hệ thống bệnh viện Y Dược TP.HCM {loading && "(Đang tải...)"}
        </Typography>
        {error && (
          <Typography variant="body2" sx={{ color: "#ef4565", mt: 1, fontStyle: 'italic' }}>
            {error}
          </Typography>
        )}
      </Box>

      {/* Main Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(9, 64, 103, 0.1)",
              borderLeft: `4px solid ${stat.color}`,
              "&:hover": {
                transform: "translateY(-2px)",
                transition: "transform 0.3s ease"
              }
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  {stat.icon}
                  <Box>
                    <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="#5f6c7b">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingUp sx={{ fontSize: 16, color: "#28a745" }} />
                  <Typography variant="body2" sx={{ color: "#28a745", fontSize: '0.75rem' }}>
                    {stat.trend}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Stats & Room Occupancy */}
        <Grid item xs={12} lg={4}>
          {/* Quick Stats */}
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)", mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
                Thống kê nhanh
              </Typography>
              
              {quickStats.map((item, index) => (
                <Box 
                  key={index}
                  display="flex" 
                  alignItems="center" 
                  justifyContent="space-between"
                  sx={{ 
                    py: 2, 
                    borderBottom: index < quickStats.length - 1 ? "1px solid #f0f0f0" : "none"
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    {item.icon}
                    <Typography variant="body1" color="#5f6c7b">
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600 }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Room Occupancy */}
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
                Tỷ lệ sử dụng phòng
              </Typography>
              
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="#5f6c7b">
                    Đã sử dụng
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    {systemStats.occupiedRooms}/{systemStats.totalRooms}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={systemStats.totalRooms > 0 ? (systemStats.occupiedRooms / systemStats.totalRooms) * 100 : 0}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: "#f0f0f0",
                    "& .MuiLinearProgress-bar": { bgcolor: "#ef4565" }
                  }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: "#ef4565", textAlign: "center" }}>
                {systemStats.totalRooms > 0 ? Math.round((systemStats.occupiedRooms / systemStats.totalRooms) * 100) : 0}% sử dụng
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Department Statistics */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
                Thống kê theo khoa
              </Typography>
              
              <Box>
                {departmentStats.length === 0 ? (
                  <Typography color="#5f6c7b" align="center" sx={{ py: 2 }}>
                    {loading ? "Đang tải dữ liệu..." : "Không có dữ liệu khoa"}
                  </Typography>
                ) : (
                  departmentStats.map((dept: any) => (
                    <Box 
                      key={dept.MaKhoa} 
                      sx={{ 
                        py: 2, 
                        borderBottom: "1px solid #f0f0f0",
                        "&:last-child": { borderBottom: "none" }
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle2" sx={{ color: "#094067", fontSize: '0.875rem' }}>
                          {dept.TenKhoa}
                        </Typography>
                        <Box display="flex" gap={1}>
                          <Chip 
                            label={`${dept.NhanVienCount} NV`}
                            size="small"
                            sx={{ bgcolor: "#3da9fc", color: "#fffffe", fontSize: '0.7rem', minWidth: '50px' }}
                          />
                          <Chip 
                            label={`${dept.BenhNhanCount} BN`}
                            size="small"
                            sx={{ bgcolor: "#28a745", color: "#fffffe", fontSize: '0.7rem', minWidth: '50px' }}
                          />
                        </Box>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={
                          departmentStats.length > 0 && Math.max(...departmentStats.map(d => d.BenhNhanCount)) > 0
                            ? Math.min((dept.BenhNhanCount / Math.max(...departmentStats.map(d => d.BenhNhanCount))) * 100, 100)
                            : 0
                        }
                        sx={{ 
                          height: 4, 
                          borderRadius: 2,
                          bgcolor: "#f0f0f0",
                          "& .MuiLinearProgress-bar": { bgcolor: "#3da9fc" }
                        }}
                      />
                      <Typography variant="caption" sx={{ color: "#5f6c7b", fontSize: '0.7rem', mt: 0.5 }}>
                        {dept.BenhNhanCount > 0 ? `${Math.round((dept.BenhNhanCount / Math.max(...departmentStats.map(d => d.BenhNhanCount), 1)) * 100)}% capacity` : 'Không có bệnh nhân'}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
                Hoạt động gần đây
              </Typography>
              
              <List dense>
                {recentActivities.length === 0 ? (
                  <ListItem>
                    <ListItemText 
                      primary={<Typography color="#5f6c7b" align="center">
                        {loading ? "Đang tải..." : "Không có hoạt động gần đây"}
                      </Typography>}
                    />
                  </ListItem>
                ) : (
                  recentActivities.slice(0, 8).map((hoadon: HoaDon) => (
                    <ListItem key={hoadon.MaHD} divider>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                              Hóa đơn #{hoadon.MaHD}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#ef4565", fontWeight: 600 }}>
                              {Number(hoadon.TongTien).toLocaleString('vi-VN')}đ
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" sx={{ color: "#5f6c7b" }}>
                              {new Date(hoadon.NgayTao).toLocaleDateString('vi-VN')} - {hoadon.PhuongThucThanhToan}
                            </Typography>
                            <br />
                            <Typography variant="caption" sx={{ color: "#5f6c7b" }}>
                              BN: {hoadon.MaBN} | NV: {hoadon.MaNV}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip 
                          label={hoadon.TrangThai}
                          size="small"
                          color={
                            hoadon.TrangThai === 'Completed' || hoadon.TrangThai === 'Hoàn thành' ? 'success' : 
                            hoadon.TrangThai === 'Pending' || hoadon.TrangThai === 'Chờ xử lý' ? 'warning' : 
                            'default'
                          }
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Financial Overview */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
                Tổng quan tài chính
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#f8f9fa" }}>
                    <AttachMoney sx={{ fontSize: 48, color: "#28a745", mb: 1 }} />
                    <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                      {systemStats.totalRevenue.toLocaleString('vi-VN')}đ
                    </Typography>
                    <Typography variant="body2" color="#5f6c7b">
                      Tổng doanh thu
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#f8f9fa" }}>
                    <TrendingUp sx={{ fontSize: 48, color: "#3da9fc", mb: 1 }} />
                    <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                      {systemStats.monthlyRevenue.toLocaleString('vi-VN')}đ
                    </Typography>
                    <Typography variant="body2" color="#5f6c7b">
                      Doanh thu tháng này
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#f8f9fa" }}>
                    <Assignment sx={{ fontSize: 48, color: "#ef4565", mb: 1 }} />
                    <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                      {Math.round((systemStats.monthlyRevenue / (systemStats.totalRevenue || 1)) * 100)}%
                    </Typography>
                    <Typography variant="body2" color="#5f6c7b">
                      Tỷ lệ tháng này
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
