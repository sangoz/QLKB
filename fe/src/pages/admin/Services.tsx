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
  Search,
  Edit,
  Delete,
  Visibility,
  MedicalServices,
  LocalHospital,
  CheckCircle,
  AttachMoney
} from "@mui/icons-material";
import { serviceAPI } from "../../services/api";

// Define Service interface
interface Service {
  MaDichVu: string;
  TenDichVu: string;
  GiaDichVu: number;
}

const AdminServices: FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Service | null>(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters - simplified for new entity
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form data matching DichVu entity
  const [formData, setFormData] = useState<{
    TenDichVu: string;
    GiaDichVu: string;
  }>({
    TenDichVu: "",
    GiaDichVu: ""
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
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm]);

  const loadServices = async () => {
    try {
      console.log("Loading services from API...");
      const response = await serviceAPI.getAll();
      console.log("Service API response:", response);
      
      if (response?.data && Array.isArray(response.data)) {
        setServices(response.data);
      } else {
        console.log("No service data found in response:", response);
        setServices([]);
      }
    } catch (error) {
      console.error("Error loading services:", error);
      showNotification("Lỗi khi tải danh sách dịch vụ", "error");
    }
  };

  const filterServices = () => {
    let filtered = services;
    
    if (searchTerm) {
      filtered = filtered.filter(service => 
        service.TenDichVu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.MaDichVu.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredServices(filtered);
  };

  const handleCreateService = async () => {
    if (!formData.TenDichVu.trim()) {
      showNotification("Vui lòng nhập tên dịch vụ", "warning");
      return;
    }
    if (formData.GiaDichVu.trim() === "" || Number(formData.GiaDichVu) <= 0) {
      showNotification("Vui lòng nhập giá dịch vụ hợp lệ", "warning");
      return;
    }
    
    try {
      // Ensure GiaDichVu is a valid number string
      const submitData = {
        TenDichVu: formData.TenDichVu.trim(),
        GiaDichVu: String(Number(formData.GiaDichVu)) // Convert to number then back to string to ensure valid number format
      };
      
      // Check user role
      const userInfo = localStorage.getItem('userInfo');
      console.log("User info from localStorage:", userInfo);
      
      const response = await serviceAPI.create(submitData);
      console.log("Create response:", response);
      showNotification("Thêm dịch vụ mới thành công", "success");
      setOpenNewDialog(false);
      resetForm();
      loadServices();
    } catch (error: any) {
      console.error("Error creating service:", error);
      console.error("Error details:", error.response?.data);
      showNotification("Lỗi khi thêm dịch vụ mới", "error");
    }
  };

  const handleUpdateService = async () => {
    if (!editingService) return;
    
    if (!formData.TenDichVu.trim()) {
      showNotification("Vui lòng nhập tên dịch vụ", "warning");
      return;
    }
    if (formData.GiaDichVu.trim() === "" || Number(formData.GiaDichVu) <= 0) {
      showNotification("Vui lòng nhập giá dịch vụ hợp lệ", "warning");
      return;
    }
    
    try {
      console.log("Updating service:", formData);
      // Ensure GiaDichVu is a valid number string
      const submitData = {
        TenDichVu: formData.TenDichVu.trim(),
        GiaDichVu: String(Number(formData.GiaDichVu)) // Convert to number then back to string to ensure valid number format
      };
      console.log("Submit data:", submitData);
      console.log("GiaDichVu type:", typeof submitData.GiaDichVu);
      console.log("GiaDichVu value:", submitData.GiaDichVu);
      
      await serviceAPI.update(editingService.MaDichVu, submitData);
      showNotification("Cập nhật dịch vụ thành công", "success");
      setOpenEditDialog(false);
      setEditingService(null);
      resetForm();
      loadServices();
    } catch (error: any) {
      console.error("Error updating service:", error);
      console.error("Error details:", error.response?.data);
      showNotification("Lỗi khi cập nhật dịch vụ", "error");
    }
  };

  const handleDeleteService = async (service: Service) => {
    setDeleteConfirm(service);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      console.log("Deleting service:", deleteConfirm.MaDichVu);
      await serviceAPI.delete(deleteConfirm.MaDichVu);
      showNotification("Xóa dịch vụ thành công", "success");
      setDeleteConfirm(null);
      loadServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      showNotification("Lỗi khi xóa dịch vụ", "error");
      setDeleteConfirm(null);
    }
  };

  const resetForm = () => {
    setFormData({
      TenDichVu: "",
      GiaDichVu: ""
    });
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      TenDichVu: service.TenDichVu,
      GiaDichVu: service.GiaDichVu.toString()
    });
    setOpenEditDialog(true);
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      handleEdit(service);
    } else {
      setEditingService(null);
      resetForm();
      setOpenNewDialog(true);
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

  const totalServices = services.length;
  const avgPrice = services.length > 0 ? Math.round(services.reduce((sum, s) => sum + Number(s.GiaDichVu), 0) / services.length) : 0;
  const maxPrice = services.length > 0 ? Math.max(...services.map(s => Number(s.GiaDichVu))) : 0;
  const minPrice = services.length > 0 ? Math.min(...services.map(s => Number(s.GiaDichVu))) : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Quản lý Dịch vụ
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Quản lý các dịch vụ y tế, khám bệnh và điều trị
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #3da9fc" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <MedicalServices sx={{ fontSize: 40, color: "#3da9fc" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {totalServices}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng dịch vụ
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
                <AttachMoney sx={{ fontSize: 40, color: "#90b4ce" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {(avgPrice / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Giá TB (VNĐ)
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
                <CheckCircle sx={{ fontSize: 40, color: "#28a745" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {(maxPrice / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Giá cao nhất
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #ffc107" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <LocalHospital sx={{ fontSize: 40, color: "#ffc107" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {(minPrice / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Giá thấp nhất
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
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: "#5f6c7b", mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
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
                Thêm dịch vụ mới
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: 600, color: "#094067", width: "40%" }}>Tên dịch vụ</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067", width: "35%" }}>Giá dịch vụ</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067", width: "25%", pl: 20}}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredServices
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((service) => (
                <TableRow key={service.MaDichVu} hover>
                  <TableCell sx={{ width: "40%" }}>
                    <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                      {service.TenDichVu}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "35%" }}>
                    <Typography variant="body2" color="#5f6c7b">
                      {Number(service.GiaDichVu).toLocaleString('vi-VN')}đ
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "25%", textAlign: "right" }}>
                    <Box display="flex" gap={1} justifyContent="flex-end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedService(service);
                          setOpenViewDialog(true);
                        }}
                        sx={{ color: "#3da9fc" }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(service)}
                        sx={{ color: "#28a745" }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteService(service)}
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
          count={filteredServices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Chi tiết dịch vụ
        </DialogTitle>
        <DialogContent dividers>
          {selectedService && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                      Thông tin dịch vụ
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography><strong>Mã dịch vụ:</strong> {selectedService.MaDichVu}</Typography>
                      <Typography><strong>Tên dịch vụ:</strong> {selectedService.TenDichVu}</Typography>
                      <Typography><strong>Giá dịch vụ:</strong> {Number(selectedService.GiaDichVu).toLocaleString('vi-VN')}đ</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenViewDialog(false)} color="inherit">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* New/Edit Dialog */}
      <Dialog 
        open={openNewDialog || openEditDialog} 
        onClose={() => {
          setOpenNewDialog(false);
          setOpenEditDialog(false);
          setEditingService(null);
          resetForm();
        }} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          {openNewDialog ? "Thêm dịch vụ mới" : "Chỉnh sửa dịch vụ"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên dịch vụ"
                value={formData.TenDichVu}
                onChange={(e) => setFormData({ ...formData, TenDichVu: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Giá dịch vụ (VNĐ)"
                type="number"
                value={formData.GiaDichVu}
                onChange={(e) => setFormData({ ...formData, GiaDichVu: e.target.value })}
                required
                inputProps={{ min: 1 }}
                helperText="Giá dịch vụ phải lớn hơn 0"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => {
              setOpenNewDialog(false);
              setOpenEditDialog(false);
              setEditingService(null);
              resetForm();
            }} 
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={openNewDialog ? handleCreateService : handleUpdateService}
            sx={{
              bgcolor: "#3da9fc",
              "&:hover": { bgcolor: "#2b8fd1" }
            }}
          >
            {openNewDialog ? "Thêm dịch vụ" : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Xác nhận xóa dịch vụ
        </DialogTitle>
        <DialogContent dividers>
          {deleteConfirm && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Bạn có chắc chắn muốn xóa dịch vụ này không?
              </Typography>
              <Card sx={{ bgcolor: "#fff5f5", border: "1px solid #ffcdd2" }}>
                <CardContent>
                  <Typography><strong>Mã dịch vụ:</strong> {deleteConfirm.MaDichVu}</Typography>
                  <Typography><strong>Tên dịch vụ:</strong> {deleteConfirm.TenDichVu}</Typography>
                  <Typography><strong>Giá dịch vụ:</strong> {Number(deleteConfirm.GiaDichVu).toLocaleString('vi-VN')}đ</Typography>
                </CardContent>
              </Card>
              <Typography variant="body2" color="error" sx={{ mt: 2, fontStyle: "italic" }}>
                ⚠️ Hành động này không thể hoàn tác!
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setDeleteConfirm(null)} 
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            sx={{
              bgcolor: "#ef4565",
              "&:hover": { bgcolor: "#d32f2f" }
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 8 }}
      >
        <Alert
          severity={notification.severity}
          onClose={() => setNotification({ ...notification, open: false })}
          sx={{ 
            minWidth: 300,
            boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)",
            borderRadius: 2
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminServices;
