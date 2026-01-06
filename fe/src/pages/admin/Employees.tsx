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
  Snackbar
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Business,
  People,
  LocalHospital,
  Search
} from "@mui/icons-material";
import { employeeAPI, departmentAPI } from "../../services/api";

interface Employee {
  MaNV: string;
  HoTen: string;
  NgaySinh: string;
  SDT: string;
  DiaChi: string;
  Luong: string; // Keep as string for display, convert to number when sending to API
  LoaiNV: string;
  TrinhDo: string | null;
  LaTruongKhoa: boolean | null;
  MaKhoaId: string | null;
}

interface Department {
  MaKhoa: string;
  TenKhoa: string;
  MoTa: string;
}

const AdminEmployees: FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Employee | null>(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Form data
  const [formData, setFormData] = useState<{
    HoTen: string;
    NgaySinh: string;
    SDT: string;
    DiaChi: string;
    Luong: string;
    Matkhau: string;
    LoaiNV: string;
    TrinhDo: string;
    LaTruongKhoa: boolean;
    MaKhoaId: string;
  }>({
    HoTen: "",
    NgaySinh: "",
    SDT: "",
    DiaChi: "",
    Luong: "",
    Matkhau: "",
    LoaiNV: "BacSi",
    TrinhDo: "",
    LaTruongKhoa: false,
    MaKhoaId: ""
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
    loadEmployees();
    loadDepartments();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, statusFilter]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      console.log("Loading employees...");
      const response = await employeeAPI.getList();
      console.log("Employee API response:", response);
      
      if (response?.data && Array.isArray(response.data)) {
        setEmployees(response.data);
      } else {
        console.log("No employee data found in response:", response);
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error loading employees:", error);
      showNotification("Lỗi khi tải danh sách nhân viên", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      console.log("Loading departments...");
      const response = await departmentAPI.getAll();
      console.log("Department API response:", response);
      
      if (response?.data && Array.isArray(response.data)) {
        setDepartments(response.data);
      } else {
        console.log("No department data found in response:", response);
        setDepartments([]);
      }
    } catch (error) {
      console.error("Error loading departments:", error);
      showNotification("Lỗi khi tải danh sách khoa", "error");
    }
  };

  const filterEmployees = () => {
    let filtered = employees;
    
    if (searchTerm) {
      filtered = filtered.filter((emp: Employee) => 
        emp.HoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.SDT.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.DiaChi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.LoaiNV.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((emp: Employee) => emp.LoaiNV === statusFilter);
    }
    
    setFilteredEmployees(filtered);
  };

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        HoTen: employee.HoTen,
        NgaySinh: employee.NgaySinh.split('T')[0], // Convert to YYYY-MM-DD format
        SDT: employee.SDT,
        DiaChi: employee.DiaChi,
        Luong: employee.Luong,
        Matkhau: "", // Để trống khi edit
        LoaiNV: employee.LoaiNV,
        TrinhDo: employee.TrinhDo || "",
        LaTruongKhoa: employee.LaTruongKhoa || false,
        MaKhoaId: employee.MaKhoaId || ""
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        HoTen: "",
        NgaySinh: "",
        SDT: "",
        DiaChi: "",
        Luong: "",
        Matkhau: "",
        LoaiNV: "BacSi",
        TrinhDo: "",
        LaTruongKhoa: false,
        MaKhoaId: ""
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEmployee(null);
    setFormData({
      HoTen: "",
      NgaySinh: "",
      SDT: "",
      DiaChi: "",
      Luong: "",
      Matkhau: "",
      LoaiNV: "BacSi",
      TrinhDo: "",
      LaTruongKhoa: false,
      MaKhoaId: ""
    });
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.HoTen || !formData.SDT || !formData.DiaChi || !formData.Luong || !formData.NgaySinh) {
        showNotification("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
        return;
      }

      // Validate birth date
      if (new Date(formData.NgaySinh) >= new Date()) {
        showNotification("Ngày sinh phải trước ngày hiện tại", "error");
        return;
      }

      // Validate phone number format (must start with 0 and have 10 digits)
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(formData.SDT)) {
        showNotification("Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số", "error");
        return;
      }

      // Check if phone number already exists (for new employee or different employee)
      const existingEmployee = employees.find(emp => 
        emp.SDT === formData.SDT && emp.MaNV !== editingEmployee?.MaNV
      );
      if (existingEmployee) {
        showNotification("Số điện thoại đã được sử dụng bởi nhân viên khác", "error");
        return;
      }

      // Validate salary is numeric string
      const salaryRegex = /^\d+$/;
      if (!salaryRegex.test(formData.Luong)) {
        showNotification("Lương phải là một chuỗi số hợp lệ", "error");
        return;
      }

      // Validate BacSi specific fields
      if (formData.LoaiNV === "BacSi") {
        if (!formData.TrinhDo || !formData.MaKhoaId) {
          showNotification("Bác sĩ phải có trình độ và thuộc về một khoa", "error");
          return;
        }
      }

      // Validate password for new employee
      if (!editingEmployee && !formData.Matkhau) {
        showNotification("Vui lòng nhập mật khẩu cho nhân viên mới", "error");
        return;
      }

      // Prepare data for API - Convert to backend expected format
      const apiData: any = {
        HoTen: formData.HoTen,
        NgaySinh: new Date(formData.NgaySinh).toISOString(), // Proper ISO format
        SDT: formData.SDT,
        DiaChi: formData.DiaChi,
        Luong: parseFloat(formData.Luong), // Convert to number (Prisma Decimal type)
        LoaiNV: formData.LoaiNV,
      };

      // Add password - only if provided
      if (formData.Matkhau) {
        apiData.Matkhau = formData.Matkhau;
      }

      // Add conditional fields for BacSi only
      if (formData.LoaiNV === "BacSi") {
        apiData.TrinhDo = formData.TrinhDo;
        apiData.LaTruongKhoa = formData.LaTruongKhoa;
        apiData.MaKhoaId = formData.MaKhoaId;
      }

      console.log("API Data being sent:", apiData);

      if (editingEmployee) {
        console.log("Updating employee:", editingEmployee.MaNV, apiData);
        const response = await employeeAPI.updateEmployee(editingEmployee.MaNV, apiData);
        console.log("Update response:", response);
        showNotification("Cập nhật nhân viên thành công", "success");
      } else {
        console.log("Creating new employee:", apiData);
        const response = await employeeAPI.addEmployee(apiData);
        console.log("Create response:", response);
        showNotification("Tạo nhân viên mới thành công", "success");
      }
      
      handleCloseDialog();
      loadEmployees();
    } catch (error: any) {
      console.error("Error saving employee:", error);
      console.error("Error response:", error?.response);
      
      // Enhanced error handling
      let errorMessage = "Lỗi khi lưu thông tin nhân viên";
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (Array.isArray(errorData)) {
          errorMessage = errorData.join(", ");
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      }
      
      showNotification(errorMessage, "error");
    }
  };

  const handleDelete = async (employee: Employee) => {
    try {
      console.log("Deleting employee:", employee.MaNV);
      await employeeAPI.deleteEmployee(employee.MaNV);
      showNotification("Xóa nhân viên thành công", "success");
      setDeleteConfirm(null);
      loadEmployees();
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      
      // Handle foreign key constraint error specifically
      if (error?.response?.status === 400 && 
          error?.response?.data?.message?.includes("Foreign key constraint")) {
        showNotification("Không thể xóa nhân viên này vì đang có dữ liệu liên quan (hóa đơn, lịch khám, v.v.). Vui lòng xóa các dữ liệu liên quan trước.", "error");
      } else {
        const errorMessage = error?.response?.data?.message || "Lỗi khi xóa nhân viên";
        showNotification(errorMessage, "error");
      }
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Quản lý nhân viên
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Quản lý danh sách nhân viên trong bệnh viện
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #3da9fc" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <People sx={{ fontSize: 40, color: "#3da9fc" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {employees.length}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng nhân viên
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
                <LocalHospital sx={{ fontSize: 40, color: "#28a745" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {employees.filter(emp => emp.LoaiNV === "BacSi").length}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Bác sĩ
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #ef4565" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Business sx={{ fontSize: 40, color: "#ef4565" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {employees.filter(emp => emp.LaTruongKhoa === true).length}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Trưởng khoa
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)", mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: "#5f6c7b", mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Loại nhân viên</InputLabel>
                <Select
                  value={statusFilter}
                  label="Loại nhân viên"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="BacSi">Bác sĩ</MenuItem>
                  <MenuItem value="TiepNhan">Tiếp nhận</MenuItem>
                  <MenuItem value="ThuNgan">Thu ngân</MenuItem>
                  <MenuItem value="HoTro">Hỗ trợ</MenuItem>
                  <MenuItem value="QuanLyNoiTru">Quản lý nội trú</MenuItem>
                  <MenuItem value="BanGiamDoc">Ban giám đốc</MenuItem>
                  <MenuItem value="QuanLy">Quản lý</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{
                  bgcolor: "#3da9fc",
                  "&:hover": { bgcolor: "#2b8fd1" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                Thêm nhân viên mới
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Họ tên</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Số điện thoại</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Địa chỉ</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Loại NV</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Lương</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Trình độ</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((employee) => (
                <TableRow key={employee.MaNV} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                      {employee.HoTen}
                    </Typography>
                    <Typography variant="caption" color="#5f6c7b">
                      {employee.LaTruongKhoa ? "Trưởng khoa" : ""}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {employee.SDT}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {employee.DiaChi}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={employee.LoaiNV}
                      color={employee.LoaiNV === "BacSi" ? "primary" : employee.LoaiNV === "BanGiamDoc" ? "secondary" : "default"}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {parseInt(employee.Luong).toLocaleString()} VNĐ
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {employee.TrinhDo || "Chưa cập nhật"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(employee)}
                        sx={{ color: "#3da9fc" }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setDeleteConfirm(employee)}
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
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          {editingEmployee ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                value={formData.HoTen}
                onChange={(e) => setFormData({ ...formData, HoTen: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={formData.SDT}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                  if (value.length <= 10) {
                    setFormData({ ...formData, SDT: value });
                  }
                }}
                required
                helperText="Nhập đúng 10 chữ số, bắt đầu bằng 0 (VD: 0987654321)"
                error={formData.SDT.length > 0 && (formData.SDT.length !== 10 || !formData.SDT.startsWith('0'))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày sinh"
                type="date"
                value={formData.NgaySinh}
                onChange={(e) => setFormData({ ...formData, NgaySinh: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
                inputProps={{
                  max: new Date().toISOString().split('T')[0] // Không cho phép chọn ngày tương lai
                }}
                helperText="Ngày sinh phải trước ngày hiện tại"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lương"
                value={formData.Luong}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                  setFormData({ ...formData, Luong: value });
                }}
                required
                helperText="Chỉ nhập số (VD: 10000000)"
                error={formData.Luong.length > 0 && !/^\d+$/.test(formData.Luong)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={formData.DiaChi}
                onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })}
                multiline
                rows={2}
                required
              />
            </Grid>
            {!editingEmployee && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mật khẩu"
                  type="password"
                  value={formData.Matkhau}
                  onChange={(e) => setFormData({ ...formData, Matkhau: e.target.value })}
                  required
                  helperText="Mật khẩu cho tài khoản đăng nhập"
                />
              </Grid>
            )}
            {editingEmployee && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mật khẩu mới (tùy chọn)"
                  type="password"
                  value={formData.Matkhau}
                  onChange={(e) => setFormData({ ...formData, Matkhau: e.target.value })}
                  helperText="Để trống nếu không muốn đổi mật khẩu"
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Loại nhân viên</InputLabel>
                <Select
                  value={formData.LoaiNV}
                  label="Loại nhân viên"
                  onChange={(e) => {
                    const newLoaiNV = e.target.value;
                    setFormData({ 
                      ...formData, 
                      LoaiNV: newLoaiNV,
                      // Reset các field conditional khi đổi loại nhân viên
                      TrinhDo: "",
                      LaTruongKhoa: false,
                      MaKhoaId: ""
                    });
                  }}
                >
                  <MenuItem value="BacSi">Bác sĩ</MenuItem>
                  <MenuItem value="TiepNhan">Tiếp nhận</MenuItem>
                  <MenuItem value="ThuNgan">Thu ngân</MenuItem>
                  <MenuItem value="HoTro">Hỗ trợ</MenuItem>
                  <MenuItem value="QuanLyNoiTru">Quản lý nội trú</MenuItem>
                  <MenuItem value="BanGiamDoc">Ban giám đốc</MenuItem>
                  <MenuItem value="DichVu">Dịch vụ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Conditional fields for BacSi */}
            {formData.LoaiNV === "BacSi" && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Trình độ</InputLabel>
                    <Select
                      value={formData.TrinhDo}
                      label="Trình độ"
                      onChange={(e) => setFormData({ ...formData, TrinhDo: e.target.value })}
                    >
                      <MenuItem value="ChuyenKhoaI">Chuyên khoa I</MenuItem>
                      <MenuItem value="ChuyenKhoaII">Chuyên khoa II</MenuItem>
                      <MenuItem value="ThacSi">Thạc sĩ</MenuItem>
                      <MenuItem value="TienSi">Tiến sĩ</MenuItem>
                      <MenuItem value="PhoGiaoSu">Phó giáo sư</MenuItem>
                      <MenuItem value="GiaoSu">Giáo sư</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Khoa</InputLabel>
                    <Select
                      value={formData.MaKhoaId}
                      label="Khoa"
                      onChange={(e) => setFormData({ ...formData, MaKhoaId: e.target.value })}
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept.MaKhoa} value={dept.MaKhoa}>
                          {dept.TenKhoa}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Là trưởng khoa?
                    </Typography>
                    <Select
                      value={formData.LaTruongKhoa ? "true" : "false"}
                      onChange={(e) => setFormData({ ...formData, LaTruongKhoa: e.target.value === "true" })}
                      size="small"
                    >
                      <MenuItem value="false">Không</MenuItem>
                      <MenuItem value="true">Có</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              bgcolor: "#3da9fc",
              "&:hover": { bgcolor: "#2b8fd1" }
            }}
          >
            {editingEmployee ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle sx={{ color: "#ef4565", fontWeight: 600 }}>
          Xác nhận xóa
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn xóa nhân viên "{deleteConfirm?.HoTen}"?
          </Typography>
          <Typography variant="body2" sx={{ color: "#ef4565", fontStyle: "italic" }}>
            ⚠️ Lưu ý: Nếu nhân viên này có dữ liệu liên quan (hóa đơn, lịch khám, v.v.), 
            việc xóa sẽ thất bại. Vui lòng xóa các dữ liệu liên quan trước.
          </Typography>
          <Typography variant="body2" sx={{ color: "#5f6c7b", mt: 1 }}>
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteConfirm(null)} color="inherit">
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            sx={{
              bgcolor: "#ef4565",
              "&:hover": { bgcolor: "#d73851" }
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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

export default AdminEmployees;
