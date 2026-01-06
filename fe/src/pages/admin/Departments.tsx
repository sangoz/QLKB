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
import { departmentAPI, employeeAPI } from "../../services/api";

interface Department {
  MaKhoa: string;
  TenKhoa: string;
  MoTa: string;
  TruongKhoa?: string;
  SoBacSi?: number;
}

const AdminDepartments: FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Department | null>(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  
  // Form data
  const [formData, setFormData] = useState<{
    TenKhoa: string;
    MoTa: string;
  }>({
    TenKhoa: "",
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
    loadDepartments();
    loadEmployees();
  }, []);

  useEffect(() => {
    filterDepartments();
  }, [departments, searchTerm, sortBy]);

  useEffect(() => {
    // Re-filter when employees data changes to update sorting by doctor count
    if (employees.length > 0) {
      filterDepartments();
    }
  }, [employees]);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const response = await departmentAPI.getAll();
      
      if (response?.data && Array.isArray(response.data)) {
        setDepartments(response.data);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error("Error loading departments:", error);
      showNotification("Lỗi khi tải danh sách khoa", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      console.log("Loading employees for department stats...");
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
    }
  };

  // Helper function to get department head name
  const getDepartmentHead = (departmentId: string) => {
    const head = employees.find(emp => 
      emp.MaKhoaId === departmentId && 
      emp.LaTruongKhoa === true && 
      emp.LoaiNV === "BacSi"
    );
    return head ? head.HoTen : "Chưa có";
  };

  // Helper function to get doctor count for department
  const getDoctorCount = (departmentId: string) => {
    return employees.filter(emp => 
      emp.MaKhoaId === departmentId && 
      emp.LoaiNV === "BacSi"
    ).length;
  };

  const filterDepartments = () => {
    let filtered = departments;
    
    if (searchTerm) {
      filtered = filtered.filter(dept => 
        dept.TenKhoa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.MoTa.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort departments
    if (sortBy === "name") {
      filtered = filtered.sort((a, b) => a.TenKhoa.localeCompare(b.TenKhoa));
    } else if (sortBy === "doctors") {
      filtered = filtered.sort((a, b) => getDoctorCount(b.MaKhoa) - getDoctorCount(a.MaKhoa));
    }
    
    setFilteredDepartments(filtered);
  };

  const handleOpenDialog = (department?: Department) => {
    if (department) {
      setEditingDepartment(department);
      setFormData({
        TenKhoa: department.TenKhoa,
        MoTa: department.MoTa
      });
    } else {
      setEditingDepartment(null);
      setFormData({
        TenKhoa: "",
        MoTa: ""
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDepartment(null);
    setFormData({
      TenKhoa: "",
      MoTa: ""
    });
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.TenKhoa || !formData.MoTa) {
        showNotification("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
        return;
      }

      if (editingDepartment) {
        console.log("Updating department:", editingDepartment.MaKhoa, formData);
        await departmentAPI.update(editingDepartment.MaKhoa, formData);
        showNotification("Cập nhật khoa thành công", "success");
      } else {
        console.log("Creating new department:", formData);
        await departmentAPI.create(formData);
        showNotification("Tạo khoa mới thành công", "success");
      }
      
      handleCloseDialog();
      loadDepartments();
      loadEmployees(); // Reload employees to update stats
    } catch (error: any) {
      console.error("Error saving department:", error);
      const errorMessage = error?.response?.data?.message || "Lỗi khi lưu thông tin khoa";
      showNotification(errorMessage, "error");
    }
  };

  const handleDelete = async (department: Department) => {
    try {
      console.log("Deleting department:", department.MaKhoa);
      await departmentAPI.delete(department.MaKhoa);
      showNotification("Xóa khoa thành công", "success");
      setDeleteConfirm(null);
      loadDepartments();
      loadEmployees(); // Reload employees to update stats
    } catch (error: any) {
      console.error("Error deleting department:", error);
      const errorMessage = error?.response?.data?.message || "Lỗi khi xóa khoa";
      showNotification(errorMessage, "error");
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
          Quản lý Khoa
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Quản lý danh sách các khoa trong bệnh viện
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #3da9fc" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Business sx={{ fontSize: 40, color: "#3da9fc" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {departments.length}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng số khoa
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
                    {departments.reduce((sum, dept) => sum + getDoctorCount(dept.MaKhoa), 0)}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng bác sĩ
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
                <LocalHospital sx={{ fontSize: 40, color: "#ef4565" }} />
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
                placeholder="Tìm kiếm khoa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: "#5f6c7b", mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sắp xếp theo</InputLabel>
                <Select
                  value={sortBy}
                  label="Sắp xếp theo"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="name">Số bác sĩ</MenuItem>
                  <MenuItem value="doctors">Tên khoa</MenuItem>
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
                Thêm khoa mới
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Departments Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Tên khoa</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Mô tả</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Trưởng khoa</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Số bác sĩ</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDepartments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((department) => (
                <TableRow key={department.MaKhoa} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                      {department.TenKhoa}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {department.MoTa}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {getDepartmentHead(department.MaKhoa)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {getDoctorCount(department.MaKhoa)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(department)}
                        sx={{ color: "#3da9fc" }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setDeleteConfirm(department)}
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
          count={filteredDepartments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          {editingDepartment ? "Chỉnh sửa khoa" : "Thêm khoa mới"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên khoa"
                value={formData.TenKhoa}
                onChange={(e) => setFormData({ ...formData, TenKhoa: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                value={formData.MoTa}
                onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
                multiline
                rows={3}
                required
              />
            </Grid>
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
            {editingDepartment ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle sx={{ color: "#ef4565", fontWeight: 600 }}>
          Xác nhận xóa
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa khoa "{deleteConfirm?.TenKhoa}"?
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

export default AdminDepartments;
