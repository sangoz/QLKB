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
  Divider,
  Paper
} from "@mui/material";
import {
  Person,
  MedicalServices,
  School,
  Medication,
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  Save,
  Cancel,
  Assignment,
  SupervisorAccount,
  LocalHospital,
  Group
} from "@mui/icons-material";

interface Staff {
  ID: number;
  MaNhanVien: string;
  HoTen: string;
  ChucVu: string;
  KhoaID?: number;
  TenKhoa?: string;
  Email: string;
  SoDienThoai: string;
  NgayVaoLam: string;
  TrangThai: 'Đang làm việc' | 'Nghỉ phép' | 'Đã nghỉ việc';
  Luong: number;
}

interface Department {
  ID: number;
  MaKhoa: string;
  TenKhoa: string;
  MoTa: string;
  TruongKhoa: string;
  SoNhanVien: number;
  TrangThai: 'Hoạt động' | 'Tạm dừng';
  NgayThanhLap: string;
}

interface Service {
  ID: number;
  MaDichVu: string;
  TenDichVu: string;
  LoaiDichVu: string;
  Gia: number;
  KhoaID?: number;
  TenKhoa?: string;
  MoTa: string;
  TrangThai: 'Hoạt động' | 'Ngừng cung cấp';
}

interface Medicine {
  ID: number;
  MaThuoc: string;
  TenThuoc: string;
  HoatChat: string;
  DonVi: string;
  GiaNhap: number;
  GiaBan: number;
  SoLuongTon: number;
  HanSuDung: string;
  NhaCungCap: string;
  TrangThai: 'Còn hàng' | 'Hết hàng' | 'Sắp hết';
}

interface DirectorStats {
  tongNhanVien: number;
  nhanVienHoatDong: number;
  tongKhoa: number;
  tongDichVu: number;
  tongThuoc: number;
  thuocSapHet: number;
}

const DirectorManagement: FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [directorStats, setDirectorStats] = useState<DirectorStats>({
    tongNhanVien: 0,
    nhanVienHoatDong: 0,
    tongKhoa: 0,
    tongDichVu: 0,
    tongThuoc: 0,
    thuocSapHet: 0
  });

  // Staff Management State
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [staffPage, setStaffPage] = useState(0);
  const [staffRowsPerPage, setStaffRowsPerPage] = useState(10);
  const [staffSearchTerm, setStaffSearchTerm] = useState("");
  const [staffPositionFilter, setStaffPositionFilter] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [openStaffDialog, setOpenStaffDialog] = useState(false);
  const [staffDialogMode, setStaffDialogMode] = useState<'create' | 'edit' | 'view'>('create');

  // Department Management State
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [deptPage, setDeptPage] = useState(0);
  const [deptRowsPerPage, setDeptRowsPerPage] = useState(10);
  const [deptSearchTerm, setDeptSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [openDeptDialog, setOpenDeptDialog] = useState(false);
  const [deptDialogMode, setDeptDialogMode] = useState<'create' | 'edit' | 'view'>('create');

  // Service Management State
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [servicePage, setServicePage] = useState(0);
  const [serviceRowsPerPage, setServiceRowsPerPage] = useState(10);
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [serviceDialogMode, setServiceDialogMode] = useState<'create' | 'edit' | 'view'>('create');

  // Medicine Management State
  const [medicineList, setMedicineList] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [medicinePage, setMedicinePage] = useState(0);
  const [medicineRowsPerPage, setMedicineRowsPerPage] = useState(10);
  const [medicineSearchTerm, setMedicineSearchTerm] = useState("");
  const [medicineStatusFilter, setMedicineStatusFilter] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [openMedicineDialog, setOpenMedicineDialog] = useState(false);
  const [medicineDialogMode, setMedicineDialogMode] = useState<'create' | 'edit' | 'view'>('create');

  // Form Data States
  const [staffFormData, setStaffFormData] = useState({
    maNhanVien: "",
    hoTen: "",
    chucVu: "",
    khoaID: "",
    email: "",
    soDienThoai: "",
    ngayVaoLam: "",
    luong: ""
  });

  const [deptFormData, setDeptFormData] = useState({
    maKhoa: "",
    tenKhoa: "",
    moTa: "",
    truongKhoa: "",
    ngayThanhLap: ""
  });

  const [serviceFormData, setServiceFormData] = useState({
    maDichVu: "",
    tenDichVu: "",
    loaiDichVu: "",
    gia: "",
    khoaID: "",
    moTa: ""
  });

  const [medicineFormData, setMedicineFormData] = useState({
    maThuoc: "",
    tenThuoc: "",
    hoatChat: "",
    donVi: "",
    giaNhap: "",
    giaBan: "",
    soLuongTon: "",
    hanSuDung: "",
    nhaCungCap: ""
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

  useEffect(() => {
    loadDirectorStats();
    loadStaffList();
    loadDepartmentList();
    loadServiceList();
    loadMedicineList();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [staffList, staffSearchTerm, staffPositionFilter]);

  useEffect(() => {
    filterDepartments();
  }, [departmentList, deptSearchTerm]);

  useEffect(() => {
    filterServices();
  }, [serviceList, serviceSearchTerm, serviceTypeFilter]);

  useEffect(() => {
    filterMedicines();
  }, [medicineList, medicineSearchTerm, medicineStatusFilter]);

  const loadDirectorStats = async () => {
    try {
      console.log("Loading director statistics...");
      // TODO: Call API GET /api/director/stats
      
      const mockStats: DirectorStats = {
        tongNhanVien: 125,
        nhanVienHoatDong: 118,
        tongKhoa: 8,
        tongDichVu: 45,
        tongThuoc: 350,
        thuocSapHet: 12
      };
      
      setDirectorStats(mockStats);
    } catch (error) {
      console.error("Error loading director stats:", error);
    }
  };

  const loadStaffList = async () => {
    try {
      console.log("Loading staff list...");
      // TODO: Call API GET /api/director/staff
      
      const mockStaff: Staff[] = [
        {
          ID: 1,
          MaNhanVien: "NV001",
          HoTen: "BS. Nguyễn Văn An",
          ChucVu: "Bác sĩ",
          KhoaID: 1,
          TenKhoa: "Khoa Nội",
          Email: "bs.an@hospital.com",
          SoDienThoai: "0901234567",
          NgayVaoLam: "2020-01-15",
          TrangThai: "Đang làm việc",
          Luong: 25000000
        },
        {
          ID: 2,
          MaNhanVien: "NV002",
          HoTen: "Y tá Trần Thị Bình",
          ChucVu: "Y tá",
          KhoaID: 2,
          TenKhoa: "Khoa Ngoại",
          Email: "yta.binh@hospital.com",
          SoDienThoai: "0907654321",
          NgayVaoLam: "2021-03-10",
          TrangThai: "Đang làm việc",
          Luong: 12000000
        }
      ];
      
      setStaffList(mockStaff);
    } catch (error) {
      console.error("Error loading staff list:", error);
      showNotification("Lỗi khi tải danh sách nhân sự", "error");
    }
  };

  const loadDepartmentList = async () => {
    try {
      console.log("Loading department list...");
      // TODO: Call API GET /api/director/departments
      
      const mockDepartments: Department[] = [
        {
          ID: 1,
          MaKhoa: "KN",
          TenKhoa: "Khoa Nội",
          MoTa: "Khoa điều trị các bệnh nội khoa",
          TruongKhoa: "BS. Lê Văn Minh",
          SoNhanVien: 25,
          TrangThai: "Hoạt động",
          NgayThanhLap: "2010-01-01"
        },
        {
          ID: 2,
          MaKhoa: "KNG",
          TenKhoa: "Khoa Ngoại",
          MoTa: "Khoa phẫu thuật và điều trị ngoại khoa",
          TruongKhoa: "BS. Nguyễn Thị Lan",
          SoNhanVien: 30,
          TrangThai: "Hoạt động",
          NgayThanhLap: "2010-01-01"
        }
      ];
      
      setDepartmentList(mockDepartments);
    } catch (error) {
      console.error("Error loading department list:", error);
      showNotification("Lỗi khi tải danh sách khoa", "error");
    }
  };

  const loadServiceList = async () => {
    try {
      console.log("Loading service list...");
      // TODO: Call API GET /api/director/services
      
      const mockServices: Service[] = [
        {
          ID: 1,
          MaDichVu: "DV001",
          TenDichVu: "Khám tổng quát",
          LoaiDichVu: "Khám bệnh",
          Gia: 200000,
          KhoaID: 1,
          TenKhoa: "Khoa Nội",
          MoTa: "Khám sức khỏe tổng quát",
          TrangThai: "Hoạt động"
        },
        {
          ID: 2,
          MaDichVu: "DV002",
          TenDichVu: "Siêu âm tim",
          LoaiDichVu: "Cận lâm sàng",
          Gia: 500000,
          KhoaID: 3,
          TenKhoa: "Khoa Tim mạch",
          MoTa: "Siêu âm Doppler tim",
          TrangThai: "Hoạt động"
        }
      ];
      
      setServiceList(mockServices);
    } catch (error) {
      console.error("Error loading service list:", error);
      showNotification("Lỗi khi tải danh sách dịch vụ", "error");
    }
  };

  const loadMedicineList = async () => {
    try {
      console.log("Loading medicine list...");
      // TODO: Call API GET /api/director/medicines
      
      const mockMedicines: Medicine[] = [
        {
          ID: 1,
          MaThuoc: "TH001",
          TenThuoc: "Paracetamol 500mg",
          HoatChat: "Paracetamol",
          DonVi: "Viên",
          GiaNhap: 1000,
          GiaBan: 1500,
          SoLuongTon: 500,
          HanSuDung: "2026-12-31",
          NhaCungCap: "Công ty TNHH Dược ABC",
          TrangThai: "Còn hàng"
        },
        {
          ID: 2,
          MaThuoc: "TH002",
          TenThuoc: "Amoxicillin 250mg",
          HoatChat: "Amoxicillin",
          DonVi: "Viên",
          GiaNhap: 2000,
          GiaBan: 3000,
          SoLuongTon: 15,
          HanSuDung: "2025-06-30",
          NhaCungCap: "Công ty TNHH Dược XYZ",
          TrangThai: "Sắp hết"
        }
      ];
      
      setMedicineList(mockMedicines);
    } catch (error) {
      console.error("Error loading medicine list:", error);
      showNotification("Lỗi khi tải danh sách thuốc", "error");
    }
  };

  const filterStaff = () => {
    let filtered = staffList;
    
    if (staffSearchTerm) {
      filtered = filtered.filter(staff => 
        staff.MaNhanVien.toLowerCase().includes(staffSearchTerm.toLowerCase()) ||
        staff.HoTen.toLowerCase().includes(staffSearchTerm.toLowerCase()) ||
        staff.Email.toLowerCase().includes(staffSearchTerm.toLowerCase()) ||
        staff.SoDienThoai.includes(staffSearchTerm)
      );
    }
    
    if (staffPositionFilter) {
      filtered = filtered.filter(staff => staff.ChucVu === staffPositionFilter);
    }
    
    setFilteredStaff(filtered);
  };

  const filterDepartments = () => {
    let filtered = departmentList;
    
    if (deptSearchTerm) {
      filtered = filtered.filter(dept => 
        dept.MaKhoa.toLowerCase().includes(deptSearchTerm.toLowerCase()) ||
        dept.TenKhoa.toLowerCase().includes(deptSearchTerm.toLowerCase()) ||
        dept.TruongKhoa.toLowerCase().includes(deptSearchTerm.toLowerCase())
      );
    }
    
    setFilteredDepartments(filtered);
  };

  const filterServices = () => {
    let filtered = serviceList;
    
    if (serviceSearchTerm) {
      filtered = filtered.filter(service => 
        service.MaDichVu.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
        service.TenDichVu.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
        service.TenKhoa?.toLowerCase().includes(serviceSearchTerm.toLowerCase())
      );
    }
    
    if (serviceTypeFilter) {
      filtered = filtered.filter(service => service.LoaiDichVu === serviceTypeFilter);
    }
    
    setFilteredServices(filtered);
  };

  const filterMedicines = () => {
    let filtered = medicineList;
    
    if (medicineSearchTerm) {
      filtered = filtered.filter(medicine => 
        medicine.MaThuoc.toLowerCase().includes(medicineSearchTerm.toLowerCase()) ||
        medicine.TenThuoc.toLowerCase().includes(medicineSearchTerm.toLowerCase()) ||
        medicine.HoatChat.toLowerCase().includes(medicineSearchTerm.toLowerCase()) ||
        medicine.NhaCungCap.toLowerCase().includes(medicineSearchTerm.toLowerCase())
      );
    }
    
    if (medicineStatusFilter) {
      filtered = filtered.filter(medicine => medicine.TrangThai === medicineStatusFilter);
    }
    
    setFilteredMedicines(filtered);
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const getStatusChip = (status: string, type: 'staff' | 'department' | 'service' | 'medicine') => {
    const configs = {
      staff: {
        "Đang làm việc": { color: "success", icon: null },
        "Nghỉ phép": { color: "warning", icon: null },
        "Đã nghỉ việc": { color: "error", icon: null }
      },
      department: {
        "Hoạt động": { color: "success", icon: null },
        "Tạm dừng": { color: "error", icon: null }
      },
      service: {
        "Hoạt động": { color: "success", icon: null },
        "Ngừng cung cấp": { color: "error", icon: null }
      },
      medicine: {
        "Còn hàng": { color: "success", icon: null },
        "Hết hàng": { color: "error", icon: null },
        "Sắp hết": { color: "warning", icon: null }
      }
    } as const;
    
    const config = (configs[type] as any)?.[status] || { color: "default", icon: null };
    
    return (
      <Chip 
        label={status}
        color={(config.color || "default") as any}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Staff Management Functions
  const handleCreateStaff = () => {
    setStaffFormData({
      maNhanVien: "",
      hoTen: "",
      chucVu: "",
      khoaID: "",
      email: "",
      soDienThoai: "",
      ngayVaoLam: "",
      luong: ""
    });
    setStaffDialogMode('create');
    setOpenStaffDialog(true);
  };

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setStaffFormData({
      maNhanVien: staff.MaNhanVien,
      hoTen: staff.HoTen,
      chucVu: staff.ChucVu,
      khoaID: staff.KhoaID?.toString() || "",
      email: staff.Email,
      soDienThoai: staff.SoDienThoai,
      ngayVaoLam: staff.NgayVaoLam,
      luong: staff.Luong.toString()
    });
    setStaffDialogMode('edit');
    setOpenStaffDialog(true);
  };

  const handleViewStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setStaffDialogMode('view');
    setOpenStaffDialog(true);
  };

  const handleSubmitStaff = async () => {
    try {
      const isEdit = staffDialogMode === 'edit';
      console.log(isEdit ? "Updating staff:" : "Creating staff:", staffFormData);
      
      // TODO: Call API POST/PUT /api/director/staff
      
      showNotification(
        isEdit ? "Cập nhật nhân viên thành công" : "Thêm nhân viên thành công",
        "success"
      );
      setOpenStaffDialog(false);
      loadStaffList();
      loadDirectorStats();
    } catch (error) {
      console.error("Error submitting staff:", error);
      showNotification("Lỗi khi lưu thông tin nhân viên", "error");
    }
  };

  const handleDeleteStaff = async (staff: Staff) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên ${staff.HoTen}?`)) {
      try {
        console.log("Deleting staff:", staff.ID);
        // TODO: Call API DELETE /api/director/staff/{id}
        
        showNotification("Xóa nhân viên thành công", "success");
        loadStaffList();
        loadDirectorStats();
      } catch (error) {
        console.error("Error deleting staff:", error);
        showNotification("Lỗi khi xóa nhân viên", "error");
      }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Quản lý ban giám đốc
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Quản lý nhân sự, dịch vụ, chuyên khoa và thuốc
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #3da9fc" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <SupervisorAccount sx={{ fontSize: 32, color: "#3da9fc" }} />
                <Box>
                  <Typography variant="h5" sx={{ color: "#094067", fontWeight: 700 }}>
                    {directorStats.tongNhanVien}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng nhân viên
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #28a745" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Group sx={{ fontSize: 32, color: "#28a745" }} />
                <Box>
                  <Typography variant="h5" sx={{ color: "#094067", fontWeight: 700 }}>
                    {directorStats.nhanVienHoatDong}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Đang làm việc
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #ef4565" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <LocalHospital sx={{ fontSize: 32, color: "#ef4565" }} />
                <Box>
                  <Typography variant="h5" sx={{ color: "#094067", fontWeight: 700 }}>
                    {directorStats.tongKhoa}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng khoa
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #90b4ce" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <MedicalServices sx={{ fontSize: 32, color: "#90b4ce" }} />
                <Box>
                  <Typography variant="h5" sx={{ color: "#094067", fontWeight: 700 }}>
                    {directorStats.tongDichVu}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng dịch vụ
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #6f42c1" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Medication sx={{ fontSize: 32, color: "#6f42c1" }} />
                <Box>
                  <Typography variant="h5" sx={{ color: "#094067", fontWeight: 700 }}>
                    {directorStats.tongThuoc}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng thuốc
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #ffc107" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Assignment sx={{ fontSize: 32, color: "#ffc107" }} />
                <Box>
                  <Typography variant="h5" sx={{ color: "#094067", fontWeight: 700 }}>
                    {directorStats.thuocSapHet}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Thuốc sắp hết
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
          <Tab icon={<Person />} label="Quản lý nhân sự" />
          <Tab icon={<School />} label="Quản lý khoa" />
          <Tab icon={<MedicalServices />} label="Quản lý dịch vụ" />
          <Tab icon={<Medication />} label="Quản lý thuốc" />
        </Tabs>

        {/* Staff Management Tab */}
        {currentTab === 0 && (
          <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600 }}>
                Danh sách nhân sự
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateStaff}
                sx={{
                  bgcolor: "#3da9fc",
                  "&:hover": { bgcolor: "#2b8fd1" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                Thêm nhân viên
              </Button>
            </Box>

            {/* Staff Filters */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm nhân viên..."
                  value={staffSearchTerm}
                  onChange={(e) => setStaffSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ color: "#5f6c7b", mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Chức vụ</InputLabel>
                  <Select
                    value={staffPositionFilter}
                    label="Chức vụ"
                    onChange={(e) => setStaffPositionFilter(e.target.value)}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="Bác sĩ">Bác sĩ</MenuItem>
                    <MenuItem value="Y tá">Y tá</MenuItem>
                    <MenuItem value="Nhân viên">Nhân viên</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Staff Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Mã NV</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Họ tên</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Chức vụ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Khoa</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Liên hệ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Lương</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStaff
                    .slice(staffPage * staffRowsPerPage, staffPage * staffRowsPerPage + staffRowsPerPage)
                    .map((staff) => (
                    <TableRow key={staff.ID} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                          {staff.MaNhanVien}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: "#3da9fc", width: 32, height: 32 }}>
                            {staff.HoTen.split(' ').slice(-1)[0][0]}
                          </Avatar>
                          <Typography variant="body2" sx={{ color: "#094067", fontWeight: 600 }}>
                            {staff.HoTen}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={staff.ChucVu}
                          size="small"
                          sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#5f6c7b">
                          {staff.TenKhoa || "Chưa phân khoa"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#5f6c7b">
                          {staff.Email}
                        </Typography>
                        <Typography variant="body2" color="#5f6c7b">
                          {staff.SoDienThoai}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#094067", fontWeight: 600 }}>
                          {formatCurrency(staff.Luong)}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(staff.TrangThai, 'staff')}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewStaff(staff)}
                            sx={{ color: "#3da9fc" }}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEditStaff(staff)}
                            sx={{ color: "#90b4ce" }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteStaff(staff)}
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
              count={filteredStaff.length}
              rowsPerPage={staffRowsPerPage}
              page={staffPage}
              onPageChange={(_, newPage) => setStaffPage(newPage)}
              onRowsPerPageChange={(e) => {
                setStaffRowsPerPage(parseInt(e.target.value, 10));
                setStaffPage(0);
              }}
            />
          </Box>
        )}

        {/* Other tabs would be implemented similarly... */}
        {currentTab === 1 && (
          <Box p={3}>
            <Typography variant="h6" sx={{ color: "#094067" }}>
              Quản lý khoa - Đang phát triển
            </Typography>
          </Box>
        )}

        {currentTab === 2 && (
          <Box p={3}>
            <Typography variant="h6" sx={{ color: "#094067" }}>
              Quản lý dịch vụ - Đang phát triển
            </Typography>
          </Box>
        )}

        {currentTab === 3 && (
          <Box p={3}>
            <Typography variant="h6" sx={{ color: "#094067" }}>
              Quản lý thuốc - Đang phát triển
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Staff Dialog */}
      <Dialog open={openStaffDialog} onClose={() => setOpenStaffDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          {staffDialogMode === 'create' ? 'Thêm nhân viên mới' : 
           staffDialogMode === 'edit' ? 'Cập nhật thông tin nhân viên' : 
           'Chi tiết nhân viên'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mã nhân viên"
                value={staffFormData.maNhanVien}
                onChange={(e) => setStaffFormData({ ...staffFormData, maNhanVien: e.target.value })}
                disabled={staffDialogMode === 'view'}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ tên"
                value={staffFormData.hoTen}
                onChange={(e) => setStaffFormData({ ...staffFormData, hoTen: e.target.value })}
                disabled={staffDialogMode === 'view'}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={staffDialogMode === 'view'}>
                <InputLabel>Chức vụ</InputLabel>
                <Select
                  value={staffFormData.chucVu}
                  label="Chức vụ"
                  onChange={(e) => setStaffFormData({ ...staffFormData, chucVu: e.target.value })}
                >
                  <MenuItem value="Bác sĩ">Bác sĩ</MenuItem>
                  <MenuItem value="Y tá">Y tá</MenuItem>
                  <MenuItem value="Nhân viên">Nhân viên</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Khoa"
                value={staffFormData.khoaID}
                onChange={(e) => setStaffFormData({ ...staffFormData, khoaID: e.target.value })}
                disabled={staffDialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={staffFormData.email}
                onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                disabled={staffDialogMode === 'view'}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={staffFormData.soDienThoai}
                onChange={(e) => setStaffFormData({ ...staffFormData, soDienThoai: e.target.value })}
                disabled={staffDialogMode === 'view'}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày vào làm"
                type="date"
                value={staffFormData.ngayVaoLam}
                onChange={(e) => setStaffFormData({ ...staffFormData, ngayVaoLam: e.target.value })}
                disabled={staffDialogMode === 'view'}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lương (VND)"
                type="number"
                value={staffFormData.luong}
                onChange={(e) => setStaffFormData({ ...staffFormData, luong: e.target.value })}
                disabled={staffDialogMode === 'view'}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpenStaffDialog(false)} 
            color="inherit"
            startIcon={<Cancel />}
          >
            {staffDialogMode === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          {staffDialogMode !== 'view' && (
            <Button
              variant="contained"
              onClick={handleSubmitStaff}
              startIcon={<Save />}
              sx={{
                bgcolor: "#3da9fc",
                "&:hover": { bgcolor: "#2b8fd1" }
              }}
            >
              {staffDialogMode === 'create' ? 'Thêm' : 'Cập nhật'}
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

export default DirectorManagement;
