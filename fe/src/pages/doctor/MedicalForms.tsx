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

const DoctorMedicalForms: FC = () => {
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
      console.log("Loading medical forms...");
      
      // Load current user info first
      const userRes = await employeeAPI.getAccount();
      if (userRes?.data) {
        setCurrentUser(userRes.data);
      }
      
      // Load medical forms from API
      const response = await medicalFormAPI.getAll();
      console.log("Medical forms response:", response.data);
      setMedicalForms(response.data);
      
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
      console.error("Error loading medical forms:", error);
      showNotification("Lỗi khi tải danh sách phiếu khám", "error");
    }
  };

  const handleCreateForm = async () => {
    try {
      console.log("Creating medical form:", formData);
      
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
      
      const response = await medicalFormAPI.create(requestData);
      console.log("Medical form API response:", response);
      
      // Axios response luôn có response.status (HTTP status code)
      // và response.data (backend response)
      // @ts-ignore
      if (response?.statusCode === 200 || response?.statusCode === 201 ) {
        showNotification("Tạo phiếu yêu cầu thành công", "success");
        setOpenDialog(false);
        resetFormData();
        loadMedicalForms();
      } else {
        showNotification("Lỗi không xác định từ server", "error");
      }
    } catch (error: any) {
      console.error("Error creating medical form:", error);
      
      let errorMessage = "Lỗi khi tạo phiếu yêu cầu";
      
      // Xử lý lỗi từ Axios
      if (error.response) {
        // Server trả về response với status code >= 400
        console.log("Error response:", error.response.data);
        
        if (error.response.data?.message) {
          if (Array.isArray(error.response.data.message)) {
            // Nếu message là array, lấy phần tử đầu tiên
            errorMessage = error.response.message[0];
          } else {
            errorMessage = error.response.message;
          }
        } else if (error.response?.error) {
          errorMessage = error.response.error;
        }
      } else if (error.request) {
        // Request được gửi nhưng không nhận được response
        errorMessage = "Không thể kết nối đến server";
      } else {
        // Lỗi khác
        errorMessage = error.message || "Lỗi không xác định";
      }
      
      showNotification(errorMessage, "error");
    }
  };

  const handleUpdateForm = async () => {
    try {
      if (!editingForm) return;
      
      const requestData = {
        NgayYeuCau: formData.NgayYeuCau,
        DonGia: formData.DonGia,
        Loai: formData.Loai,
        MaBN: formData.MaBN,
        MaNV: formData.MaNV,
        ...(formData.Loai === "DichVu" && { MaDichVu: formData.MaDichVu }),
        TrangThai: formData.TrangThai
      };
      
      const response = await medicalFormAPI.update(editingForm.MaPYC, requestData);
      console.log("Update medical form API response:", response);
      
      //@ts-ignore
      if (response?.statusCode === 200 || response?.statusCode === 201) {
        showNotification("Cập nhật phiếu yêu cầu thành công", "success");
        setOpenDialog(false);
        setEditingForm(null);
        resetFormData();
        loadMedicalForms();
      } else {
        //@ts-ignore
        showNotification(response.message[0], "error");
      }
    } catch (error: any) {
      console.error("Error updating medical form:", error);
      
      let errorMessage = "Lỗi khi cập nhật phiếu yêu cầu";
      
      // Xử lý lỗi từ Axios
      if (error.response) {
        console.log("Error response:", error.response.data);
        
        if (error.response.data?.message) {
          if (Array.isArray(error.response.data.message)) {
            errorMessage = error.response.data.message[0];
          } else {
            errorMessage = error.response.data.message;
          }
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.request) {
        errorMessage = "Không thể kết nối đến server";
      } else {
        errorMessage = error.message || "Lỗi không xác định";
      }
      
      showNotification(errorMessage, "error");
    }
  };

  const handleDeleteForm = async (form: MedicalForm) => {
    setFormToDelete(form);
    setDeleteConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!formToDelete) return;
    
    try {
      const response = await medicalFormAPI.delete(formToDelete.MaPYC);
      console.log("Delete medical form API response:", response);

      //@ts-ignore
      if (response?.statusCode === 200 || response?.statusCode === 204) {
        showNotification("Xóa phiếu yêu cầu thành công", "success");
        loadMedicalForms();
        setDeleteConfirmDialog(false);
        setFormToDelete(null);
      } else {
        showNotification("Lỗi không xác định từ server", "error");
      }
    } catch (error: any) {
      console.error("Error deleting medical form:", error);
      
      let errorMessage = "Lỗi khi xóa phiếu yêu cầu";
      
      if (error.response) {
        console.log("Error response:", error.response.data);
        
        if (error.response.data?.message) {
          if (Array.isArray(error.response.data.message)) {
            errorMessage = error.response.data.message[0];
          } else {
            errorMessage = error.response.data.message;
          }
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.request) {
        errorMessage = "Không thể kết nối đến server";
      } else {
        errorMessage = error.message || "Lỗi không xác định";
      }
      
      showNotification(errorMessage, "error");
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
    setEditingForm(form);
    setFormData({
      NgayYeuCau: form.NgayYeuCau.split('T')[0], // Format date for input
      DonGia: form.DonGia.toString(),
      Loai: form.Loai,
      MaBN: form.MaBN,
      MaNV: form.MaNV,
      MaDichVu: form.MaDichVu || "",
      TrangThai: form.TrangThai
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
    console.log("getStatusChip called with status:", status);
    
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
    
    console.log("Status chip - label:", label, "color:", color);
    
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
          Quản lý phiếu yêu cầu
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Tạo và quản lý phiếu yêu cầu khám bệnh, nhập viện, xuất viện và dịch vụ
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
                    Tổng phiếu yêu cầu
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
                    {medicalForms.filter(f => f.TrangThai === "Pending").length}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Đang chờ
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
          onClick={() => setOpenDialog(true)}
          sx={{
            bgcolor: "#3da9fc",
            "&:hover": { bgcolor: "#2b8fd1" },
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600
          }}
        >
          Tạo phiếu yêu cầu mới
        </Button>
      </Box>

      {/* Medical Forms Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
            Danh sách phiếu yêu cầu
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ngày yêu cầu</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Loại</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Đơn giá</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bác sĩ</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicalForms.map((form) => {
                  console.log("Rendering form:", form);
                  return (
                  <TableRow key={form.MaPYC} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                        {form.TenBenhNhan || patients.find(p => p.MaBN === form.MaBN)?.HoTen || "N/A"}
                      </Typography>
                      {/* <Typography variant="body2" color="#5f6c7b">
                        ID: {form.MaBN}
                      </Typography> */}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#5f6c7b">
                        {new Date(form.NgayYeuCau).toLocaleDateString('vi-VN')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#5f6c7b">
                        {form.Loai}
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
                        {form.TrangThai === "Pending" && (
                          <>
                            <Button
                              size="small"
                              startIcon={<Edit />}
                              onClick={() => handleEditForm(form)}
                              sx={{ color: "#28a745" }}
                            >
                              Sửa
                            </Button>
                            <Button
                              size="small"
                              startIcon={<Delete />}
                              onClick={() => handleDeleteForm(form)}
                              sx={{ color: "#ef4565" }}
                            >
                              Xóa
                            </Button>
                          </>
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

      {/* Create Medical Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          {editingForm ? "Cập nhật phiếu yêu cầu" : "Tạo phiếu yêu cầu mới"}
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
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Loại</InputLabel>
                <Select
                  value={formData.Loai}
                  onChange={(e) => setFormData({ ...formData, Loai: e.target.value as any })}
                  label="Loại"
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
                  disabled={editingForm === null} // Enable when editing, disable when creating new
                >
                  <MenuItem value="Pending">Đang chờ</MenuItem>
                  <MenuItem value="Payed">Đã thanh toán</MenuItem>
                  <MenuItem value="Done">Hoàn thành</MenuItem>
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
                renderInput={(params) => (
                  <TextField {...params} label="Bệnh nhân" required />
                )}
              />
            </Grid>
            {!editingForm && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Bác sĩ"
                  value={currentUser ? `${currentUser.HoTen} (${currentUser.MaNV})` : "Đang tải..."}
                  disabled
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            )}
            {editingForm && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Bác sĩ"
                  value={doctors.find(d => d.MaNV === formData.MaNV)?.HoTen 
                    ? `${doctors.find(d => d.MaNV === formData.MaNV)?.HoTen} (${formData.MaNV})`
                    : formData.MaNV || "Không xác định"
                  }
                  disabled
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="Không thể thay đổi bác sĩ khi chỉnh sửa phiếu"
                />
              </Grid>
            )}
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
            {editingForm ? "Cập nhật" : "Tạo mới"}
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

export default DoctorMedicalForms;
