import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  TablePagination
} from '@mui/material';
import {
  CalendarMonth,
  People,
  CheckCircle,
  Schedule,
  Refresh,
  Search,
  Visibility
} from '@mui/icons-material';
import { dashboardAPI } from '../../utils/api/dashboardAPI';
import axiosInstance from '../../utils/axiosCustomize';

// Types
interface ChiTietLich {
  MaLich: string;
  MaBN: string;
  NgayDat: string;
  DonGia: string;
  TrangThai: 'Pending' | 'Accept' | 'Cancel' | 'Done';
  Lich?: {
    MaLich: string;
    SoBNHienTai: number;
    SoBNToiDa: number;
    Ngay: string;
    Buoi: 'Sang' | 'Chieu';
    Gia: string;
    MaNV: string;
  };
  BenhNhan?: {
    MaBN: string;
    HoTen: string;
    Email: string;
  };
}

interface SupportStats {
  totalAppointments: number;
  pendingAppointments: number;
  acceptAppointments: number;
  cancelAppointments: number;
  doneAppointments: number;
  todayAppointments: number;
}

const SupportDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<ChiTietLich[]>([]);
  const [stats, setStats] = useState<SupportStats>({
    totalAppointments: 0,
    pendingAppointments: 0,
    acceptAppointments: 0,
    cancelAppointments: 0,
    doneAppointments: 0,
    todayAppointments: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Lấy tất cả chi tiết lịch từ API
      const appointmentsResponse = await axiosInstance.get('/api/v1/chitietdatlich/all');
      console.log('Dashboard API Response:', appointmentsResponse);
      
      const appointmentsData = appointmentsResponse.data || [];
      setAppointments(appointmentsData);
      
      // Tính toán thống kê
      const today = new Date().toISOString().split('T')[0];
      const stats: SupportStats = {
        totalAppointments: appointmentsData.length,
        pendingAppointments: appointmentsData.filter((apt: ChiTietLich) => apt.TrangThai === 'Pending').length,
        acceptAppointments: appointmentsData.filter((apt: ChiTietLich) => apt.TrangThai === 'Accept').length,
        cancelAppointments: appointmentsData.filter((apt: ChiTietLich) => apt.TrangThai === 'Cancel').length,
        doneAppointments: appointmentsData.filter((apt: ChiTietLich) => apt.TrangThai === 'Done').length,
        todayAppointments: appointmentsData.filter((apt: ChiTietLich) => 
          apt.NgayDat && apt.NgayDat.split('T')[0] === today
        ).length
      };
      
      setStats(stats);
    } catch (error) {
      console.error('Error loading support dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Accept':
        return 'success';
      case 'Cancel':
        return 'error';
      case 'Done':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Chờ xác nhận';
      case 'Accept':
        return 'Đã chấp nhận';
      case 'Cancel':
        return 'Đã hủy';
      case 'Done':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.MaLich.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.TrangThai.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedAppointments = filteredAppointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
            Dashboard Hỗ Trợ
          </Typography>
          <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
            Tổng quan thông tin chi tiết lịch khám và hỗ trợ bệnh nhân
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadData}
          sx={{
            borderColor: "#3da9fc",
            color: "#3da9fc",
            "&:hover": { 
              borderColor: "#2b8fd1",
              backgroundColor: "rgba(61, 169, 252, 0.04)"
            }
          }}
        >
          Làm mới
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #3da9fc" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CalendarMonth sx={{ fontSize: 40, color: "#3da9fc" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {stats.totalAppointments}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng lịch hẹn
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #ffc107" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Schedule sx={{ fontSize: 40, color: "#ffc107" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {stats.pendingAppointments}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Chờ xác nhận
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #28a745" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CheckCircle sx={{ fontSize: 40, color: "#28a745" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {stats.acceptAppointments}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Đã chấp nhận
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #dc3545" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <People sx={{ fontSize: 40, color: "#dc3545" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {stats.cancelAppointments}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Đã hủy
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #17a2b8" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CheckCircle sx={{ fontSize: 40, color: "#17a2b8" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {stats.doneAppointments}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Hoàn thành
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #e74c3c" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CalendarMonth sx={{ fontSize: 40, color: "#e74c3c" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {stats.todayAppointments}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Hôm nay
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Appointments Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <CardContent>
          <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600 }}>
              Danh sách chi tiết lịch hẹn
            </Typography>
            <TextField
              size="small"
              placeholder="Tìm kiếm theo mã lịch, trạng thái..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#5f6c7b" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 350 }}
            />
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Mã lịch</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ngày khám</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Buổi</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Đơn giá</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAppointments.map((appointment) => (
                  <TableRow key={`${appointment.MaLich}-${appointment.MaBN}`} hover>
                    <TableCell>{appointment.MaLich}</TableCell>
                    <TableCell>
                      {appointment.Lich?.Ngay ? 
                        new Date(appointment.Lich.Ngay).toLocaleDateString('vi-VN') : 'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={appointment.Lich?.Buoi === 'Sang' ? 'Sáng' : 'Chiều'} 
                        size="small"
                        color={appointment.Lich?.Buoi === 'Sang' ? 'primary' : 'secondary'}
                      />
                    </TableCell>
                    <TableCell>
                      {Number(appointment.DonGia).toLocaleString('vi-VN')} VNĐ
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusText(appointment.TrangThai)} 
                        color={getStatusColor(appointment.TrangThai) as any}
                        size="small"
                      />
                    </TableCell>
                  
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAppointments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default SupportDashboard;
