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
  Tabs,
  Tab,
  Paper
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Business,
  People,
  MedicalServices,
  LocalHospital,
  Settings,
  Inventory,
  Search,
  TrendingUp
} from "@mui/icons-material";

interface Employee {
  ID: number;
  HoTen: string;
  Email: string;
  SoDienThoai: string;
  ChucVu: string;
  KhoaID: number;
  TenKhoa: string;
  LoaiNhanVien: 'BacSi' | 'ThuNgan' | 'TiepNhan' | 'QuanLyNoiTru' | 'BanGiamDoc';
  TrangThai: 'Hoạt động' | 'Tạm dừng';
  NgayVaoLam: string;
  LuongCoBan: number;
}

interface Department {
  ID: number;
  TenKhoa: string;
  SoNhanVien: number;
  TrangThai: string;
}

interface Service {
  ID: number;
  TenDichVu: string;
  Gia: number;
  KhoaID: number;
  TenKhoa: string;
  TrangThai: string;
}

interface Medicine {
  ID: number;
  TenThuoc: string;
  DonVi: string;
  Gia: number;
  SoLuongTon: number;
  TrangThai: string;
}

const DirectorDashboard: FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Dialogs
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [openMedicineDialog, setOpenMedicineDialog] = useState(false);
  
  // Form data
  const [employeeData, setEmployeeData] = useState({
    HoTen: "",
    Email: "",
    SoDienThoai: "",
    ChucVu: "",
    KhoaID: "",
    LoaiNhanVien: "BacSi" as const,
    LuongCoBan: 0
  });
  
  const [serviceData, setServiceData] = useState({
    TenDichVu: "",
    Gia: 0,
    KhoaID: "",
    MoTa: ""
  });
  
  const [medicineData, setMedicineData] = useState({
    TenThuoc: "",
    DonVi: "",
    Gia: 0,
    SoLuongTon: 0,
    MoTa: ""
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
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      console.log("Loading director dashboard data...");
      // TODO: Call multiple APIs for overview
      await Promise.all([
        loadEmployees(),
        loadDepartments(),
        loadServices(),
        loadMedicines()
      ]);
    } catch (error) {
      console.error("Error loading overview data:", error);
      showNotification("Lỗi khi tải dữ liệu tổng quan", "error");
    }
  };

  const loadEmployees = async () => {
    try {
      console.log("Loading employees...");
      // TODO: Call API GET /api/v1/nhanvien
      // Headers: Authorization: Bearer {access_token}
      // Response: Employee[] list of all employees
      
      // Mock data
      const mockEmployees: Employee[] = [
        {
          ID: 1,
          HoTen: "BS. Nguyễn Văn An",
          Email: "nva@hospital.com",
          SoDienThoai: "0901234567",
          ChucVu: "Bác sĩ trưởng khoa",
          KhoaID: 1,
          TenKhoa: "Khoa Nội",
          LoaiNhanVien: "BacSi",
          TrangThai: "Hoạt động",
          NgayVaoLam: "2020-01-15",
          LuongCoBan: 25000000
        },
        {
          ID: 2,
          HoTen: "Trần Thị Bình",
          Email: "ttb@hospital.com",
          SoDienThoai: "0907654321",
          ChucVu: "Thu ngân",
          KhoaID: 0,
          TenKhoa: "Phòng Tài chính",
          LoaiNhanVien: "ThuNgan",
          TrangThai: "Hoạt động",
          NgayVaoLam: "2021-03-10",
          LuongCoBan: 12000000
        }
      ];
      
      setEmployees(mockEmployees);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const loadDepartments = async () => {
    try {
      console.log("Loading departments...");
      // TODO: Call API GET /api/v1/khoa
      
      const mockDepartments: Department[] = [
        { ID: 1, TenKhoa: "Khoa Nội", SoNhanVien: 15, TrangThai: "Hoạt động" },
        { ID: 2, TenKhoa: "Khoa Ngoại", SoNhanVien: 12, TrangThai: "Hoạt động" },
        { ID: 3, TenKhoa: "Khoa Tim mạch", SoNhanVien: 8, TrangThai: "Hoạt động" }
      ];
      
      setDepartments(mockDepartments);
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  };

  const loadServices = async () => {
    try {
      console.log("Loading services...");
      // TODO: Call API GET /api/v1/dichvu
      
      const mockServices: Service[] = [
        { ID: 1, TenDichVu: "Khám tổng quát", Gia: 200000, KhoaID: 1, TenKhoa: "Khoa Nội", TrangThai: "Hoạt động" },
        { ID: 2, TenDichVu: "Siêu âm tim", Gia: 800000, KhoaID: 3, TenKhoa: "Khoa Tim mạch", TrangThai: "Hoạt động" },
        { ID: 3, TenDichVu: "Phẫu thuật", Gia: 15000000, KhoaID: 2, TenKhoa: "Khoa Ngoại", TrangThai: "Hoạt động" }
      ];
      
      setServices(mockServices);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  const loadMedicines = async () => {
    try {
      console.log("Loading medicines...");
      // TODO: Call API GET /api/v1/thuoc
      
      const mockMedicines: Medicine[] = [
        { ID: 1, TenThuoc: "Paracetamol", DonVi: "Viên", Gia: 500, SoLuongTon: 1000, TrangThai: "Hoạt động" },
        { ID: 2, TenThuoc: "Amoxicillin", DonVi: "Viên", Gia: 1200, SoLuongTon: 500, TrangThai: "Hoạt động" },
        { ID: 3, TenThuoc: "Insulin", DonVi: "Lọ", Gia: 150000, SoLuongTon: 50, TrangThai: "Hoạt động" }
      ];
      
      setMedicines(mockMedicines);
    } catch (error) {
      console.error("Error loading medicines:", error);
    }
  };

  const handleCreateEmployee = async () => {
    try {
      console.log("Creating employee:", employeeData);
      // TODO: Call API POST /api/v1/nhanvien
      // Headers: Authorization: Bearer {access_token}
      // Body: employeeData
      
      showNotification("Tạo nhân viên thành công", "success");
      setOpenEmployeeDialog(false);
      loadEmployees();
    } catch (error) {
      console.error("Error creating employee:", error);
      showNotification("Lỗi khi tạo nhân viên", "error");
    }
  };

  const handleCreateService = async () => {
    try {
      console.log("Creating service:", serviceData);
      // TODO: Call API POST /api/v1/dichvu
      
      showNotification("Tạo dịch vụ thành công", "success");
      setOpenServiceDialog(false);
      loadServices();
    } catch (error) {
      console.error("Error creating service:", error);
      showNotification("Lỗi khi tạo dịch vụ", "error");
    }
  };

  const handleCreateMedicine = async () => {
    try {
      console.log("Creating medicine:", medicineData);
      // TODO: Call API POST /api/v1/thuoc
      
      showNotification("Tạo thuốc thành công", "success");
      setOpenMedicineDialog(false);
      loadMedicines();
    } catch (error) {
      console.error("Error creating medicine:", error);
      showNotification("Lỗi khi tạo thuốc", "error");
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getEmployeeRoleLabel = (role: string) => {
    const labels = {
      'BacSi': 'Bác sĩ',
      'ThuNgan': 'Thu ngân',
      'TiepNhan': 'Tiếp nhận',
      'QuanLyNoiTru': 'Quản lý nội trú',
      'BanGiamDoc': 'Ban giám đốc'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const totalEmployees = employees.length;
  const totalDepartments = departments.length;
  const totalServices = services.length;
  const totalMedicines = medicines.length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Dashboard Ban Giám đốc
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Quản lý toàn diện hệ thống bệnh viện
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #3da9fc" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <People sx={{ fontSize: 40, color: "#3da9fc" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {totalEmployees}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng nhân viên
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
                <Business sx={{ fontSize: 40, color: "#28a745" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {totalDepartments}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Chuyên khoa
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
                <MedicalServices sx={{ fontSize: 40, color: "#ef4565" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {totalServices}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Dịch vụ
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
                <Inventory sx={{ fontSize: 40, color: "#90b4ce" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {totalMedicines}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Loại thuốc
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Management Tabs */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
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
            <Tab label="Nhân sự" />
            <Tab label="Chuyên khoa" />
            <Tab label="Dịch vụ" />
            <Tab label="Thuốc" />
          </Tabs>
        </Box>

        {/* Employees Tab */}
        {activeTab === 0 && (
          <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600 }}>
                Quản lý nhân sự
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenEmployeeDialog(true)}
                sx={{
                  bgcolor: "#3da9fc",
                  "&:hover": { bgcolor: "#2b8fd1" },
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                Thêm nhân viên
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Họ tên</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Loại nhân viên</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Khoa</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Liên hệ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Lương CB</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((employee) => (
                    <TableRow key={employee.ID} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                          {employee.HoTen}
                        </Typography>
                        <Typography variant="body2" color="#5f6c7b">
                          {employee.ChucVu}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getEmployeeRoleLabel(employee.LoaiNhanVien)}
                          size="small"
                          sx={{ 
                            bgcolor: "#3da9fc", 
                            color: "#fffffe",
                            fontWeight: 500 
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#5f6c7b">
                          {employee.TenKhoa}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#5f6c7b">
                          {employee.Email}
                        </Typography>
                        <Typography variant="body2" color="#5f6c7b">
                          {employee.SoDienThoai}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#5f6c7b">
                          {employee.LuongCoBan.toLocaleString('vi-VN')}đ
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={employee.TrangThai}
                          color={employee.TrangThai === "Hoạt động" ? "success" : "warning"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton size="small" sx={{ color: "#3da9fc" }}>
                            <Edit />
                          </IconButton>
                          <IconButton size="small" sx={{ color: "#ef4565" }}>
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
              count={employees.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        )}

        {/* Other tabs content - Similar structure for Departments, Services, Medicines */}
        {activeTab === 1 && (
          <Box p={3}>
            <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600 }}>
              Quản lý chuyên khoa
            </Typography>
            {/* Department management content */}
          </Box>
        )}

        {activeTab === 2 && (
          <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600 }}>
                Quản lý dịch vụ
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenServiceDialog(true)}
                sx={{
                  bgcolor: "#3da9fc",
                  "&:hover": { bgcolor: "#2b8fd1" },
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                Thêm dịch vụ
              </Button>
            </Box>
            {/* Services table */}
          </Box>
        )}

        {activeTab === 3 && (
          <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600 }}>
                Quản lý thuốc
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenMedicineDialog(true)}
                sx={{
                  bgcolor: "#3da9fc",
                  "&:hover": { bgcolor: "#2b8fd1" },
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                Thêm thuốc
              </Button>
            </Box>
            {/* Medicines table */}
          </Box>
        )}
      </Card>

      {/* Employee Dialog */}
      <Dialog open={openEmployeeDialog} onClose={() => setOpenEmployeeDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Thêm nhân viên mới
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ tên"
                value={employeeData.HoTen}
                onChange={(e) => setEmployeeData({ ...employeeData, HoTen: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Loại nhân viên</InputLabel>
                <Select
                  value={employeeData.LoaiNhanVien}
                  label="Loại nhân viên"
                  onChange={(e) => setEmployeeData({ ...employeeData, LoaiNhanVien: e.target.value as any })}
                >
                  <MenuItem value="BacSi">Bác sĩ</MenuItem>
                  <MenuItem value="ThuNgan">Thu ngân</MenuItem>
                  <MenuItem value="TiepNhan">Tiếp nhận</MenuItem>
                  <MenuItem value="QuanLyNoiTru">Quản lý nội trú</MenuItem>
                  <MenuItem value="BanGiamDoc">Ban giám đốc</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={employeeData.Email}
                onChange={(e) => setEmployeeData({ ...employeeData, Email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={employeeData.SoDienThoai}
                onChange={(e) => setEmployeeData({ ...employeeData, SoDienThoai: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Chức vụ"
                value={employeeData.ChucVu}
                onChange={(e) => setEmployeeData({ ...employeeData, ChucVu: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lương cơ bản (VNĐ)"
                type="number"
                value={employeeData.LuongCoBan}
                onChange={(e) => setEmployeeData({ ...employeeData, LuongCoBan: parseInt(e.target.value) || 0 })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenEmployeeDialog(false)} color="inherit">
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateEmployee}
            sx={{
              bgcolor: "#3da9fc",
              "&:hover": { bgcolor: "#2b8fd1" }
            }}
          >
            Tạo nhân viên
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
    </Container>
  );
};

export default DirectorDashboard;
