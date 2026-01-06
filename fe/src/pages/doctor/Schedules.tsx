import { FC, useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
  Autocomplete
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Schedule,
  CalendarToday,
  People
} from "@mui/icons-material";
import axiosInstance from "../../utils/axiosCustomize";

// Interface cho API Response
interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
  author?: string;
}

// API Service cho Schedule
const scheduleAPI = {
  // Lấy danh sách lịch
  getAll: async (): Promise<ApiResponse<Schedule[]>> => {
    try {
      const response = await axiosInstance.get('/api/v1/lich');
      console.log("Raw API response:", response);
      return response as unknown as ApiResponse<Schedule[]>; // axiosInstance đã trả về response.data trong interceptor
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },

  // Tạo lịch mới
  create: async (data: any): Promise<ApiResponse<Schedule>> => {
    try {
      const response = await axiosInstance.post('/api/v1/lich', data);
      console.log("Create response:", response);
      return response as unknown as ApiResponse<Schedule>;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },

  // Cập nhật lịch
  update: async (id: string, data: any): Promise<ApiResponse<Schedule>> => {
    try {
      const response = await axiosInstance.put(`/api/v1/lich/${id}`, data);
      console.log("Update response:", response);
      return response as unknown as ApiResponse<Schedule>;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },

  // Xóa lịch
  delete: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.delete(`/api/v1/lich/${id}`);
      console.log("Delete response:", response);
      return response as unknown as ApiResponse<any>;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  }
};

// API Service cho Nhân viên
const nhanvienAPI = {
  getDoctors: async (): Promise<ApiResponse<NhanVien[]>> => {
    try {
      const response = await axiosInstance.get('/api/v1/nhanvien/bacsi');
      console.log("Doctors response:", response);
      return response as unknown as ApiResponse<NhanVien[]>;
    } catch (error) {
      console.error('Error loading doctors:', error);
      throw error;
    }
  },
  
  getAccount: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get('/api/v1/nhanvien/account');
      console.log("Account response:", response);
      return response as unknown as ApiResponse<any>;
    } catch (error) {
      console.error('Error loading account:', error);
      throw error;
    }
  }
};

// Interface theo dữ liệu backend
interface Schedule {
  MaLich: string;
  SoBNHienTai: number;
  SoBNToiDa: number;
  Ngay: string;
  Buoi: 'Sang' | 'Chieu'; // Backend chỉ hỗ trợ 2 buổi
  Gia: number; // Backend trả về number
  MaNV: string;
}

// Interface cho nhân viên/bác sĩ
interface NhanVien {
  MaNV: string;
  HoTen: string;
  ChucVu: string;
}

// Form data interface
interface ScheduleFormData {
  SoBNHienTai: number; // Backend yêu cầu field này
  Ngay: string;
  Buoi: 'Sang' | 'Chieu'; // Backend chỉ hỗ trợ 2 buổi
  SoBNToiDa: number;
  Gia: number; // Backend yêu cầu number
  MaNV: string;
}

const DoctorSchedules: FC = () => {
  // State for data
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); // null = đang kiểm tra, false = không có quyền, true = có quyền
  
  // State for UI
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<ScheduleFormData>({
    SoBNHienTai: 0,
    Ngay: new Date().toISOString().split('T')[0],
    Buoi: "Sang",
    SoBNToiDa: 0,
    Gia: 0,
    MaNV: "" // Default doctor ID
  });
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [searchDate, setSearchDate] = useState<string>('');
  const [nhanvienList, setNhanvienList] = useState<NhanVien[]>([]);
  
  // Notifications
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    checkPermissionAndLoadData();
  }, []);

  const checkPermissionAndLoadData = async () => {
    try {
      // Kiểm tra thông tin user hiện tại
      const userResponse = await nhanvienAPI.getAccount();
      if (userResponse?.data) {
        setCurrentUser(userResponse.data);
        
        // Kiểm tra xem có phải là bác sĩ và là trưởng khoa không
        const isDoctor = userResponse.data.LoaiNV === 'BacSi';
        const isDepartmentHead = userResponse.data.LaTruongKhoa === true;
        
        console.log("User info:", {
          LoaiNV: userResponse.data.LoaiNV,
          LaTruongKhoa: userResponse.data.LaTruongKhoa,
          isDoctor,
          isDepartmentHead
        });
        
        if (isDoctor && isDepartmentHead) {
          setHasPermission(true);
          // Nếu có quyền thì load dữ liệu
          await loadSchedules();
          await loadDoctors();
        } else {
          setHasPermission(false);
          console.warn("Access denied: User is not a department head doctor");
        }
      } else {
        setHasPermission(false);
        console.error("Cannot get user information");
      }
    } catch (error) {
      console.error("Error checking permission:", error);
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      console.log("Loading doctors...");
      const response = await nhanvienAPI.getDoctors();
      console.log("Raw doctors response:", response);

      if (response && response.data) {
        // Lọc chỉ lấy bác sĩ (nếu có trường ChucVu hoặc LoaiNhanVien)
        const doctors = Array.isArray(response.data) ? response.data : [];
        console.log("Processed doctors:", doctors);
        setNhanvienList(doctors);
      } else {
        console.warn("No doctors data in response");
        setNhanvienList([]);
      }
    } catch (error) {
      console.error('Failed to load doctors:', error);
      setNotification({
        open: true,
        message: 'Không thể tải danh sách bác sĩ',
        severity: 'error'
      });
      setNhanvienList([]);
    }
  };

  const loadSchedules = async () => {
    try {
      setLoading(true);
      console.log("Loading schedules...");
      const response = await scheduleAPI.getAll();
      
      console.log("API Response:", response);
      
      if (response && response.statusCode === 200 && response.data) {
        console.log("Schedule data:", response.data);
        setSchedules(response.data);
        showNotification(`Đã tải ${response.data.length} lịch làm việc`, "success");
      } else {
        console.log("No data or error in response:", response);
        setSchedules([]);
        showNotification("Không có dữ liệu lịch làm việc", "info");
      }
    } catch (error) {
      console.error("Error loading schedules:", error);
      setSchedules([]);
      showNotification("Lỗi khi tải danh sách lịch làm việc", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async () => {
    try {
      if (!formData.Ngay || !formData.Buoi || !formData.SoBNToiDa || !formData.MaNV || !formData.Gia) {
        showNotification("Vui lòng điền đầy đủ thông tin", "warning");
        return;
      }

      console.log("Creating schedule:", formData);
      
      // Tạo date object với thời gian phù hợp với buổi
      const scheduleDate = new Date(formData.Ngay);
      if (formData.Buoi === 'Sang') {
        scheduleDate.setHours(8, 0, 0, 0); // 8 giờ sáng
      } else {
        scheduleDate.setHours(14, 0, 0, 0); // 2 giờ chiều
      }
      
      const scheduleData = {
        SoBNHienTai: formData.SoBNHienTai,
        Ngay: scheduleDate.toISOString(), // Gửi với thời gian cụ thể
        Buoi: formData.Buoi,
        SoBNToiDa: formData.SoBNToiDa,
        Gia: Number(formData.Gia),
        MaNV: formData.MaNV
      };
      
      console.log("Schedule data to send:", scheduleData);
      
      const response = await scheduleAPI.create(scheduleData);
      
      if (response.statusCode === 201 || response.statusCode === 200) {
        await loadSchedules();
        showNotification("Tạo lịch làm việc thành công", "success");
        setOpenDialog(false);
        resetFormData();
      } else {
        showNotification("Lỗi khi tạo lịch làm việc", "error");
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      showNotification("Lỗi khi tạo lịch làm việc", "error");
    }
  };

  const handleEditSchedule = (schedule: Schedule) => {
    console.log("Loading schedule for edit:", schedule.MaLich);
    
    setFormData({
      SoBNHienTai: schedule.SoBNHienTai,
      Ngay: schedule.Ngay.split('T')[0], // Convert ISO date to YYYY-MM-DD
      Buoi: schedule.Buoi,
      SoBNToiDa: schedule.SoBNToiDa,
      Gia: schedule.Gia, // Already a number
      MaNV: schedule.MaNV
    });
    
    setSelectedSchedule(schedule);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleUpdateSchedule = async () => {
    try {
      if (!selectedSchedule) return;
      
      // Kiểm tra xem lịch đã có bệnh nhân chưa
      if (selectedSchedule.SoBNHienTai > 0) {
        showNotification("Không thể sửa lịch đã có bệnh nhân đăng ký", "error");
        return;
      }
      
      console.log("Updating schedule:", selectedSchedule.MaLich);
      
      // Tạo date object với thời gian phù hợp với buổi
      const scheduleDate = new Date(formData.Ngay);
      if (formData.Buoi === 'Sang') {
        scheduleDate.setHours(8, 0, 0, 0); // 8 giờ sáng
      } else {
        scheduleDate.setHours(14, 0, 0, 0); // 2 giờ chiều
      }
      
      const updateData = {
        SoBNHienTai: formData.SoBNHienTai,
        Ngay: scheduleDate.toISOString(), // Gửi với thời gian cụ thể
        Buoi: formData.Buoi,
        SoBNToiDa: formData.SoBNToiDa,
        Gia: Number(formData.Gia),
        MaNV: formData.MaNV
      };
      
      console.log("Update data to send:", updateData);
      
      const response = await scheduleAPI.update(selectedSchedule.MaLich, updateData);
      
      if (response.statusCode === 200) {
        await loadSchedules();
        showNotification("Cập nhật lịch làm việc thành công", "success");
        setOpenDialog(false);
        resetFormData();
      } else {
        showNotification("Lỗi khi cập nhật lịch làm việc", "error");
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      showNotification("Lỗi khi cập nhật lịch làm việc", "error");
    }
  };

  const handleDeleteSchedule = async (schedule: Schedule) => {
    try {
      // Kiểm tra xem lịch đã có bệnh nhân chưa
      if (schedule.SoBNHienTai > 0) {
        showNotification("Không thể xóa lịch đã có bệnh nhân đăng ký", "error");
        return;
      }
      
      if (!confirm(`Bạn có chắc chắn muốn xóa lịch làm việc ${schedule.MaLich}?`)) {
        return;
      }
      
      console.log("Deleting schedule:", schedule.MaLich);
      
      const response = await scheduleAPI.delete(schedule.MaLich);
      
      if (response.statusCode === 200) {
        await loadSchedules();
        showNotification("Xóa lịch làm việc thành công", "success");
      } else {
        showNotification("Lỗi khi xóa lịch làm việc", "error");
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      showNotification("Lỗi khi xóa lịch làm việc", "error");
    }
  };

  const resetFormData = () => {
    setFormData({
      SoBNHienTai: 0,
      Ngay: new Date().toISOString().split('T')[0],
      Buoi: "Sang",
      SoBNToiDa: 0,
      Gia: 0,
      MaNV: ""
    });
    setEditMode(false);
    setSelectedSchedule(null);
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const getBuoiChip = (buoi: string) => {
    const buoiConfig = {
      'Sang': { label: 'Buổi sáng', color: 'primary' as const },
      'Chieu': { label: 'Buổi chiều', color: 'warning' as const },
      'Toi': { label: 'Buổi tối', color: 'secondary' as const }
    };
    
    const config = buoiConfig[buoi as keyof typeof buoiConfig] || { label: buoi, color: 'default' as const };
    
    return (
      <Chip 
        label={config.label}
        color={config.color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const handleOpenCreateDialog = () => {
    resetFormData();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetFormData();
  };

  // Tính toán thống kê
  const todaySchedules = schedules.filter(s => {
    const scheduleDate = new Date(s.Ngay).toDateString();
    const today = new Date().toDateString();
    return scheduleDate === today;
  });

  const totalPatients = schedules.reduce((sum, schedule) => sum + schedule.SoBNHienTai, 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} sx={{ color: "#3da9fc" }} />
        </Box>
      ) : hasPermission === false ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Card sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
            <CardContent>
              <Typography variant="h5" sx={{ color: "#dc3545", fontWeight: 600, mb: 2 }}>
                Không có quyền truy cập
              </Typography>
              <Typography variant="body1" sx={{ color: "#5f6c7b", mb: 3 }}>
                Chỉ có trưởng khoa mới được phép truy cập trang quản lý lịch làm việc.
              </Typography>
              <Typography variant="body2" sx={{ color: "#5f6c7b", fontStyle: 'italic' }}>
                Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <>
          {/* Header */}
          <Box mb={4}>
            <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
              Quản lý lịch làm việc
            </Typography>
            <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
              Tạo và quản lý lịch khám bệnh (Chỉ dành cho trưởng khoa)
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 3, borderLeft: "4px solid #3da9fc" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Schedule sx={{ fontSize: 40, color: "#3da9fc" }} />
                    <Box>
                      <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                        {schedules.length}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        Tổng số lịch
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 3, borderLeft: "4px solid #ffc107" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CalendarToday sx={{ fontSize: 40, color: "#ffc107" }} />
                    <Box>
                      <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                        {todaySchedules.length}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        Lịch hôm nay
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 3, borderLeft: "4px solid #28a745" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <People sx={{ fontSize: 40, color: "#28a745" }} />
                    <Box>
                      <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                        {totalPatients}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        Tổng bệnh nhân hiện tại
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Action Button */}
          <Box mb={3}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenCreateDialog}
              sx={{
                bgcolor: "#3da9fc",
                "&:hover": { bgcolor: "#2b8fd1" },
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600
              }}
            >
              Tạo lịch làm việc mới
            </Button>
          </Box>

          {/* Schedules Table */}
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
                Danh sách lịch làm việc
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Mã lịch</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ngày</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Buổi</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Giá khám</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Mã nhân viên</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.MaLich} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ color: "#3da9fc", fontWeight: 600 }}>
                            {schedule.MaLich}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="#5f6c7b">
                            {new Date(schedule.Ngay).toLocaleDateString('vi-VN')}
                          </Typography>
                        </TableCell>
                        <TableCell>{getBuoiChip(schedule.Buoi)}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#094067", fontWeight: 600 }}>
                            {schedule.SoBNHienTai}/{schedule.SoBNToiDa}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#094067", fontWeight: 600 }}>
                            {schedule.Gia.toLocaleString('vi-VN')} ₫
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="#5f6c7b">
                            {schedule.MaNV}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title={schedule.SoBNHienTai > 0 ? "Không thể sửa lịch đã có bệnh nhân" : "Chỉnh sửa"}>
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditSchedule(schedule)}
                                  disabled={schedule.SoBNHienTai > 0}
                                  sx={{ 
                                    color: schedule.SoBNHienTai > 0 ? "#ccc" : "#28a745",
                                    "&:disabled": { color: "#ccc" }
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title={schedule.SoBNHienTai > 0 ? "Không thể xóa lịch đã có bệnh nhân" : "Xóa"}>
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteSchedule(schedule)}
                                  disabled={schedule.SoBNHienTai > 0}
                                  sx={{ 
                                    color: schedule.SoBNHienTai > 0 ? "#ccc" : "#dc3545",
                                    "&:disabled": { color: "#ccc" }
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Create/Edit Schedule Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
              {editMode ? "Chỉnh sửa lịch làm việc" : "Tạo lịch làm việc mới"}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ngày làm việc"
                    type="date"
                    value={formData.Ngay}
                    onChange={(e) => setFormData({ ...formData, Ngay: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Buổi làm việc</InputLabel>
                    <Select
                      value={formData.Buoi}
                      onChange={(e) => setFormData({ ...formData, Buoi: e.target.value as any })}
                    >
                      <MenuItem value="Sang">Buổi sáng</MenuItem>
                      <MenuItem value="Chieu">Buổi chiều</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Số bệnh nhân tối đa"
                    type="number"
                    value={formData.SoBNToiDa}
                    onChange={(e) => setFormData({ ...formData, SoBNToiDa: parseInt(e.target.value) || 0 })}
                    inputProps={{ min: 1, max: 50 }}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Giá khám"
                    type="number"
                    value={formData.Gia}
                    onChange={(e) => setFormData({ ...formData, Gia: Number(e.target.value) || 0 })}
                    inputProps={{ min: 0, step: 10000 }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    fullWidth
                    options={nhanvienList}
                    value={nhanvienList.find(nv => nv.MaNV === formData.MaNV) || null}
                    onChange={(_, selectedDoctor) => {
                      setFormData({ 
                        ...formData, 
                        MaNV: selectedDoctor ? selectedDoctor.MaNV : "" 
                      });
                    }}
                    getOptionLabel={(option) => `${option.HoTen} (${option.MaNV})`}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chọn bác sĩ"
                        required
                        helperText="Tìm kiếm theo tên hoặc mã nhân viên"
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box>
                          <Typography variant="body1">{option.HoTen}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Mã NV: {option.MaNV} | Chức vụ: {option.ChucVu || 'Bác sĩ'}
                          </Typography>
                        </Box>
                      </li>
                    )}
                    noOptionsText="Không tìm thấy bác sĩ nào"
                    loading={nhanvienList.length === 0}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseDialog} startIcon={<Cancel />} color="inherit">
                Hủy
              </Button>
              <Button
                variant="contained"
                onClick={editMode ? handleUpdateSchedule : handleCreateSchedule}
                disabled={!formData.Ngay || !formData.Buoi || !formData.SoBNToiDa || !formData.MaNV || !formData.Gia}
                startIcon={<Save />}
                sx={{
                  bgcolor: "#3da9fc",
                  "&:hover": { bgcolor: "#2b8fd1" }
                }}
              >
                {editMode ? "Cập nhật" : "Tạo lịch"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Notification */}
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={() => setNotification({ ...notification, open: false })}
          >
            <Alert
              severity={notification.severity}
              onClose={() => setNotification({ ...notification, open: false })}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </>
      )}
    </Container>
  );
};

export default DoctorSchedules;
