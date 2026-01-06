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
  Autocomplete
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Print,
  MedicalServices,
  Assignment,
  Person
} from "@mui/icons-material";
import { medicalFormAPI, patientAPI, employeeAPI, serviceAPI } from "../../services/api";

// Types based on backend entity
interface MedicalForm {
  MaPYC: string;
  NgayYeuCau: string;
  DonGia: number;
  Loai: "NhapVien" | "XuatVien" | "DichVu" | "KhamBenh";
  MaNV: string;
  MaBN: string;
  MaDichVu?: string;
  TrangThai: "Pending" | "Payed" | "Done";
  // Extended fields for display
  TenBenhNhan?: string;
  TenBacSi?: string;
  TenDichVu?: string;
}

interface Patient {
  MaBN: string;
  HoTen: string;
  SDT: string;
}

interface Doctor {
  MaNV: string;
  HoTen: string;
  LoaiNV: string;
}

interface Service {
  MaDichVu: string;
  TenDichVu: string;
  GiaDichVu: number;
}

const serviceManage: FC = () => {
  const [medicalForms, setMedicalForms] = useState<MedicalForm[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingForm, setEditingForm] = useState<MedicalForm | null>(null);
  const [selectedForm, setSelectedForm] = useState<MedicalForm | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [formToDelete, setFormToDelete] = useState<MedicalForm | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    NgayYeuCau: new Date().toISOString().split('T')[0],
    DonGia: "",
    Loai: "KhamBenh" as "NhapVien" | "XuatVien" | "DichVu" | "KhamBenh",
    MaBN: "",
    MaNV: "",
    MaDichVu: "",
    TrangThai: "Pending" as "Pending" | "Payed" | "Done"
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
    loadMedicalForms();
  }, []);

  const loadMedicalForms = async () => {
    try {
      
      // Load current user info first
      const userRes = await employeeAPI.getAccount();
      if (userRes?.data) {
        setCurrentUser(userRes.data);
      }
      
      // Load medical forms from API
      const response = await medicalFormAPI.getAll();
      
      // Filter to only show service type forms (DichVu)
      const serviceForms = response.data.filter((form: MedicalForm) => form.Loai === "DichVu");
      
      // Sort by status: Payed first, then Done, then Pending
      const sortedForms = serviceForms.sort((a: MedicalForm, b: MedicalForm) => {
        const statusOrder = { "Payed": 0, "Done": 1, "Pending": 2 };
        const aOrder = statusOrder[a.TrangThai as keyof typeof statusOrder] ?? 3;
        const bOrder = statusOrder[b.TrangThai as keyof typeof statusOrder] ?? 3;
        
        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }
        
        // If same status, sort by date (newest first)
        return new Date(b.NgayYeuCau).getTime() - new Date(a.NgayYeuCau).getTime();
      });
      
      setMedicalForms(sortedForms);
      
      // Load patients for dropdown
      const patientsResponse = await patientAPI.getAllPatients();
      setPatients(patientsResponse.data);
      
      // Load doctors for dropdown
      const doctorsResponse = await employeeAPI.getDoctors();
      setDoctors(doctorsResponse.data);
      
      // Load services for dropdown
      const servicesResponse = await serviceAPI.getAll();
      setServices(servicesResponse.data);
      
    } catch (error) {
      showNotification("Lỗi khi tải danh sách phiếu dịch vụ", "error");
    }
  };

  const handleCreateForm = async () => {
    try {
      
      // Validate required fields
      if (!formData.MaBN) {
        showNotification("Vui lòng chọn bệnh nhân", "error");
        return;
      }
      
      if (!currentUser?.MaNV) {
        showNotification("Không tìm thấy thông tin bác sĩ hiện tại", "error");
        return;
      }
      
      if (formData.Loai === "DichVu" && !formData.MaDichVu) {
        showNotification("Vui lòng chọn dịch vụ", "error");
        return;
      }
      
      const requestData = {
        NgayYeuCau: formData.NgayYeuCau,
        DonGia: formData.DonGia,
        Loai: formData.Loai,
        MaBN: formData.MaBN,
        MaNV: currentUser.MaNV, // Always use current user's MaNV
        ...(formData.Loai === "DichVu" && { MaDichVu: formData.MaDichVu }),
        TrangThai: "Pending" as "Pending" // Always set to Pending
      };
      
      await medicalFormAPI.create(requestData);
      showNotification("Tạo phiếu yêu cầu thành công", "success");
      setOpenDialog(false);
      resetFormData();
      loadMedicalForms();
    } catch (error) {
      showNotification("Lỗi khi tạo phiếu yêu cầu", "error");
    }
  };

  const handleUpdateForm = async () => {
    try {
      if (!editingForm) return;
      
      // Only update the status, keep all other fields the same
      const requestData = {
        NgayYeuCau: editingForm.NgayYeuCau,
        DonGia: editingForm.DonGia.toString(),
        Loai: editingForm.Loai,
        MaBN: editingForm.MaBN,
        MaNV: editingForm.MaNV,
        ...(editingForm.Loai === "DichVu" && { MaDichVu: editingForm.MaDichVu }),
        TrangThai: formData.TrangThai // Only this field can be changed
      };
      
      await medicalFormAPI.update(editingForm.MaPYC, requestData);
      showNotification("Cập nhật trạng thái phiếu yêu cầu thành công", "success");
      setOpenDialog(false);
      setEditingForm(null);
      resetFormData();
      loadMedicalForms();
    } catch (error) {
      showNotification("Lỗi khi cập nhật trạng thái phiếu yêu cầu", "error");
    }
  };

  const handleDeleteForm = async (form: MedicalForm) => {
    setFormToDelete(form);
    setDeleteConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!formToDelete) return;
    
    try {
      await medicalFormAPI.delete(formToDelete.MaPYC);
      showNotification("Xóa phiếu yêu cầu thành công", "success");
      loadMedicalForms();
      setDeleteConfirmDialog(false);
      setFormToDelete(null);
    } catch (error) {
      showNotification("Lỗi khi xóa phiếu yêu cầu", "error");
    }
  };

  const resetFormData = () => {
    setFormData({
      NgayYeuCau: new Date().toISOString().split('T')[0],
      DonGia: "",
      Loai: "KhamBenh",
      MaBN: "",
      MaNV: "",
      MaDichVu: "",
      TrangThai: "Pending"
    });
  };

  const handleEditForm = (form: MedicalForm) => {
    // Only allow editing if the form status is "Payed" (Đã thanh toán)
    if (form.TrangThai !== "Payed") {
      showNotification("Chỉ có thể sửa trạng thái của phiếu đã thanh toán", "warning");
      return;
    }
    
    setEditingForm(form);
    setFormData({
      NgayYeuCau: form.NgayYeuCau.split('T')[0], // Format date for input
      DonGia: form.DonGia.toString(),
      Loai: form.Loai,
      MaBN: form.MaBN,
      MaNV: form.MaNV,
      MaDichVu: form.MaDichVu || "",
      TrangThai: "Done" // Automatically set to "Done" when editing
    });
    setOpenDialog(true);
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const getStatusChip = (status: string) => {
    
    const statusLabels = {
      "Pending": "Đang chờ",
      "Payed": "Đã thanh toán", 
      "Done": "Hoàn thành"
    } as const;
    
    const colors = {
      "Pending": "warning",
      "Payed": "info",
      "Done": "success"
    } as const;
    
    const label = statusLabels[status as keyof typeof statusLabels] || status;
    const color = colors[status as keyof typeof colors] || "default";
    
    
    return (
      <Chip 
        label={label}
        color={color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Quản lý phiếu dịch vụ
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Quản lý các phiếu yêu cầu dịch vụ y tế
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #3da9fc" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Assignment sx={{ fontSize: 40, color: "#3da9fc" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {medicalForms.length}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng phiếu dịch vụ
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
                <MedicalServices sx={{ fontSize: 40, color: "#28a745" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {medicalForms.filter(f => f.TrangThai === "Done").length}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Đã hoàn thành
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
                <Person sx={{ fontSize: 40, color: "#ef4565" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {medicalForms.filter(f => f.TrangThai === "Payed").length}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Cần xử lý (Đã thanh toán)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>



      {/* Medical Forms Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
            Danh sách phiếu dịch vụ
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Tên dịch vụ</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ngày yêu cầu</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Đơn giá</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bác sĩ phụ trách</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicalForms.map((form) => {
                  return (
                  <TableRow key={form.MaPYC} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                        {form.TenDichVu || services.find(s => s.MaDichVu === form.MaDichVu)?.TenDichVu || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        ID: {form.MaDichVu}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                        {form.TenBenhNhan || patients.find(p => p.MaBN === form.MaBN)?.HoTen || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#5f6c7b">
                        {new Date(form.NgayYeuCau).toLocaleDateString('vi-VN')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#5f6c7b">
                        {form.DonGia.toLocaleString('vi-VN')} VNĐ
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#5f6c7b">
                        {form.TenBacSi || doctors.find(d => d.MaNV === form.MaNV)?.HoTen || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(form.TrangThai)}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => {
                            setSelectedForm(form);
                            setOpenViewDialog(true);
                          }}
                          sx={{ color: "#3da9fc" }}
                        >
                          Xem
                        </Button>
                        {form.TrangThai === "Payed" && (
                          <Button
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => handleEditForm(form)}
                            sx={{ color: "#28a745" }}
                          >
                            Hoàn thành
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Edit Medical Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          {editingForm ? "Đánh dấu hoàn thành dịch vụ" : "Tạo phiếu yêu cầu mới"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày yêu cầu"
                type="date"
                value={formData.NgayYeuCau}
                onChange={(e) => setFormData({ ...formData, NgayYeuCau: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
                disabled={editingForm ? true : false} // Disable when editing
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Đơn giá"
                type="number"
                value={formData.DonGia}
                onChange={(e) => setFormData({ ...formData, DonGia: e.target.value })}
                required
                disabled={editingForm ? true : false} // Disable when editing
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Loại</InputLabel>
                <Select
                  value={formData.Loai}
                  onChange={(e) => setFormData({ ...formData, Loai: e.target.value as any })}
                  label="Loại"
                  disabled={editingForm ? true : false} // Disable when editing
                >
                  <MenuItem value="KhamBenh">Khám bệnh</MenuItem>
                  <MenuItem value="NhapVien">Nhập viện</MenuItem>
                  <MenuItem value="XuatVien">Xuất viện</MenuItem>
                  <MenuItem value="DichVu">Dịch vụ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.TrangThai}
                  onChange={(e) => setFormData({ ...formData, TrangThai: e.target.value as any })}
                  label="Trạng thái"
                  disabled={false} // Always enabled - this is the only field we can edit
                >
                  {editingForm ? (
                    // Only show "Done" option when editing
                    <MenuItem value="Done">Hoàn thành</MenuItem>
                  ) : (
                    // Show all options when creating new
                    <>
                      <MenuItem value="Pending">Đang chờ</MenuItem>
                      <MenuItem value="Payed">Đã thanh toán</MenuItem>
                      <MenuItem value="Done">Hoàn thành</MenuItem>
                    </>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={patients}
                getOptionLabel={(option) => `${option.HoTen} (${option.MaBN})`}
                value={patients.find(p => p.MaBN === formData.MaBN) || null}
                onChange={(_, newValue) => {
                  setFormData({ ...formData, MaBN: newValue?.MaBN || "" });
                }}
                disabled={editingForm ? true : false} // Disable when editing
                renderInput={(params) => (
                  <TextField {...params} label="Bệnh nhân" required />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={doctors}
                getOptionLabel={(option) => `${option.HoTen} (${option.MaNV})`}
                value={doctors.find(d => d.MaNV === formData.MaNV) || null}
                onChange={(_, newValue) => {
                  setFormData({ ...formData, MaNV: newValue?.MaNV || "" });
                }}
                disabled={editingForm ? true : false} // Disable when editing
                renderInput={(params) => (
                  <TextField {...params} label="Bác sĩ" required />
                )}
              />
            </Grid>
            {formData.Loai === "DichVu" && (
              <Grid item xs={12}>
                <Autocomplete
                  options={services}
                  getOptionLabel={(option) => `${option.TenDichVu} - ${option.GiaDichVu.toLocaleString('vi-VN')} VNĐ`}
                  value={services.find(s => s.MaDichVu === formData.MaDichVu) || null}
                  onChange={(_, newValue) => {
                    setFormData({ 
                      ...formData, 
                      MaDichVu: newValue?.MaDichVu || "",
                      DonGia: newValue?.GiaDichVu.toString() || formData.DonGia
                    });
                  }}
                  disabled={editingForm ? true : false} // Disable when editing
                  renderInput={(params) => (
                    <TextField {...params} label="Dịch vụ" required />
                  )}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => {
              setOpenDialog(false);
              setEditingForm(null);
              resetFormData();
            }} 
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={editingForm ? handleUpdateForm : handleCreateForm}
            sx={{
              bgcolor: "#3da9fc",
              "&:hover": { bgcolor: "#2b8fd1" }
            }}
          >
            {editingForm ? "Đánh dấu hoàn thành" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Medical Form Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Chi tiết phiếu yêu cầu
        </DialogTitle>
        {selectedForm && (
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="#5f6c7b">Mã phiếu:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedForm.MaPYC}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="#5f6c7b">Ngày yêu cầu:</Typography>
                <Typography variant="body1">{new Date(selectedForm.NgayYeuCau).toLocaleDateString('vi-VN')}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="#5f6c7b">Loại:</Typography>
                <Typography variant="body1">{selectedForm.Loai}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="#5f6c7b">Đơn giá:</Typography>
                <Typography variant="body1">{selectedForm.DonGia.toLocaleString('vi-VN')} VNĐ</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="#5f6c7b">Bệnh nhân:</Typography>
                <Typography variant="body1">{selectedForm.TenBenhNhan || "N/A"} ({selectedForm.MaBN})</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="#5f6c7b">Bác sĩ:</Typography>
                <Typography variant="body1">{selectedForm.TenBacSi || "N/A"} ({selectedForm.MaNV})</Typography>
              </Grid>
              {selectedForm.MaDichVu && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="#5f6c7b">Dịch vụ:</Typography>
                  <Typography variant="body1">{selectedForm.TenDichVu || "N/A"} ({selectedForm.MaDichVu})</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="#5f6c7b">Trạng thái:</Typography>
                {getStatusChip(selectedForm.TrangThai)}
              </Grid>
            </Grid>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)} color="inherit">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialog} onClose={() => setDeleteConfirmDialog(false)}>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Xác nhận xóa phiếu yêu cầu
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn xóa phiếu yêu cầu này không?
          </Typography>
          {formToDelete && (
            <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" color="#5f6c7b">Thông tin phiếu:</Typography>
              <Typography variant="body2"><strong>Mã phiếu:</strong> {formToDelete.MaPYC}</Typography>
              <Typography variant="body2"><strong>Bệnh nhân:</strong> {formToDelete.TenBenhNhan || patients.find(p => p.MaBN === formToDelete.MaBN)?.HoTen || "N/A"}</Typography>
              <Typography variant="body2"><strong>Loại:</strong> {formToDelete.Loai}</Typography>
              <Typography variant="body2"><strong>Ngày yêu cầu:</strong> {new Date(formToDelete.NgayYeuCau).toLocaleDateString('vi-VN')}</Typography>
            </Box>
          )}
          <Typography variant="body2" color="error" sx={{ mt: 2, fontStyle: "italic" }}>
            Hành động này không thể hoàn tác!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setDeleteConfirmDialog(false);
              setFormToDelete(null);
            }} 
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            color="error"
            sx={{
              bgcolor: "#ef4565",
              "&:hover": { bgcolor: "#d63447" }
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

export default serviceManage;
