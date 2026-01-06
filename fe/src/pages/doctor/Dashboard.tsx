import { FC, useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Avatar,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from "@mui/material";
import {
  LocalHospital,
  People,
  CalendarMonth,
  Assignment,
  AccessTime,
  MedicalServices,
  TrendingUp,
  Close as CloseIcon
} from "@mui/icons-material";
import { employeeAPI, scheduleAPI, medicalRecordAPI, patientAPI, appointmentAPI, phieuAPI } from "../../services/api";

const DoctorDashboard: FC = () => {
  const [todayStats, setTodayStats] = useState({
    scheduledPatients: 0,
    completedExams: 0,
    pendingExams: 0,
    totalWorkHours: 8,
    totalRevenue: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentDiagnoses, setRecentDiagnoses] = useState([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<any[]>([]);
  
  // Modal states
  const [showPatientsModal, setShowPatientsModal] = useState(false);
  const [showMedicalRecordModal, setShowMedicalRecordModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPhieuSearchModal, setShowPhieuSearchModal] = useState(false);
  const [allPatients, setAllPatients] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [allMedicalRecords, setAllMedicalRecords] = useState([]);
  
  // Form states
  const [medicalRecordForm, setMedicalRecordForm] = useState({
    TrieuChung: '',
    ChanDoan: '',
    NgayKham: new Date().toISOString().split('T')[0],
    MaBN: ''
  });
  const [phieuSearchForm, setPhieuSearchForm] = useState({
    searchType: 'CCCD', // CCCD hoặc MaBN
    searchValue: '',
    MaPhieu: ''
  });
  const [phieuList, setPhieuList] = useState<any[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      // Get current user info
      const userRes = await employeeAPI.getAccount();
      if (userRes?.data) {
        setCurrentUser(userRes.data);
        
        // Load dashboard data for this doctor
        await Promise.all([
          loadDoctorSchedules(userRes.data.MaNV),
          loadTodayStats(userRes.data.MaNV),
          loadTodayAppointments(userRes.data.MaNV),
          loadRecentDiagnoses(userRes.data.MaNV)
        ]);
      }
    } catch (error) {
      console.error("Error initializing dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctorSchedules = async (MaNV: string) => {
    try {
      console.log("Loading doctor schedules...");
      const apiUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${apiUrl}/api/v1/lich/bacsi/${MaNV}`);
      const data = await response.json();
      
      if (data && data.statusCode === 200 && data.data) {
        console.log("Received doctor schedules:", data.data);
        
        // Format the data for display
        const formattedSchedules = data.data.map((schedule: any) => ({
          MaLich: schedule.MaLich,
          Ngay: schedule.Ngay,
          Buoi: schedule.Buoi,
          SoBNHienTai: schedule.SoBNHienTai,
          SoBNToiDa: schedule.SoBNToiDa,
          Gia: schedule.Gia
        }));
        
        setSchedules(formattedSchedules);
        
        // Calculate stats from schedule data
        const today = new Date().toISOString().split('T')[0];
        const todaySchedules = formattedSchedules.filter((schedule: any) => 
          new Date(schedule.Ngay).toISOString().split('T')[0] === today
        );
        
        const totalPatients = todaySchedules.reduce((sum: number, schedule: any) => 
          sum + schedule.SoBNHienTai, 0
        );
        
        setTodayStats(prev => ({
          ...prev,
          scheduledPatients: totalPatients,
          pendingExams: totalPatients, // Assume all are pending for now
          completedExams: 0
        }));
      } else {
        console.warn("No schedule data found or invalid response", data);
        setSchedules([]);
      }
    } catch (error) {
      console.error("Error loading schedules:", error);
      setSchedules([]);
    }
  };

  const loadTodayStats = async (MaNV: string) => {
    try {
      console.log("Loading doctor stats for today...");
      const response = await scheduleAPI.getDoctorTodayStats(MaNV);
      if (response?.data?.statusCode === 200) {
        setTodayStats(response.data.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadTodayAppointments = async (MaNV: string) => {
    try {
      console.log("Loading today's appointments...");
      const response = await scheduleAPI.getDoctorTodayAppointments(MaNV);
      
      if (response?.data?.statusCode === 200) {
        console.log("Received doctor appointments:", response.data.data);
        setTodayAppointments(response.data.data);
      } else {
        console.warn("No appointment data found or invalid response", response);
        setTodayAppointments([]);
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
      setTodayAppointments([]);
    }
  };

  const loadRecentDiagnoses = async (MaNV: string) => {
    try {
      console.log("Loading recent diagnoses...");
      const response = await medicalRecordAPI.getRecentDiagnosesByDoctor(MaNV);
      
      if (response?.data?.statusCode === 200) {
        setRecentDiagnoses(response.data.data);
      } else {
        setRecentDiagnoses([]);
      }
    } catch (error) {
      console.error("Error loading diagnoses:", error);
      setRecentDiagnoses([]);
    }
  };

  // Modal handlers
  const handleViewAllPatients = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getAllPatients();
      if (response?.data?.statusCode === 200) {
        setAllPatients(response.data.data);
        setShowPatientsModal(true);
      }
    } catch (error) {
      console.error("Error loading patients:", error);
      setSnackbar({ open: true, message: 'Lỗi khi tải danh sách bệnh nhân', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllSchedules = async () => {
    try {
      if (!currentUser?.MaNV) return;
      setLoading(true);
      const response = await scheduleAPI.getByDoctor(currentUser.MaNV);
      if (response?.data?.statusCode === 200) {
        setAllSchedules(response.data.data);
        setShowScheduleModal(true);
      }
    } catch (error) {
      console.error("Error loading schedules:", error);
      setSnackbar({ open: true, message: 'Lỗi khi tải lịch làm việc', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllMedicalRecords = async () => {
    try {
      if (!currentUser?.MaNV) return;
      setLoading(true);
      const response = await medicalRecordAPI.getRecentDiagnosesByDoctor(currentUser.MaNV);
      if (response?.data?.statusCode === 200) {
        setAllMedicalRecords(response.data.data);
        setShowMedicalRecordModal(true);
      }
    } catch (error) {
      console.error("Error loading medical records:", error);
      setSnackbar({ open: true, message: 'Lỗi khi tải hồ sơ bệnh án', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMedicalRecord = async () => {
    try {
      if (!medicalRecordForm.TrieuChung || !medicalRecordForm.ChanDoan || !medicalRecordForm.MaBN) {
        setSnackbar({ open: true, message: 'Vui lòng điền đầy đủ thông tin', severity: 'error' });
        return;
      }

      console.log("Creating medical record with data:", medicalRecordForm);
      const response = await medicalRecordAPI.create(medicalRecordForm);
      console.log("Medical record API response:", response);
      
      // Kiểm tra response structure
      // @ts-ignore
      if (response?.statusCode === 200 || response?.statusCode === 201 ||
          response?.data?.statusCode === 200 || response?.data?.statusCode === 201) {
        setSnackbar({ open: true, message: 'Tạo hồ sơ bệnh án thành công', severity: 'success' });
        setMedicalRecordForm({
          TrieuChung: '',
          ChanDoan: '',
          NgayKham: new Date().toISOString().split('T')[0],
          MaBN: ''
        });
        setShowMedicalRecordModal(false);
        // Reload recent diagnoses
        if (currentUser?.MaNV) {
          loadRecentDiagnoses(currentUser.MaNV);
        }
      } else {
        console.warn("Unexpected response structure:", response);
        setSnackbar({ open: true, message: 'Phản hồi không mong đợi từ server', severity: 'error' });
      }
    } catch (error) {
      console.error("Error creating medical record:", error);
      setSnackbar({ open: true, message: 'Lỗi khi tạo hồ sơ bệnh án', severity: 'error' });
    }
  };

  // Phieu search handlers
  const handleSearchPhieu = async () => {
    try {
      let response;
      const today = new Date().toISOString().split('T')[0];
      
      if (phieuSearchForm.MaPhieu) {
        // Tìm theo mã phiếu
        response = await phieuAPI.getPhieuById(phieuSearchForm.MaPhieu);
        if (response?.data) {
          const phieu = response.data;
          // Kiểm tra ngày yêu cầu có phải hôm nay không
          const phieuDate = new Date(phieu.NgayYeuCau).toISOString().split('T')[0];
          if (phieuDate === today && phieu.Loai === 'KhamBenh' && phieu.TrangThai === 'Payed') {
            setPhieuList([phieu]);
          } else {
            setPhieuList([]);
            setSnackbar({ 
              open: true, 
              message: 'Chỉ được chọn phiếu khám bệnh đã thanh toán trong ngày hôm nay', 
              severity: 'warning' 
            });
          }
        }
      } else if (phieuSearchForm.searchValue) {
        // Tìm bệnh nhân theo CCCD hoặc MaBN
        let patientResponse;
        if (phieuSearchForm.searchType === 'CCCD') {
          patientResponse = await patientAPI.getPatientByCCCD(phieuSearchForm.searchValue);
        } else {
          patientResponse = await patientAPI.getPatientById(phieuSearchForm.searchValue);
        }
        
        if (patientResponse?.data?.statusCode === 200) {
          const patient = patientResponse.data.data;
          // Lấy phiếu khám bệnh của bệnh nhân
          const phieuResponse = await phieuAPI.getPhieuByPatient(patient.MaBN);
          if (phieuResponse?.data?.statusCode === 200) {
            // Lọc chỉ lấy phiếu khám bệnh đã thanh toán trong ngày hôm nay
            const phieuKhamBenh = phieuResponse.data.data.filter((phieu: any) => {
              const phieuDate = new Date(phieu.NgayYeuCau).toISOString().split('T')[0];
              return phieu.Loai === 'KhamBenh' && 
                     phieu.TrangThai === 'Payed' && 
                     phieuDate === today;
            });
            setPhieuList(phieuKhamBenh);
            
            if (phieuKhamBenh.length === 0) {
              setSnackbar({ 
                open: true, 
                message: 'Không tìm thấy phiếu khám bệnh đã thanh toán trong ngày hôm nay', 
                severity: 'warning' 
              });
            }
          }
        } else {
          setSnackbar({ open: true, message: 'Không tìm thấy bệnh nhân', severity: 'error' });
        }
      }
    } catch (error) {
      console.error("Error searching phieu:", error);
      setSnackbar({ open: true, message: 'Lỗi khi tra cứu phiếu khám', severity: 'error' });
    }
  };

  const handleSelectPhieu = (phieu: any) => {
    // Import thông tin từ phiếu khám
    setMedicalRecordForm(prev => ({
      ...prev,
      MaBN: phieu.MaBN,
      NgayKham: new Date(phieu.NgayYeuCau).toISOString().split('T')[0]
    }));
    setShowPhieuSearchModal(false);
    setShowMedicalRecordModal(true);
    setSnackbar({ open: true, message: 'Đã import thông tin bệnh nhân từ phiếu khám', severity: 'success' });
  };

  const statsCards = [
    {
      title: "Bệnh nhân hôm nay",
      value: todayStats.scheduledPatients,
      icon: <People sx={{ fontSize: 40, color: "#3da9fc" }} />,
      color: "#3da9fc"
    },
    {
      title: "Đã khám",
      value: todayStats.completedExams,
      icon: <Assignment sx={{ fontSize: 40, color: "#28a745" }} />,
      color: "#28a745"
    },
    {
      title: "Chờ khám",
      value: todayStats.pendingExams,
      icon: <AccessTime sx={{ fontSize: 40, color: "#ef4565" }} />,
      color: "#ef4565"
    },
    {
      title: "Doanh thu",
      value: `${(todayStats.totalRevenue || 0).toLocaleString('vi-VN')}đ`,
      icon: <TrendingUp sx={{ fontSize: 40, color: "#90b4ce" }} />,
      color: "#90b4ce"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} sx={{ color: "#3da9fc" }} />
        </Box>
      ) : (
        <>
          {/* Header */}
          <Box mb={4}>
            <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
              Dashboard Bác sĩ
            </Typography>
            <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
              Chào mừng, <strong>BS. {currentUser?.HoTen || 'Bác sĩ'}</strong>. Tổng quan công việc và lịch khám hôm nay.
            </Typography>
          </Box>

      {/* Stats Cards */}
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
                <Box display="flex" alignItems="center" gap={2}>
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Doctor's Schedules */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600 }}>
                  Lịch làm việc của tôi
                </Typography>
                <Button 
                  variant="contained" 
                  size="small"
                  onClick={handleViewAllSchedules}
                  sx={{ bgcolor: "#3da9fc", "&:hover": { bgcolor: "#2c8fd1" } }}
                >
                  Xem tất cả
                </Button>
              </Box>
              
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ngày</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Buổi</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Giá</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedules.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography color="#5f6c7b">Chưa có lịch làm việc</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      schedules.slice(0, 5).map((schedule: any) => (
                        <TableRow key={schedule.MaLich} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: "#094067", fontWeight: 600 }}>
                              {new Date(schedule.Ngay).toLocaleDateString('vi-VN')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={schedule.Buoi}
                              size="small"
                              sx={{
                                bgcolor: schedule.Buoi === "Sang" ? "#e3f2fd" : "#fff3e0",
                                color: schedule.Buoi === "Sang" ? "#1976d2" : "#f57c00"
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="#5f6c7b">
                              {schedule.SoBNHienTai}/{schedule.SoBNToiDa}
                            </Typography>
                            <Box
                              sx={{
                                width: "80px",
                                height: "4px",
                                bgcolor: "#e0e0e0",
                                borderRadius: "2px",
                                mt: 0.5
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${(schedule.SoBNHienTai / schedule.SoBNToiDa) * 100}%`,
                                  height: "100%",
                                  bgcolor: schedule.SoBNHienTai === schedule.SoBNToiDa ? "#ef4565" : "#3da9fc",
                                  borderRadius: "2px"
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: "#28a745", fontWeight: 600 }}>
                              {parseInt(schedule.Gia).toLocaleString('vi-VN')}đ
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Appointments */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)", mt: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600 }}>
                  Lịch hẹn hôm nay
                </Typography>
                <Typography variant="body2" color="#5f6c7b">
                  {todayAppointments.length} cuộc hẹn
                </Typography>
              </Box>
              
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thời gian</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Trạng thái</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Giá khám</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {todayAppointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography color="#5f6c7b">Không có lịch hẹn hôm nay</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      todayAppointments.slice(0, 5).map((appointment: any, index: number) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar sx={{ bgcolor: "#3da9fc", width: 32, height: 32 }}>
                                {appointment.BenhNhan?.HoTen?.charAt(0) || 'P'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ color: "#094067", fontWeight: 600 }}>
                                  {appointment.BenhNhan?.HoTen || 'N/A'}
                                </Typography>
                                <Typography variant="caption" color="#5f6c7b">
                                  {appointment.BenhNhan?.SDT || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: "#094067", fontWeight: 600 }}>
                              {appointment.Lich?.ThoiGianBatDau} - {appointment.Lich?.ThoiGianKetThuc}
                            </Typography>
                            <Typography variant="caption" color="#5f6c7b">
                              {appointment.Lich?.Buoi}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={appointment.TrangThai === 'Accept' ? 'Đã xác nhận' : 
                                     appointment.TrangThai === 'Pending' ? 'Chờ xác nhận' :
                                     appointment.TrangThai === 'Done' ? 'Đã khám' : 'Đã hủy'}
                              size="small"
                              sx={{
                                bgcolor: appointment.TrangThai === 'Accept' ? "#e8f5e8" : 
                                        appointment.TrangThai === 'Pending' ? "#fff3e0" :
                                        appointment.TrangThai === 'Done' ? "#e3f2fd" : "#ffebee",
                                color: appointment.TrangThai === 'Accept' ? "#2e7d32" : 
                                       appointment.TrangThai === 'Pending' ? "#f57c00" :
                                       appointment.TrangThai === 'Done' ? "#1976d2" : "#c62828"
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: "#28a745", fontWeight: 600 }}>
                              {parseInt(appointment.DonGia || appointment.Lich?.Gia || 0).toLocaleString('vi-VN')}đ
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Medical Records */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)", mt: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600 }}>
                  Hồ sơ bệnh án gần đây
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={handleViewAllMedicalRecords}
                  sx={{ borderColor: "#3da9fc", color: "#3da9fc" }}
                >
                  Xem tất cả
                </Button>
              </Box>
              
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ngày khám</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Chẩn đoán</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Triệu chứng</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentDiagnoses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography color="#5f6c7b">Chưa có hồ sơ bệnh án gần đây</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentDiagnoses.slice(0, 5).map((record: any) => (
                        <TableRow key={record.MaHSBA} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar sx={{ bgcolor: "#28a745", width: 32, height: 32 }}>
                                {record.BenhNhan?.HoTen?.charAt(0) || 'P'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ color: "#094067", fontWeight: 600 }}>
                                  {record.BenhNhan?.HoTen || 'N/A'}
                                </Typography>
                                <Typography variant="caption" color="#5f6c7b">
                                  {record.BenhNhan?.CCCD || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: "#094067", fontWeight: 600 }}>
                              {record.NgayKham ? new Date(record.NgayKham).toLocaleDateString('vi-VN') : 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="#5f6c7b" 
                              sx={{ 
                                maxWidth: 200, 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {record.ChanDoan || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="#5f6c7b"
                              sx={{ 
                                maxWidth: 200, 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {record.TrieuChung || 'N/A'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress & Quick Actions */}
        <Grid item xs={12} lg={4}>
          {/* Work Progress */}
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)", mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
                Tiến độ công việc
              </Typography>
              
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="#5f6c7b">Đã khám</Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    {todayStats.completedExams}/{todayStats.scheduledPatients}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={todayStats.scheduledPatients > 0 ? (todayStats.completedExams / todayStats.scheduledPatients) * 100 : 0}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: "#f0f0f0",
                    "& .MuiLinearProgress-bar": { bgcolor: "#28a745" }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: "#094067", mb: 2 }}>
                  Thống kê nhanh
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="#5f6c7b">Hiệu suất:</Typography>
                  <Typography variant="body2" sx={{ color: "#28a745", fontWeight: 600 }}>
                    {todayStats.scheduledPatients > 0 ? Math.round((todayStats.completedExams / todayStats.scheduledPatients) * 100) : 0}%
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="#5f6c7b">Thời gian trung bình:</Typography>
                  <Typography variant="body2" sx={{ color: "#3da9fc", fontWeight: 600 }}>
                    30 phút
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
                Thao tác nhanh
              </Typography>
              
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<People />}
                  onClick={handleViewAllPatients}
                  sx={{ 
                    bgcolor: "#3da9fc",
                    "&:hover": { bgcolor: "#2c8fd1" },
                    py: 1.5
                  }}
                >
                  Xem danh sách bệnh nhân
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Assignment />}
                  onClick={() => setShowPhieuSearchModal(true)}
                  sx={{ 
                    borderColor: "#3da9fc",
                    color: "#3da9fc",
                    "&:hover": { borderColor: "#2c8fd1", bgcolor: "rgba(61, 169, 252, 0.04)" },
                    py: 1.5
                  }}
                >
                  Tra cứu phiếu khám & tạo hồ sơ
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CalendarMonth />}
                  onClick={handleViewAllSchedules}
                  sx={{ 
                    borderColor: "#90b4ce",
                    color: "#90b4ce",
                    "&:hover": { borderColor: "#6b8aa0", bgcolor: "rgba(144, 180, 206, 0.04)" },
                    py: 1.5
                  }}
                >
                  Xem lịch làm việc
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
        </>
      )}

      {/* Patients Modal */}
      <Dialog open={showPatientsModal} onClose={() => setShowPatientsModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Danh sách bệnh nhân</Typography>
            <Button onClick={() => setShowPatientsModal(false)}>
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Họ tên</TableCell>
                  <TableCell>CCCD</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allPatients.map((patient: any) => (
                  <TableRow key={patient.MaBN} hover>
                    <TableCell>{patient.HoTen}</TableCell>
                    <TableCell>{patient.CCCD}</TableCell>
                    <TableCell>{patient.SDT}</TableCell>
                    <TableCell>{patient.DiaChi}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Schedules Modal */}
      <Dialog open={showScheduleModal} onClose={() => setShowScheduleModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Lịch làm việc của tôi</Typography>
            <Button onClick={() => setShowScheduleModal(false)}>
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Buổi</TableCell>
                  <TableCell>Bệnh nhân hiện tại</TableCell>
                  <TableCell>Bệnh nhân tối đa</TableCell>
                  <TableCell>Giá khám</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allSchedules.map((schedule: any) => (
                  <TableRow key={schedule.MaLich} hover>
                    <TableCell>{new Date(schedule.Ngay).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>
                      <Chip
                        label={schedule.Buoi}
                        size="small"
                        sx={{
                          bgcolor: schedule.Buoi === "Sang" ? "#e3f2fd" : "#fff3e0",
                          color: schedule.Buoi === "Sang" ? "#1976d2" : "#f57c00"
                        }}
                      />
                    </TableCell>
                    <TableCell>{schedule.SoBNHienTai}</TableCell>
                    <TableCell>{schedule.SoBNToiDa}</TableCell>
                    <TableCell>{parseInt(schedule.Gia).toLocaleString('vi-VN')}đ</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      {/* Phieu Search Modal */}
      <Dialog open={showPhieuSearchModal} onClose={() => setShowPhieuSearchModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Tra cứu phiếu khám bệnh</Typography>
            <Button onClick={() => setShowPhieuSearchModal(false)}>
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={2}>
            <FormControl fullWidth>
              <InputLabel>Tìm kiếm theo</InputLabel>
              <Select
                value={phieuSearchForm.searchType}
                onChange={(e) => setPhieuSearchForm(prev => ({ ...prev, searchType: e.target.value }))}
                label="Tìm kiếm theo"
              >
                <MenuItem value="CCCD">CCCD</MenuItem>
                <MenuItem value="MaBN">Mã bệnh nhân</MenuItem>
                <MenuItem value="MaPhieu">Mã phiếu</MenuItem>
              </Select>
            </FormControl>
            
            {phieuSearchForm.searchType === 'MaPhieu' ? (
              <TextField
                fullWidth
                label="Mã phiếu khám"
                value={phieuSearchForm.MaPhieu}
                onChange={(e) => setPhieuSearchForm(prev => ({ ...prev, MaPhieu: e.target.value }))}
                placeholder="Nhập mã phiếu khám"
              />
            ) : (
              <TextField
                fullWidth
                label={phieuSearchForm.searchType === 'CCCD' ? 'Số CCCD' : 'Mã bệnh nhân'}
                value={phieuSearchForm.searchValue}
                onChange={(e) => setPhieuSearchForm(prev => ({ ...prev, searchValue: e.target.value }))}
                placeholder={phieuSearchForm.searchType === 'CCCD' ? 'Nhập số CCCD' : 'Nhập mã bệnh nhân'}
              />
            )}
            
            <Button 
              variant="contained" 
              onClick={handleSearchPhieu}
              sx={{ bgcolor: "#3da9fc", "&:hover": { bgcolor: "#2c8fd1" } }}
            >
              Tìm kiếm phiếu khám
            </Button>

            <Alert severity="info" sx={{ mt: 1 }}>
              <strong>Lưu ý:</strong> Chỉ có thể chọn phiếu khám bệnh đã thanh toán trong ngày hôm nay ({new Date().toLocaleDateString('vi-VN')})
            </Alert>

            {phieuList.length > 0 && (
              <Box mt={2}>
                <Typography variant="h6" sx={{ mb: 2 }}>Danh sách phiếu khám đã thanh toán (hôm nay)</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã phiếu</TableCell>
                        <TableCell>Mã bệnh nhân</TableCell>
                        <TableCell>Ngày yêu cầu</TableCell>
                        <TableCell>Đơn giá</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {phieuList.map((phieu: any) => (
                        <TableRow key={phieu.MaPYC} hover>
                          <TableCell>{phieu.MaPYC}</TableCell>
                          <TableCell>{phieu.MaBN}</TableCell>
                          <TableCell>{new Date(phieu.NgayYeuCau).toLocaleDateString('vi-VN')}</TableCell>
                          <TableCell>{parseInt(phieu.DonGia).toLocaleString('vi-VN')}đ</TableCell>
                          <TableCell>
                            <Chip
                              label={phieu.TrangThai === 'Payed' ? 'Đã thanh toán' : phieu.TrangThai}
                              size="small"
                              sx={{
                                bgcolor: phieu.TrangThai === 'Payed' ? "#e8f5e8" : "#fff3e0",
                                color: phieu.TrangThai === 'Payed' ? "#2e7d32" : "#f57c00"
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleSelectPhieu(phieu)}
                              sx={{ bgcolor: "#28a745", "&:hover": { bgcolor: "#218838" } }}
                            >
                              Chọn phiếu này
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Medical Record Creation Modal */}
      <Dialog open={showMedicalRecordModal} onClose={() => setShowMedicalRecordModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Tạo hồ sơ bệnh án mới</Typography>
            <Button onClick={() => setShowMedicalRecordModal(false)}>
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={2}>
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                fullWidth
                label="Mã bệnh nhân"
                value={medicalRecordForm.MaBN}
                onChange={(e) => setMedicalRecordForm(prev => ({ ...prev, MaBN: e.target.value }))}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  setShowMedicalRecordModal(false);
                  setShowPhieuSearchModal(true);
                }}
                sx={{ 
                  minWidth: '200px',
                  borderColor: "#3da9fc", 
                  color: "#3da9fc",
                  "&:hover": { borderColor: "#2c8fd1" }
                }}
              >
                Tra cứu phiếu khám
              </Button>
            </Box>
            <TextField
              fullWidth
              label="Ngày khám"
              type="date"
              value={medicalRecordForm.NgayKham}
              onChange={(e) => setMedicalRecordForm(prev => ({ ...prev, NgayKham: e.target.value }))}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Triệu chứng"
              value={medicalRecordForm.TrieuChung}
              onChange={(e) => setMedicalRecordForm(prev => ({ ...prev, TrieuChung: e.target.value }))}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Chẩn đoán"
              value={medicalRecordForm.ChanDoan}
              onChange={(e) => setMedicalRecordForm(prev => ({ ...prev, ChanDoan: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMedicalRecordModal(false)}>
            Hủy
          </Button>
          <Button variant="contained" onClick={handleCreateMedicalRecord}>
            Tạo hồ sơ
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DoctorDashboard;
