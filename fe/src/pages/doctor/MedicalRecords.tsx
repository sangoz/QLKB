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
  Visibility,
  PersonAdd,
  Assignment,
  CalendarToday,
  AccessTime,
  LocalHospital
} from "@mui/icons-material";

interface Patient {
  ID: number;
  HoTen: string;
  NgaySinh: string;
  GioiTinh: string;
  SoDienThoai: string;
  DiaChi: string;
  CCCD: string;
  Email: string;
}

interface MedicalRecord {
  ID: number;
  BenhNhanID: number;
  HoTenBenhNhan: string;
  NgayTao: string;
  TrieuChung: string;
  LyDoKham: string;
  TienSuBenh: string;
  DiUng: string;
  ThuocDangSuDung: string;
  KetQuaKham: string;
  TrangThai: 'Mới tạo' | 'Đang khám' | 'Hoàn thành';
  BacSiPhuTrach: string;
  KhoaKham: string;
  GhiChu: string;
}

interface Department {
  ID: number;
  TenKhoa: string;
  MoTa: string;
}

const DoctorMedicalRecords: FC = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    BenhNhanID: "",
    HoTenBenhNhan: "",
    TrieuChung: "",
    LyDoKham: "",
    TienSuBenh: "",
    DiUng: "",
    ThuocDangSuDung: "",
    KhoaKham: "",
    GhiChu: ""
  });
  
  // Patient search
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
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
    loadMedicalRecords();
    loadPatients();
    loadDepartments();
  }, []);

  const loadMedicalRecords = async () => {
    try {
      console.log("Loading medical records...");
      // TODO: Call API GET /api/v1/hosobenhan
      // Headers: Authorization: Bearer {access_token}
      // Response: MedicalRecord[] list of medical records
      
      // Mock data for development
      const mockRecords: MedicalRecord[] = [
        {
          ID: 1,
          BenhNhanID: 1001,
          HoTenBenhNhan: "Nguyễn Văn An",
          NgayTao: "2024-07-29",
          TrieuChung: "Đau đầu, chóng mặt, mệt mỏi",
          LyDoKham: "Khám sức khỏe định kỳ",
          TienSuBenh: "Cao huyết áp từ 2 năm trước",
          DiUng: "Không có",
          ThuocDangSuDung: "Thuốc hạ huyết áp",
          KetQuaKham: "",
          TrangThai: "Mới tạo",
          BacSiPhuTrach: "",
          KhoaKham: "Khoa Tim mạch",
          GhiChu: "Bệnh nhân cần khám định kỳ"
        },
        {
          ID: 2,
          BenhNhanID: 1002,
          HoTenBenhNhan: "Trần Thị Bình",
          NgayTao: "2024-07-29",
          TrieuChung: "Đau họng, sốt nhẹ",
          LyDoKham: "Viêm họng",
          TienSuBenh: "Không có",
          DiUng: "Dị ứng penicillin",
          ThuocDangSuDung: "Không có",
          KetQuaKham: "Viêm họng cấp",
          TrangThai: "Đang khám",
          BacSiPhuTrach: "BS. Lê Văn Minh",
          KhoaKham: "Khoa Nội tổng hợp",
          GhiChu: "Cần theo dõi sát"
        },
        {
          ID: 3,
          BenhNhanID: 1003,
          HoTenBenhNhan: "Lê Văn Cường",
          NgayTao: "2024-07-28",
          TrieuChung: "Đau ngực, khó thở",
          LyDoKham: "Khám tim mạch",
          TienSuBenh: "Bệnh tim từ nhỏ",
          DiUng: "Không có",
          ThuocDangSuDung: "Thuốc tim",
          KetQuaKham: "Bệnh tim bẩm sinh",
          TrangThai: "Hoàn thành",
          BacSiPhuTrach: "BS. Trần Thị Lan",
          KhoaKham: "Khoa Tim mạch",
          GhiChu: "Cần phẫu thuật"
        }
      ];
      
      setMedicalRecords(mockRecords);
    } catch (error) {
      console.error("Error loading medical records:", error);
      showNotification("Lỗi khi tải hồ sơ bệnh án", "error");
    }
  };

  const loadPatients = async () => {
    try {
      console.log("Loading patients...");
      // TODO: Call API GET /api/v1/benhnhan
      
      // Mock data for development
      const mockPatients: Patient[] = [
        {
          ID: 1001,
          HoTen: "Nguyễn Văn An",
          NgaySinh: "1980-05-15",
          GioiTinh: "Nam",
          SoDienThoai: "0901234567",
          DiaChi: "123 Nguyễn Trãi, Q.1, TP.HCM",
          CCCD: "079080001234",
          Email: "nguyenvanan@email.com"
        },
        {
          ID: 1002,
          HoTen: "Trần Thị Bình",
          NgaySinh: "1990-08-20",
          GioiTinh: "Nữ",
          SoDienThoai: "0907654321",
          DiaChi: "456 Lê Lợi, Q.3, TP.HCM",
          CCCD: "079090005678",
          Email: "tranthibinh@email.com"
        },
        {
          ID: 1003,
          HoTen: "Lê Văn Cường",
          NgaySinh: "1975-12-10",
          GioiTinh: "Nam",
          SoDienThoai: "0909876543",
          DiaChi: "789 Võ Văn Tần, Q.10, TP.HCM",
          CCCD: "079075009012",
          Email: "levancuong@email.com"
        }
      ];
      
      setPatients(mockPatients);
    } catch (error) {
      console.error("Error loading patients:", error);
      showNotification("Lỗi khi tải danh sách bệnh nhân", "error");
    }
  };

  const loadDepartments = async () => {
    try {
      console.log("Loading departments...");
      // TODO: Call API GET /api/v1/khoa
      
      // Mock data for development
      const mockDepartments: Department[] = [
        { ID: 1, TenKhoa: "Khoa Tim mạch", MoTa: "Chuyên khoa tim mạch" },
        { ID: 2, TenKhoa: "Khoa Nội tổng hợp", MoTa: "Khoa nội tổng hợp" },
        { ID: 3, TenKhoa: "Khoa Ngoại tổng hợp", MoTa: "Khoa ngoại tổng hợp" },
        { ID: 4, TenKhoa: "Khoa Sản phụ khoa", MoTa: "Khoa sản phụ khoa" },
        { ID: 5, TenKhoa: "Khoa Nhi", MoTa: "Khoa nhi" }
      ];
      
      setDepartments(mockDepartments);
    } catch (error) {
      console.error("Error loading departments:", error);
      showNotification("Lỗi khi tải danh sách khoa", "error");
    }
  };

  const handleCreateRecord = async () => {
    try {
      console.log("Creating medical record:", formData);
      // TODO: Call API POST /api/v1/hosobenhan
      // Headers: Authorization: Bearer {access_token}
      // Body: formData
      
      showNotification("Tạo hồ sơ bệnh án thành công", "success");
      setOpenDialog(false);
      resetFormData();
      loadMedicalRecords();
    } catch (error) {
      console.error("Error creating medical record:", error);
      showNotification("Lỗi khi tạo hồ sơ bệnh án", "error");
    }
  };

  const handleUpdateRecord = async () => {
    try {
      console.log("Updating medical record:", selectedRecord?.ID, formData);
      // TODO: Call API PUT /api/v1/hosobenhan/{id}
      // Headers: Authorization: Bearer {access_token}
      // Body: formData
      
      showNotification("Cập nhật hồ sơ bệnh án thành công", "success");
      setOpenDialog(false);
      resetFormData();
      loadMedicalRecords();
    } catch (error) {
      console.error("Error updating medical record:", error);
      showNotification("Lỗi khi cập nhật hồ sơ bệnh án", "error");
    }
  };

  const openCreateDialog = () => {
    setIsEdit(false);
    setSelectedRecord(null);
    setSelectedPatient(null);
    resetFormData();
    setOpenDialog(true);
  };

  const openEditDialog = (record: MedicalRecord) => {
    setIsEdit(true);
    setSelectedRecord(record);
    const patient = patients.find(p => p.ID === record.BenhNhanID);
    setSelectedPatient(patient || null);
    setFormData({
      BenhNhanID: record.BenhNhanID.toString(),
      HoTenBenhNhan: record.HoTenBenhNhan,
      TrieuChung: record.TrieuChung,
      LyDoKham: record.LyDoKham,
      TienSuBenh: record.TienSuBenh,
      DiUng: record.DiUng,
      ThuocDangSuDung: record.ThuocDangSuDung,
      KhoaKham: record.KhoaKham,
      GhiChu: record.GhiChu
    });
    setOpenDialog(true);
  };

  const resetFormData = () => {
    setFormData({
      BenhNhanID: "",
      HoTenBenhNhan: "",
      TrieuChung: "",
      LyDoKham: "",
      TienSuBenh: "",
      DiUng: "",
      ThuocDangSuDung: "",
      KhoaKham: "",
      GhiChu: ""
    });
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const getStatusChip = (status: string) => {
    const colors = {
      "Mới tạo": "info",
      "Đang khám": "warning",
      "Hoàn thành": "success"
    } as const;
    
    return (
      <Chip 
        label={status}
        color={colors[status as keyof typeof colors] || "default"}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const handlePatientSelect = (patient: Patient | null) => {
    setSelectedPatient(patient);
    if (patient) {
      setFormData({
        ...formData,
        BenhNhanID: patient.ID.toString(),
        HoTenBenhNhan: patient.HoTen
      });
    } else {
      setFormData({
        ...formData,
        BenhNhanID: "",
        HoTenBenhNhan: ""
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4} display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Lập hồ sơ bệnh án
          </Typography>
          <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
            Tạo và quản lý hồ sơ bệnh án cho bệnh nhân
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openCreateDialog}
          sx={{ bgcolor: "#3da9fc", "&:hover": { bgcolor: "#2c8fd1" }, py: 1.5, fontWeight: 600 }}
        >
          Tạo hồ sơ bệnh án mới
        </Button>
      </Box>
      {/* Medical Records Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
            Danh sách hồ sơ bệnh án
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ngày tạo</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Khoa khám</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bác sĩ</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicalRecords.map((record) => (
                  <TableRow key={record.ID} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                        {record.HoTenBenhNhan}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        ID: {record.BenhNhanID}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#5f6c7b">
                        {new Date(record.NgayTao).toLocaleDateString('vi-VN')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#5f6c7b">
                        {record.KhoaKham}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#5f6c7b">
                        {record.BacSiPhuTrach || "Chưa phân công"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          sx={{ color: "#3da9fc" }}
                        >
                          Xem
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => openEditDialog(record)}
                          sx={{ color: "#28a745" }}
                        >
                          Sửa
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Edit Medical Record Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          {isEdit ? "Cập nhật hồ sơ bệnh án" : "Tạo hồ sơ bệnh án mới"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Patient Selection */}
            <Grid item xs={12}>
              <Autocomplete
                options={patients}
                getOptionLabel={(option) => `${option.HoTen} (ID: ${option.ID})`}
                value={selectedPatient}
                onChange={(_, value) => handlePatientSelect(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn bệnh nhân"
                    required
                    placeholder="Tìm kiếm bệnh nhân..."
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {option.HoTen}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        ID: {option.ID} | SĐT: {option.SoDienThoai}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Grid>

            {/* Patient Info Display */}
            {selectedPatient && (
              <Grid item xs={12}>
                <Card sx={{ bgcolor: "#f8f9fa", p: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600, mb: 1 }}>
                    Thông tin bệnh nhân
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#5f6c7b">
                        <strong>Ngày sinh:</strong> {new Date(selectedPatient.NgaySinh).toLocaleDateString('vi-VN')}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        <strong>Giới tính:</strong> {selectedPatient.GioiTinh}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        <strong>SĐT:</strong> {selectedPatient.SoDienThoai}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#5f6c7b">
                        <strong>CCCD:</strong> {selectedPatient.CCCD}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        <strong>Email:</strong> {selectedPatient.Email}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        <strong>Địa chỉ:</strong> {selectedPatient.DiaChi}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            )}

            {/* Medical Record Form */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lý do khám"
                value={formData.LyDoKham}
                onChange={(e) => setFormData({ ...formData, LyDoKham: e.target.value })}
                required
                placeholder="VD: Khám sức khỏe định kỳ"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Khoa khám</InputLabel>
                <Select
                  value={formData.KhoaKham}
                  label="Khoa khám"
                  onChange={(e) => setFormData({ ...formData, KhoaKham: e.target.value })}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.ID} value={dept.TenKhoa}>
                      {dept.TenKhoa}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Triệu chứng"
                value={formData.TrieuChung}
                onChange={(e) => setFormData({ ...formData, TrieuChung: e.target.value })}
                multiline
                rows={3}
                required
                placeholder="Mô tả chi tiết triệu chứng của bệnh nhân..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiền sử bệnh"
                value={formData.TienSuBenh}
                onChange={(e) => setFormData({ ...formData, TienSuBenh: e.target.value })}
                multiline
                rows={2}
                placeholder="Các bệnh đã mắc trước đây..."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dị ứng"
                value={formData.DiUng}
                onChange={(e) => setFormData({ ...formData, DiUng: e.target.value })}
                placeholder="VD: Dị ứng penicillin, tôm cua..."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Thuốc đang sử dụng"
                value={formData.ThuocDangSuDung}
                onChange={(e) => setFormData({ ...formData, ThuocDangSuDung: e.target.value })}
                placeholder="Các loại thuốc hiện tại..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                value={formData.GhiChu}
                onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
                multiline
                rows={3}
                placeholder="Ghi chú thêm về bệnh nhân..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={isEdit ? handleUpdateRecord : handleCreateRecord}
            disabled={!selectedPatient || !formData.LyDoKham || !formData.TrieuChung || !formData.KhoaKham}
            sx={{
              bgcolor: "#3da9fc",
              "&:hover": { bgcolor: "#2b8fd1" }
            }}
          >
            {isEdit ? "Cập nhật" : "Tạo hồ sơ"}
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

export default DoctorMedicalRecords;
