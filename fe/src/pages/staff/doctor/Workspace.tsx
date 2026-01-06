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
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Alert,
  Snackbar,
  Avatar,
  Tabs,
  Tab,
  Paper,
  Switch,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel
} from "@mui/material";
import {
  AssignmentInd,
  CalendarToday,
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  Save,
  Cancel,
  Schedule,
  MedicalServices,
  LocalHospital,
  Assignment,
  ExitToApp,
  Login,
  PersonAdd
} from "@mui/icons-material";

interface MedicalRecord {
  ID: number;
  MaPhieu: string;
  LoaiPhieu: 'Khám bệnh' | 'Nhập viện' | 'Xuất viện' | 'Chỉ định dịch vụ';
  BenhNhanID: number;
  TenBenhNhan: string;
  NgaySinh: string;
  GioiTinh: string;
  NgayTao: string;
  ChuanDoan: string;
  HuongDieuTri: string;
  TrangThai: 'Đang điều trị' | 'Hoàn thành' | 'Chờ xử lý';
  BacSiPhuTrach: string;
  Khoa: string;
}

interface WorkSchedule {
  ID: number;
  NgayLamViec: string;
  Ca: 'Sáng' | 'Chiều' | 'Tối' | 'Đêm';
  GioBatDau: string;
  GioKetThuc: string;
  TrangThai: 'Đã đăng ký' | 'Đang làm' | 'Hoàn thành' | 'Nghỉ';
  SoBenhNhan: number;
  GhiChu?: string;
}

interface DoctorStats {
  phieuHomNay: number;
  benhNhanDangDieuTri: number;
  lichLamViecTuan: number;
  phieuHoanThanh: number;
}

const DoctorWorkspace: FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [doctorStats, setDoctorStats] = useState<DoctorStats>({
    phieuHomNay: 0,
    benhNhanDangDieuTri: 0,
    lichLamViecTuan: 0,
    phieuHoanThanh: 0
  });

  // Medical Records State
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [recordPage, setRecordPage] = useState(0);
  const [recordRowsPerPage, setRecordRowsPerPage] = useState(10);
  const [recordSearchTerm, setRecordSearchTerm] = useState("");
  const [recordTypeFilter, setRecordTypeFilter] = useState("");
  const [recordStatusFilter, setRecordStatusFilter] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [openRecordDialog, setOpenRecordDialog] = useState(false);
  const [recordDialogMode, setRecordDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [activeStep, setActiveStep] = useState(0);

  // Work Schedule State
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<WorkSchedule[]>([]);
  const [schedulePage, setSchedulePage] = useState(0);
  const [scheduleRowsPerPage, setScheduleRowsPerPage] = useState(10);
  const [scheduleSearchTerm, setScheduleSearchTerm] = useState("");
  const [scheduleStatusFilter, setScheduleStatusFilter] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<WorkSchedule | null>(null);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [scheduleDialogMode, setScheduleDialogMode] = useState<'create' | 'edit' | 'view'>('create');

  // Form Data States
  const [recordFormData, setRecordFormData] = useState({
    loaiPhieu: "Khám bệnh",
    benhNhanID: "",
    tenBenhNhan: "",
    ngaySinh: "",
    gioiTinh: "Nam",
    chuanDoan: "",
    huongDieuTri: "",
    ghiChu: "",
    dichVu: "",
    phongBenh: "",
    ngayNhapVien: "",
    ngayXuatVien: "",
    lyDoXuatVien: ""
  });

  const [scheduleFormData, setScheduleFormData] = useState({
    ngayLamViec: "",
    ca: "Sáng",
    gioBatDau: "",
    gioKetThuc: "",
    ghiChu: ""
  });

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

  const steps = ['Thông tin cơ bản', 'Chi tiết phiếu', 'Xác nhận'];

  useEffect(() => {
    loadDoctorStats();
    loadMedicalRecords();
    loadWorkSchedules();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [medicalRecords, recordSearchTerm, recordTypeFilter, recordStatusFilter]);

  useEffect(() => {
    filterSchedules();
  }, [workSchedules, scheduleSearchTerm, scheduleStatusFilter]);

  const loadDoctorStats = async () => {
    try {
      console.log("Loading doctor statistics...");
      // TODO: Call API GET /api/doctor/stats
      
      const mockStats: DoctorStats = {
        phieuHomNay: 8,
        benhNhanDangDieuTri: 25,
        lichLamViecTuan: 5,
        phieuHoanThanh: 120
      };
      
      setDoctorStats(mockStats);
    } catch (error) {
      console.error("Error loading doctor stats:", error);
    }
  };

  const loadMedicalRecords = async () => {
    try {
      console.log("Loading medical records...");
      // TODO: Call API GET /api/doctor/medical-records
      
      const mockRecords: MedicalRecord[] = [
        {
          ID: 1,
          MaPhieu: "PKB001",
          LoaiPhieu: "Khám bệnh",
          BenhNhanID: 1001,
          TenBenhNhan: "Nguyễn Văn An",
          NgaySinh: "1980-05-15",
          GioiTinh: "Nam",
          NgayTao: "2025-07-29",
          ChuanDoan: "Viêm amidan cấp",
          HuongDieuTri: "Kháng sinh, súc miệng, nghỉ ngơi",
          TrangThai: "Hoàn thành",
          BacSiPhuTrach: "BS. Trần Thị Lan",
          Khoa: "Khoa Tai Mũi Họng"
        },
        {
          ID: 2,
          MaPhieu: "PNV001",
          LoaiPhieu: "Nhập viện",
          BenhNhanID: 1002,
          TenBenhNhan: "Trần Thị Bình",
          NgaySinh: "1975-08-22",
          GioiTinh: "Nữ",
          NgayTao: "2025-07-28",
          ChuanDoan: "Suy tim độ II",
          HuongDieuTri: "Theo dõi, điều trị nội khoa",
          TrangThai: "Đang điều trị",
          BacSiPhuTrach: "BS. Lê Văn Minh",
          Khoa: "Khoa Tim mạch"
        }
      ];
      
      setMedicalRecords(mockRecords);
    } catch (error) {
      console.error("Error loading medical records:", error);
      showNotification("Lỗi khi tải danh sách phiếu y tế", "error");
    }
  };

  const loadWorkSchedules = async () => {
    try {
      console.log("Loading work schedules...");
      // TODO: Call API GET /api/doctor/schedules
      
      const mockSchedules: WorkSchedule[] = [
        {
          ID: 1,
          NgayLamViec: "2025-07-29",
          Ca: "Sáng",
          GioBatDau: "07:00",
          GioKetThuc: "12:00",
          TrangThai: "Đang làm",
          SoBenhNhan: 15,
          GhiChu: "Ca khám bệnh thường"
        },
        {
          ID: 2,
          NgayLamViec: "2025-07-30",
          Ca: "Chiều",
          GioBatDau: "13:00",
          GioKetThuc: "17:00",
          TrangThai: "Đã đăng ký",
          SoBenhNhan: 0,
          GhiChu: "Ca trực"
        }
      ];
      
      setWorkSchedules(mockSchedules);
    } catch (error) {
      console.error("Error loading work schedules:", error);
      showNotification("Lỗi khi tải lịch làm việc", "error");
    }
  };

  const filterRecords = () => {
    let filtered = medicalRecords;
    
    if (recordSearchTerm) {
      filtered = filtered.filter(record => 
        record.MaPhieu.toLowerCase().includes(recordSearchTerm.toLowerCase()) ||
        record.TenBenhNhan.toLowerCase().includes(recordSearchTerm.toLowerCase()) ||
        record.ChuanDoan.toLowerCase().includes(recordSearchTerm.toLowerCase())
      );
    }
    
    if (recordTypeFilter) {
      filtered = filtered.filter(record => record.LoaiPhieu === recordTypeFilter);
    }
    
    if (recordStatusFilter) {
      filtered = filtered.filter(record => record.TrangThai === recordStatusFilter);
    }
    
    setFilteredRecords(filtered);
  };

  const filterSchedules = () => {
    let filtered = workSchedules;
    
    if (scheduleSearchTerm) {
      filtered = filtered.filter(schedule => 
        schedule.NgayLamViec.includes(scheduleSearchTerm) ||
        schedule.Ca.toLowerCase().includes(scheduleSearchTerm.toLowerCase())
      );
    }
    
    if (scheduleStatusFilter) {
      filtered = filtered.filter(schedule => schedule.TrangThai === scheduleStatusFilter);
    }
    
    setFilteredSchedules(filtered);
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getStatusChip = (status: string, type: 'record' | 'schedule') => {
    const configs = {
      record: {
        "Đang điều trị": { color: "info", bgcolor: "#e3f2fd" },
        "Hoàn thành": { color: "success", bgcolor: "#e8f5e8" },
        "Chờ xử lý": { color: "warning", bgcolor: "#fff3e0" }
      },
      schedule: {
        "Đã đăng ký": { color: "primary", bgcolor: "#e3f2fd" },
        "Đang làm": { color: "success", bgcolor: "#e8f5e8" },
        "Hoàn thành": { color: "default", bgcolor: "#f5f5f5" },
        "Nghỉ": { color: "error", bgcolor: "#ffebee" }
      }
    } as const;
    
    const config = configs[type][status as keyof typeof configs[typeof type]] || { color: "default", bgcolor: "#f5f5f5" };
    
    return (
      <Chip 
        label={status}
        size="small"
        sx={{ 
          fontWeight: 500,
          color: config.color === "default" ? "#5f6c7b" : "inherit",
          bgcolor: config.bgcolor
        }}
      />
    );
  };

  const getTypeChip = (type: string) => {
    const colors = {
      "Khám bệnh": "#3da9fc",
      "Nhập viện": "#ef4565", 
      "Xuất viện": "#28a745",
      "Chỉ định dịch vụ": "#90b4ce"
    } as const;
    
    return (
      <Chip 
        label={type}
        size="small"
        sx={{ 
          bgcolor: colors[type as keyof typeof colors] || "#5f6c7b",
          color: "#fffffe",
          fontWeight: 500 
        }}
      />
    );
  };

  const getShiftChip = (shift: string) => {
    const colors = {
      "Sáng": "#3da9fc",
      "Chiều": "#ef4565",
      "Tối": "#90b4ce", 
      "Đêm": "#094067"
    } as const;
    
    return (
      <Chip 
        label={shift}
        size="small"
        sx={{ 
          bgcolor: colors[shift as keyof typeof colors] || "#5f6c7b",
          color: "#fffffe",
          fontWeight: 500 
        }}
      />
    );
  };

  // Medical Record Functions
  const handleCreateRecord = () => {
    setRecordFormData({
      loaiPhieu: "Khám bệnh",
      benhNhanID: "",
      tenBenhNhan: "",
      ngaySinh: "",
      gioiTinh: "Nam",
      chuanDoan: "",
      huongDieuTri: "",
      ghiChu: "",
      dichVu: "",
      phongBenh: "",
      ngayNhapVien: "",
      ngayXuatVien: "",
      lyDoXuatVien: ""
    });
    setActiveStep(0);
    setRecordDialogMode('create');
    setOpenRecordDialog(true);
  };

  const handleEditRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setRecordFormData({
      loaiPhieu: record.LoaiPhieu,
      benhNhanID: record.BenhNhanID.toString(),
      tenBenhNhan: record.TenBenhNhan,
      ngaySinh: record.NgaySinh,
      gioiTinh: record.GioiTinh,
      chuanDoan: record.ChuanDoan,
      huongDieuTri: record.HuongDieuTri,
      ghiChu: "",
      dichVu: "",
      phongBenh: "",
      ngayNhapVien: "",
      ngayXuatVien: "",
      lyDoXuatVien: ""
    });
    setActiveStep(0);
    setRecordDialogMode('edit');
    setOpenRecordDialog(true);
  };

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setRecordDialogMode('view');
    setOpenRecordDialog(true);
  };

  const handleSubmitRecord = async () => {
    try {
      const isEdit = recordDialogMode === 'edit';
      console.log(isEdit ? "Updating medical record:" : "Creating medical record:", recordFormData);
      
      // TODO: Call API POST/PUT /api/doctor/medical-records
      
      showNotification(
        isEdit ? "Cập nhật phiếu thành công" : "Tạo phiếu thành công",
        "success"
      );
      setOpenRecordDialog(false);
      setActiveStep(0);
      loadMedicalRecords();
      loadDoctorStats();
    } catch (error) {
      console.error("Error submitting medical record:", error);
      showNotification("Lỗi khi lưu phiếu y tế", "error");
    }
  };

  // Work Schedule Functions
  const handleCreateSchedule = () => {
    setScheduleFormData({
      ngayLamViec: "",
      ca: "Sáng",
      gioBatDau: "",
      gioKetThuc: "",
      ghiChu: ""
    });
    setScheduleDialogMode('create');
    setOpenScheduleDialog(true);
  };

  const handleEditSchedule = (schedule: WorkSchedule) => {
    setSelectedSchedule(schedule);
    setScheduleFormData({
      ngayLamViec: schedule.NgayLamViec,
      ca: schedule.Ca,
      gioBatDau: schedule.GioBatDau,
      gioKetThuc: schedule.GioKetThuc,
      ghiChu: schedule.GhiChu || ""
    });
    setScheduleDialogMode('edit');
    setOpenScheduleDialog(true);
  };

  const handleViewSchedule = (schedule: WorkSchedule) => {
    setSelectedSchedule(schedule);
    setScheduleDialogMode('view');
    setOpenScheduleDialog(true);
  };

  const handleSubmitSchedule = async () => {
    try {
      const isEdit = scheduleDialogMode === 'edit';
      console.log(isEdit ? "Updating schedule:" : "Creating schedule:", scheduleFormData);
      
      // TODO: Call API POST/PUT /api/doctor/schedules
      
      showNotification(
        isEdit ? "Cập nhật lịch làm việc thành công" : "Đăng ký lịch làm việc thành công",
        "success"
      );
      setOpenScheduleDialog(false);
      loadWorkSchedules();
      loadDoctorStats();
    } catch (error) {
      console.error("Error submitting schedule:", error);
      showNotification("Lỗi khi lưu lịch làm việc", "error");
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderRecordStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Loại phiếu</InputLabel>
                <Select
                  value={recordFormData.loaiPhieu}
                  label="Loại phiếu"
                  onChange={(e) => setRecordFormData({ ...recordFormData, loaiPhieu: e.target.value })}
                >
                  <MenuItem value="Khám bệnh">Phiếu khám bệnh</MenuItem>
                  <MenuItem value="Nhập viện">Phiếu nhập viện</MenuItem>
                  <MenuItem value="Xuất viện">Phiếu xuất viện</MenuItem>
                  <MenuItem value="Chỉ định dịch vụ">Phiếu chỉ định dịch vụ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ID Bệnh nhân"
                value={recordFormData.benhNhanID}
                onChange={(e) => setRecordFormData({ ...recordFormData, benhNhanID: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên bệnh nhân"
                value={recordFormData.tenBenhNhan}
                onChange={(e) => setRecordFormData({ ...recordFormData, tenBenhNhan: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày sinh"
                type="date"
                value={recordFormData.ngaySinh}
                onChange={(e) => setRecordFormData({ ...recordFormData, ngaySinh: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={recordFormData.gioiTinh}
                  label="Giới tính"
                  onChange={(e) => setRecordFormData({ ...recordFormData, gioiTinh: e.target.value })}
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Chuẩn đoán"
                value={recordFormData.chuanDoan}
                onChange={(e) => setRecordFormData({ ...recordFormData, chuanDoan: e.target.value })}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hướng điều trị"
                value={recordFormData.huongDieuTri}
                onChange={(e) => setRecordFormData({ ...recordFormData, huongDieuTri: e.target.value })}
                multiline
                rows={3}
                required
              />
            </Grid>
            {recordFormData.loaiPhieu === "Chỉ định dịch vụ" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dịch vụ chỉ định"
                  value={recordFormData.dichVu}
                  onChange={(e) => setRecordFormData({ ...recordFormData, dichVu: e.target.value })}
                  multiline
                  rows={2}
                />
              </Grid>
            )}
            {recordFormData.loaiPhieu === "Nhập viện" && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phòng bệnh"
                    value={recordFormData.phongBenh}
                    onChange={(e) => setRecordFormData({ ...recordFormData, phongBenh: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ngày nhập viện"
                    type="date"
                    value={recordFormData.ngayNhapVien}
                    onChange={(e) => setRecordFormData({ ...recordFormData, ngayNhapVien: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}
            {recordFormData.loaiPhieu === "Xuất viện" && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ngày xuất viện"
                    type="date"
                    value={recordFormData.ngayXuatVien}
                    onChange={(e) => setRecordFormData({ ...recordFormData, ngayXuatVien: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Lý do xuất viện"
                    value={recordFormData.lyDoXuatVien}
                    onChange={(e) => setRecordFormData({ ...recordFormData, lyDoXuatVien: e.target.value })}
                    multiline
                    rows={2}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                value={recordFormData.ghiChu}
                onChange={(e) => setRecordFormData({ ...recordFormData, ghiChu: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ color: "#094067", mb: 3 }}>
              Xác nhận thông tin phiếu y tế
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, bgcolor: "#f8f9fa" }}>
                  <Typography variant="subtitle1" sx={{ color: "#094067", fontWeight: 600, mb: 2 }}>
                    Thông tin bệnh nhân
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography><strong>Loại phiếu:</strong> {getTypeChip(recordFormData.loaiPhieu)}</Typography>
                    <Typography><strong>ID:</strong> {recordFormData.benhNhanID}</Typography>
                    <Typography><strong>Họ tên:</strong> {recordFormData.tenBenhNhan}</Typography>
                    <Typography><strong>Ngày sinh:</strong> {recordFormData.ngaySinh ? new Date(recordFormData.ngaySinh).toLocaleDateString('vi-VN') : ""}</Typography>
                    <Typography><strong>Giới tính:</strong> {recordFormData.gioiTinh}</Typography>
                  </Box>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, bgcolor: "#f8f9fa" }}>
                  <Typography variant="subtitle1" sx={{ color: "#094067", fontWeight: 600, mb: 2 }}>
                    Thông tin y tế
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography><strong>Chuẩn đoán:</strong> {recordFormData.chuanDoan}</Typography>
                    <Typography><strong>Hướng điều trị:</strong> {recordFormData.huongDieuTri}</Typography>
                    {recordFormData.dichVu && (
                      <Typography><strong>Dịch vụ:</strong> {recordFormData.dichVu}</Typography>
                    )}
                    {recordFormData.phongBenh && (
                      <Typography><strong>Phòng bệnh:</strong> {recordFormData.phongBenh}</Typography>
                    )}
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Không gian làm việc bác sĩ
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Quản lý phiếu y tế và lịch làm việc
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #3da9fc" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Assignment sx={{ fontSize: 40, color: "#3da9fc" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {doctorStats.phieuHomNay}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Phiếu hôm nay
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #ef4565" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <LocalHospital sx={{ fontSize: 40, color: "#ef4565" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {doctorStats.benhNhanDangDieuTri}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Đang điều trị
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #28a745" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Schedule sx={{ fontSize: 40, color: "#28a745" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {doctorStats.lichLamViecTuan}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Lịch tuần này
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #90b4ce" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AssignmentInd sx={{ fontSize: 40, color: "#90b4ce" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {doctorStats.phieuHoanThanh}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Phiếu hoàn thành
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              color: '#5f6c7b'
            },
            '& .Mui-selected': {
              color: '#094067'
            }
          }}
        >
          <Tab icon={<Assignment />} label="Quản lý phiếu y tế" />
          <Tab icon={<CalendarToday />} label="Lịch làm việc" />
        </Tabs>

        {/* Medical Records Tab */}
        {currentTab === 0 && (
          <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600 }}>
                Danh sách phiếu y tế
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateRecord}
                sx={{
                  bgcolor: "#3da9fc",
                  "&:hover": { bgcolor: "#2b8fd1" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                Tạo phiếu mới
              </Button>
            </Box>

            {/* Record Filters */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm phiếu, bệnh nhân..."
                  value={recordSearchTerm}
                  onChange={(e) => setRecordSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ color: "#5f6c7b", mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Loại phiếu</InputLabel>
                  <Select
                    value={recordTypeFilter}
                    label="Loại phiếu"
                    onChange={(e) => setRecordTypeFilter(e.target.value)}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="Khám bệnh">Khám bệnh</MenuItem>
                    <MenuItem value="Nhập viện">Nhập viện</MenuItem>
                    <MenuItem value="Xuất viện">Xuất viện</MenuItem>
                    <MenuItem value="Chỉ định dịch vụ">Chỉ định dịch vụ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={recordStatusFilter}
                    label="Trạng thái"
                    onChange={(e) => setRecordStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="Đang điều trị">Đang điều trị</MenuItem>
                    <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                    <MenuItem value="Chờ xử lý">Chờ xử lý</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Records Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Mã phiếu</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Loại phiếu</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Chuẩn đoán</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ngày tạo</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRecords
                    .slice(recordPage * recordRowsPerPage, recordPage * recordRowsPerPage + recordRowsPerPage)
                    .map((record) => (
                    <TableRow key={record.ID} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                          {record.MaPhieu}
                        </Typography>
                      </TableCell>
                      <TableCell>{getTypeChip(record.LoaiPhieu)}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: "#3da9fc", width: 32, height: 32 }}>
                            {record.TenBenhNhan.split(' ').slice(-1)[0][0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ color: "#094067", fontWeight: 600 }}>
                              {record.TenBenhNhan}
                            </Typography>
                            <Typography variant="body2" color="#5f6c7b">
                              {record.GioiTinh} - {new Date(record.NgaySinh).toLocaleDateString('vi-VN')}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          color="#5f6c7b"
                          sx={{ 
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {record.ChuanDoan}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#5f6c7b">
                          {new Date(record.NgayTao).toLocaleDateString('vi-VN')}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(record.TrangThai, 'record')}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewRecord(record)}
                            sx={{ color: "#3da9fc" }}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEditRecord(record)}
                            sx={{ color: "#90b4ce" }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: "#ef4565" }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRecords.length}
              rowsPerPage={recordRowsPerPage}
              page={recordPage}
              onPageChange={(_, newPage) => setRecordPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRecordRowsPerPage(parseInt(e.target.value, 10));
                setRecordPage(0);
              }}
            />
          </Box>
        )}

        {/* Work Schedule Tab */}
        {currentTab === 1 && (
          <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600 }}>
                Lịch làm việc
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateSchedule}
                sx={{
                  bgcolor: "#3da9fc",
                  "&:hover": { bgcolor: "#2b8fd1" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                Đăng ký ca làm
              </Button>
            </Box>

            {/* Schedule Filters */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm theo ngày, ca..."
                  value={scheduleSearchTerm}
                  onChange={(e) => setScheduleSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ color: "#5f6c7b", mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={scheduleStatusFilter}
                    label="Trạng thái"
                    onChange={(e) => setScheduleStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="Đã đăng ký">Đã đăng ký</MenuItem>
                    <MenuItem value="Đang làm">Đang làm</MenuItem>
                    <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                    <MenuItem value="Nghỉ">Nghỉ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Schedule Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ngày làm việc</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ca</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thời gian</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Số bệnh nhân</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ghi chú</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSchedules
                    .slice(schedulePage * scheduleRowsPerPage, schedulePage * scheduleRowsPerPage + scheduleRowsPerPage)
                    .map((schedule) => (
                    <TableRow key={schedule.ID} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                          {new Date(schedule.NgayLamViec).toLocaleDateString('vi-VN')}
                        </Typography>
                      </TableCell>
                      <TableCell>{getShiftChip(schedule.Ca)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#5f6c7b">
                          {schedule.GioBatDau} - {schedule.GioKetThuc}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#094067", fontWeight: 600 }}>
                          {schedule.SoBenhNhan} bệnh nhân
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(schedule.TrangThai, 'schedule')}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#5f6c7b">
                          {schedule.GhiChu || "Không có"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewSchedule(schedule)}
                            sx={{ color: "#3da9fc" }}
                          >
                            <Visibility />
                          </IconButton>
                          {schedule.TrangThai === "Đã đăng ký" && (
                            <>
                              <IconButton
                                size="small"
                                onClick={() => handleEditSchedule(schedule)}
                                sx={{ color: "#90b4ce" }}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{ color: "#28a745" }}
                              >
                                <Login />
                              </IconButton>
                            </>
                          )}
                          {schedule.TrangThai === "Đang làm" && (
                            <IconButton
                              size="small"
                              sx={{ color: "#ef4565" }}
                            >
                              <ExitToApp />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredSchedules.length}
              rowsPerPage={scheduleRowsPerPage}
              page={schedulePage}
              onPageChange={(_, newPage) => setSchedulePage(newPage)}
              onRowsPerPageChange={(e) => {
                setScheduleRowsPerPage(parseInt(e.target.value, 10));
                setSchedulePage(0);
              }}
            />
          </Box>
        )}
      </Paper>

      {/* Medical Record Dialog */}
      <Dialog open={openRecordDialog} onClose={() => setOpenRecordDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          {recordDialogMode === 'create' ? 'Tạo phiếu y tế mới' : 
           recordDialogMode === 'edit' ? 'Cập nhật phiếu y tế' : 
           'Chi tiết phiếu y tế'}
        </DialogTitle>
        <DialogContent dividers>
          {recordDialogMode !== 'view' ? (
            <>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              {renderRecordStepContent(activeStep)}
            </>
          ) : (
            selectedRecord && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                    Thông tin phiếu
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography><strong>Mã phiếu:</strong> {selectedRecord.MaPhieu}</Typography>
                    <Typography><strong>Loại phiếu:</strong> {getTypeChip(selectedRecord.LoaiPhieu)}</Typography>
                    <Typography><strong>Ngày tạo:</strong> {new Date(selectedRecord.NgayTao).toLocaleDateString('vi-VN')}</Typography>
                    <Typography><strong>Bác sĩ phụ trách:</strong> {selectedRecord.BacSiPhuTrach}</Typography>
                    <Typography><strong>Khoa:</strong> {selectedRecord.Khoa}</Typography>
                    <Typography><strong>Trạng thái:</strong> {getStatusChip(selectedRecord.TrangThai, 'record')}</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                    Thông tin bệnh nhân
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography><strong>Họ tên:</strong> {selectedRecord.TenBenhNhan}</Typography>
                    <Typography><strong>Ngày sinh:</strong> {new Date(selectedRecord.NgaySinh).toLocaleDateString('vi-VN')}</Typography>
                    <Typography><strong>Giới tính:</strong> {selectedRecord.GioiTinh}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                    Thông tin y tế
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Chuẩn đoán:
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        {selectedRecord.ChuanDoan}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Hướng điều trị:
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        {selectedRecord.HuongDieuTri}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpenRecordDialog(false)} 
            color="inherit"
            startIcon={<Cancel />}
          >
            {recordDialogMode === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          {recordDialogMode !== 'view' && (
            <>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Quay lại
                </Button>
              )}
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmitRecord}
                  startIcon={<Save />}
                  sx={{
                    bgcolor: "#3da9fc",
                    "&:hover": { bgcolor: "#2b8fd1" }
                  }}
                >
                  {recordDialogMode === 'create' ? 'Tạo phiếu' : 'Cập nhật'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    bgcolor: "#3da9fc",
                    "&:hover": { bgcolor: "#2b8fd1" }
                  }}
                >
                  Tiếp theo
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Work Schedule Dialog */}
      <Dialog open={openScheduleDialog} onClose={() => setOpenScheduleDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          {scheduleDialogMode === 'create' ? 'Đăng ký ca làm việc' : 
           scheduleDialogMode === 'edit' ? 'Cập nhật lịch làm việc' : 
           'Chi tiết lịch làm việc'}
        </DialogTitle>
        <DialogContent dividers>
          {scheduleDialogMode !== 'view' ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ngày làm việc"
                  type="date"
                  value={scheduleFormData.ngayLamViec}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, ngayLamViec: e.target.value })}
                  disabled={scheduleDialogMode !== 'create' && scheduleDialogMode !== 'edit'}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth disabled={scheduleDialogMode !== 'create' && scheduleDialogMode !== 'edit'}>
                  <InputLabel>Ca làm việc</InputLabel>
                  <Select
                    value={scheduleFormData.ca}
                    label="Ca làm việc"
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, ca: e.target.value })}
                  >
                    <MenuItem value="Sáng">Ca sáng</MenuItem>
                    <MenuItem value="Chiều">Ca chiều</MenuItem>
                    <MenuItem value="Tối">Ca tối</MenuItem>
                    <MenuItem value="Đêm">Ca đêm</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Giờ bắt đầu"
                  type="time"
                  value={scheduleFormData.gioBatDau}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, gioBatDau: e.target.value })}
                  disabled={scheduleDialogMode !== 'create' && scheduleDialogMode !== 'edit'}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Giờ kết thúc"
                  type="time"
                  value={scheduleFormData.gioKetThuc}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, gioKetThuc: e.target.value })}
                  disabled={scheduleDialogMode !== 'create' && scheduleDialogMode !== 'edit'}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  value={scheduleFormData.ghiChu}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, ghiChu: e.target.value })}
                  disabled={scheduleDialogMode !== 'create' && scheduleDialogMode !== 'edit'}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          ) : (
            selectedSchedule && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                    Chi tiết lịch làm việc
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Typography><strong>Ngày làm việc:</strong> {new Date(selectedSchedule.NgayLamViec).toLocaleDateString('vi-VN')}</Typography>
                    <Typography><strong>Ca:</strong> {getShiftChip(selectedSchedule.Ca)}</Typography>
                    <Typography><strong>Thời gian:</strong> {selectedSchedule.GioBatDau} - {selectedSchedule.GioKetThuc}</Typography>
                    <Typography><strong>Số bệnh nhân:</strong> {selectedSchedule.SoBenhNhan}</Typography>
                    <Typography><strong>Trạng thái:</strong> {getStatusChip(selectedSchedule.TrangThai, 'schedule')}</Typography>
                    <Typography><strong>Ghi chú:</strong> {selectedSchedule.GhiChu || "Không có"}</Typography>
                  </Box>
                </Grid>
              </Grid>
            )
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpenScheduleDialog(false)} 
            color="inherit"
            startIcon={<Cancel />}
          >
            {scheduleDialogMode === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          {scheduleDialogMode !== 'view' && (
            <Button
              variant="contained"
              onClick={handleSubmitSchedule}
              startIcon={<Save />}
              sx={{
                bgcolor: "#3da9fc",
                "&:hover": { bgcolor: "#2b8fd1" }
              }}
            >
              {scheduleDialogMode === 'create' ? 'Đăng ký' : 'Cập nhật'}
            </Button>
          )}
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
    </Container>
  );
};

export default DoctorWorkspace;
