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
  FormControlLabel,
  Checkbox
} from "@mui/material";
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  MedicalServices,
  Inventory,
  CheckCircle,
  Warning
} from "@mui/icons-material";
import { medicineAPI } from "../../services/api";

// Medicine enums and interfaces (moved from utils/api)
export enum DonViTinh {
  VIEN = 'VIEN',
  ONG = 'ONG',
  CHAI = 'CHAI',
  LO = 'LO',
  TUYP = 'TUYP',
  ML = 'ML',
  G = 'G',
  MCG = 'MCG',
  VY = 'VY'
}

export enum DonViDongGoi {
  HOP = 'HOP',
  HOP_VI = 'HOP_VI',
  HOP_ONG = 'HOP_ONG',
  THUNG = 'THUNG',
  CHAI_LO = 'CHAI_LO',
  GOI = 'GOI'
}

export enum DangBaoChe {
  VIEN_NEN = 'VIEN_NEN',
  VIEN_NANG = 'VIEN_NANG',
  DUNG_DICH = 'DUNG_DICH',
  BOT_PHA_TIEM = 'BOT_PHA_TIEM',
  THUOC_TIEU_KHONG = 'THUOC_TIEU_KHONG',
  DICH_TRUYEN = 'DICH_TRUYEN',
  SIRUP = 'SIRUP',
  DUNG_DICH_SAT_TRUNG = 'DUNG_DICH_SAT_TRUNG',
  THUOC_BOI = 'THUOC_BOI',
  XI_DANG = 'XI_DANG',
  VIEN_NGAM = 'VIEN_NGAM'
}

export interface Medicine {
  MaThuoc: string;
  TenThuoc: string;
  BHYT: boolean;
  Gia: string;
  DonViTinh: DonViTinh;
  DonViDongGoi: DonViDongGoi;
  DangBaoChe: DangBaoChe;
  HamLuong: string;
  SoLuongDongGoi: number;
}

export interface CreateMedicineDto {
  TenThuoc: string;
  BHYT: boolean;
  Gia: string;
  DonViTinh: DonViTinh;
  DonViDongGoi: DonViDongGoi;
  DangBaoChe: DangBaoChe;
  HamLuong: string;
  SoLuongDongGoi: number;
}

export interface UpdateMedicineDto {
  TenThuoc?: string;
  BHYT?: boolean;
  Gia?: string;
  DonViTinh?: DonViTinh;
  DonViDongGoi?: DonViDongGoi;
  DangBaoChe?: DangBaoChe;
  HamLuong?: string;
  SoLuongDongGoi?: number;
}

const AdminMedicines: FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<Medicine | null>(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");

  // Helper functions for Vietnamese translation
  const getDangBaoCheText = (dangBaoChe: DangBaoChe): string => {
    const mapping = {
      [DangBaoChe.VIEN_NEN]: "Viên nén",
      [DangBaoChe.VIEN_NANG]: "Viên nang",
      [DangBaoChe.DUNG_DICH]: "Dung dịch",
      [DangBaoChe.BOT_PHA_TIEM]: "Bột pha tiêm",
      [DangBaoChe.THUOC_TIEU_KHONG]: "Thuốc tiểu khống",
      [DangBaoChe.DICH_TRUYEN]: "Dịch truyền",
      [DangBaoChe.SIRUP]: "Siro",
      [DangBaoChe.DUNG_DICH_SAT_TRUNG]: "Dung dịch sát trùng",
      [DangBaoChe.THUOC_BOI]: "Thuốc bôi",
      [DangBaoChe.XI_DANG]: "Xi đăng",
      [DangBaoChe.VIEN_NGAM]: "Viên ngậm"
    };
    return mapping[dangBaoChe] || dangBaoChe;
  };

  const getDonViTinhText = (donViTinh: DonViTinh): string => {
    const mapping = {
      [DonViTinh.VIEN]: "Viên",
      [DonViTinh.ONG]: "Ống",
      [DonViTinh.CHAI]: "Chai",
      [DonViTinh.LO]: "Lọ",
      [DonViTinh.TUYP]: "Tuýp",
      [DonViTinh.ML]: "ML",
      [DonViTinh.G]: "Gram",
      [DonViTinh.MCG]: "MCG",
      [DonViTinh.VY]: "Vỉ"
    };
    return mapping[donViTinh] || donViTinh;
  };

  const getDonViDongGoiText = (donViDongGoi: DonViDongGoi): string => {
    const mapping = {
      [DonViDongGoi.HOP]: "Hộp",
      [DonViDongGoi.HOP_VI]: "Hộp vỉ",
      [DonViDongGoi.HOP_ONG]: "Hộp ống",
      [DonViDongGoi.THUNG]: "Thùng",
      [DonViDongGoi.CHAI_LO]: "Chai lọ",
      [DonViDongGoi.GOI]: "Gói"
    };
    return mapping[donViDongGoi] || donViDongGoi;
  };
  
  // Form data
  const [formData, setFormData] = useState<{
    TenThuoc: string;
    BHYT: boolean;
    Gia: string;
    DonViTinh: DonViTinh;
    DonViDongGoi: DonViDongGoi;
    DangBaoChe: DangBaoChe;
    HamLuong: string;
    SoLuongDongGoi: number;
  }>({
    TenThuoc: "",
    BHYT: false,
    Gia: "",
    DonViTinh: DonViTinh.VIEN,
    DonViDongGoi: DonViDongGoi.HOP,
    DangBaoChe: DangBaoChe.VIEN_NEN,
    HamLuong: "",
    SoLuongDongGoi: 1
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
    loadMedicines();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [medicines, searchTerm, sortBy]);

  const loadMedicines = async () => {
    try {
      const response = await medicineAPI.getAll();
      console.log("Medicine API response:", response);
      
      if (response?.data && Array.isArray(response.data)) {
        setMedicines(response.data);
      } else {
        console.log("No medicine data found in response:", response);
        setMedicines([]);
      }
    } catch (error) {
      console.error("Error loading medicines:", error);
      showNotification("Lỗi khi tải danh sách thuốc", "error");
    }
  };

  const filterMedicines = () => {
    if (!medicines || !Array.isArray(medicines)) {
      setFilteredMedicines([]);
      return;
    }
    
    let filtered = medicines;
    
    if (searchTerm) {
      filtered = filtered.filter(medicine => 
        medicine.TenThuoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.HamLuong.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.MaThuoc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort by name or price
    if (sortBy === "name") {
      filtered = filtered.sort((a, b) => a.TenThuoc.localeCompare(b.TenThuoc));
    } else if (sortBy === "price") {
      filtered = filtered.sort((a, b) => parseInt(a.Gia) - parseInt(b.Gia));
    }
    
    setFilteredMedicines(filtered);
  };

  const handleCreateMedicine = async () => {
    try {
      const createData: CreateMedicineDto = {
        TenThuoc: formData.TenThuoc,
        BHYT: formData.BHYT,
        Gia: formData.Gia,
        DonViTinh: formData.DonViTinh,
        DonViDongGoi: formData.DonViDongGoi,
        DangBaoChe: formData.DangBaoChe,
        HamLuong: formData.HamLuong,
        SoLuongDongGoi: formData.SoLuongDongGoi
      };
      
      await medicineAPI.create(createData);
      showNotification("Thêm thuốc mới thành công", "success");
      setOpenNewDialog(false);
      resetForm();
      loadMedicines();
    } catch (error) {
      console.error("Error creating medicine:", error);
      showNotification("Lỗi khi thêm thuốc mới", "error");
    }
  };

  const handleUpdateMedicine = async () => {
    if (!selectedMedicine) return;
    
    try {
      const updateData: UpdateMedicineDto = {
        TenThuoc: formData.TenThuoc,
        BHYT: formData.BHYT,
        Gia: formData.Gia,
        DonViTinh: formData.DonViTinh,
        DonViDongGoi: formData.DonViDongGoi,
        DangBaoChe: formData.DangBaoChe,
        HamLuong: formData.HamLuong,
        SoLuongDongGoi: formData.SoLuongDongGoi
      };
      
      await medicineAPI.update(selectedMedicine.MaThuoc, updateData);
      showNotification("Cập nhật thuốc thành công", "success");
      setOpenEditDialog(false);
      resetForm();
      loadMedicines();
    } catch (error) {
      console.error("Error updating medicine:", error);
      showNotification("Lỗi khi cập nhật thuốc", "error");
    }
  };

  const handleDeleteMedicine = async (medicineId: string) => {
    try {
      await medicineAPI.delete(medicineId);
      showNotification("Xóa thuốc thành công", "success");
      loadMedicines();
      setOpenDeleteDialog(false);
      setMedicineToDelete(null);
    } catch (error) {
      console.error("Error deleting medicine:", error);
      showNotification("Lỗi khi xóa thuốc", "error");
    }
  };

  const confirmDeleteMedicine = (medicine: Medicine) => {
    setMedicineToDelete(medicine);
    setOpenDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      TenThuoc: "",
      BHYT: false,
      Gia: "",
      DonViTinh: DonViTinh.VIEN,
      DonViDongGoi: DonViDongGoi.HOP,
      DangBaoChe: DangBaoChe.VIEN_NEN,
      HamLuong: "",
      SoLuongDongGoi: 1
    });
    setSelectedMedicine(null);
  };

  const handleEdit = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setFormData({
      TenThuoc: medicine.TenThuoc,
      BHYT: medicine.BHYT,
      Gia: medicine.Gia,
      DonViTinh: medicine.DonViTinh,
      DonViDongGoi: medicine.DonViDongGoi,
      DangBaoChe: medicine.DangBaoChe,
      HamLuong: medicine.HamLuong,
      SoLuongDongGoi: medicine.SoLuongDongGoi
    });
    setOpenEditDialog(true);
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

  const totalMedicines = medicines?.length || 0;
  const bhytMedicines = medicines?.filter(m => m.BHYT)?.length || 0;
  const nonBhytMedicines = medicines?.filter(m => !m.BHYT)?.length || 0;
  const avgPrice = medicines?.length > 0 ? Math.round(medicines.reduce((sum, m) => sum + parseInt(m.Gia), 0) / medicines.length) : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Quản lý Thuốc
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Quản lý kho thuốc, theo dõi tồn kho và giá cả
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
                    {totalMedicines}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng loại thuốc
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
                    {bhytMedicines}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Thuốc BHYT
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
                <Warning sx={{ fontSize: 40, color: "#ffc107" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {nonBhytMedicines}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Thuốc thường
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
                <Inventory sx={{ fontSize: 40, color: "#ef4565" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {avgPrice.toLocaleString()}đ
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Giá trung bình
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
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm thuốc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: "#5f6c7b", mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sắp xếp theo</InputLabel>
                <Select
                  value={sortBy}
                  label="Sắp xếp theo"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="name">Tên thuốc (A-Z)</MenuItem>
                  <MenuItem value="price">Giá thấp đến cao</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={7} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenNewDialog(true)}
                sx={{
                  bgcolor: "#3da9fc",
                  "&:hover": { bgcolor: "#2b8fd1" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                Thêm thuốc mới
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Medicines Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Tên thuốc</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Hàm lượng</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Dạng bào chế</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Đơn vị tính</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Giá</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>BHYT</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMedicines
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((medicine) => (
                <TableRow key={medicine.MaThuoc} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                      {medicine.TenThuoc}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {medicine.HamLuong}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getDangBaoCheText(medicine.DangBaoChe)}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {getDonViTinhText(medicine.DonViTinh)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {parseInt(medicine.Gia).toLocaleString('vi-VN')}đ
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={medicine.BHYT ? "BHYT" : "Thường"}
                      size="small"
                      color={medicine.BHYT ? "success" : "default"}
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedMedicine(medicine);
                          setOpenViewDialog(true);
                        }}
                        sx={{ color: "#3da9fc" }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(medicine)}
                        sx={{ color: "#28a745" }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => confirmDeleteMedicine(medicine)}
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
          count={filteredMedicines.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Chi tiết thuốc
        </DialogTitle>
        <DialogContent dividers>
          {selectedMedicine && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                      Thông tin cơ bản
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography><strong>Mã thuốc:</strong> {selectedMedicine.MaThuoc}</Typography>
                      <Typography><strong>Tên thuốc:</strong> {selectedMedicine.TenThuoc}</Typography>
                      <Typography><strong>Hàm lượng:</strong> {selectedMedicine.HamLuong}</Typography>
                      <Typography><strong>Dạng bào chế:</strong> {getDangBaoCheText(selectedMedicine.DangBaoChe)}</Typography>
                      <Typography><strong>Đơn vị tính:</strong> {getDonViTinhText(selectedMedicine.DonViTinh)}</Typography>
                      <Typography><strong>BHYT:</strong> {selectedMedicine.BHYT ? "Có" : "Không"}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                      Thông tin giá và đóng gói
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography><strong>Giá:</strong> {parseInt(selectedMedicine.Gia).toLocaleString('vi-VN')}đ</Typography>
                      <Typography><strong>Đơn vị đóng gói:</strong> {getDonViDongGoiText(selectedMedicine.DonViDongGoi)}</Typography>
                      <Typography><strong>Số lượng đóng gói:</strong> {selectedMedicine.SoLuongDongGoi}</Typography>
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
          resetForm();
        }} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          {openNewDialog ? "Thêm thuốc mới" : "Chỉnh sửa thuốc"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên thuốc"
                value={formData.TenThuoc}
                onChange={(e) => setFormData({ ...formData, TenThuoc: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hàm lượng"
                value={formData.HamLuong}
                onChange={(e) => setFormData({ ...formData, HamLuong: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Dạng bào chế</InputLabel>
                <Select
                  value={formData.DangBaoChe}
                  label="Dạng bào chế"
                  onChange={(e) => setFormData({ ...formData, DangBaoChe: e.target.value as DangBaoChe })}
                >
                  <MenuItem value={DangBaoChe.VIEN_NEN}>Viên nén</MenuItem>
                  <MenuItem value={DangBaoChe.VIEN_NANG}>Viên nang</MenuItem>
                  <MenuItem value={DangBaoChe.DUNG_DICH}>Dung dịch</MenuItem>
                  <MenuItem value={DangBaoChe.BOT_PHA_TIEM}>Bột pha tiêm</MenuItem>
                  <MenuItem value={DangBaoChe.THUOC_TIEU_KHONG}>Thuốc tiểu khống</MenuItem>
                  <MenuItem value={DangBaoChe.DICH_TRUYEN}>Dịch truyền</MenuItem>
                  <MenuItem value={DangBaoChe.SIRUP}>Siro</MenuItem>
                  <MenuItem value={DangBaoChe.DUNG_DICH_SAT_TRUNG}>Dung dịch sát trùng</MenuItem>
                  <MenuItem value={DangBaoChe.THUOC_BOI}>Thuốc bôi</MenuItem>
                  <MenuItem value={DangBaoChe.XI_DANG}>Xi đăng</MenuItem>
                  <MenuItem value={DangBaoChe.VIEN_NGAM}>Viên ngậm</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Đơn vị tính</InputLabel>
                <Select
                  value={formData.DonViTinh}
                  label="Đơn vị tính"
                  onChange={(e) => setFormData({ ...formData, DonViTinh: e.target.value as DonViTinh })}
                >
                  <MenuItem value={DonViTinh.VIEN}>Viên</MenuItem>
                  <MenuItem value={DonViTinh.ONG}>Ống</MenuItem>
                  <MenuItem value={DonViTinh.CHAI}>Chai</MenuItem>
                  <MenuItem value={DonViTinh.LO}>Lọ</MenuItem>
                  <MenuItem value={DonViTinh.TUYP}>Tuýp</MenuItem>
                  <MenuItem value={DonViTinh.ML}>ML</MenuItem>
                  <MenuItem value={DonViTinh.G}>Gram</MenuItem>
                  <MenuItem value={DonViTinh.MCG}>MCG</MenuItem>
                  <MenuItem value={DonViTinh.VY}>Vỉ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Đơn vị đóng gói</InputLabel>
                <Select
                  value={formData.DonViDongGoi}
                  label="Đơn vị đóng gói"
                  onChange={(e) => setFormData({ ...formData, DonViDongGoi: e.target.value as DonViDongGoi })}
                >
                  <MenuItem value={DonViDongGoi.HOP}>Hộp</MenuItem>
                  <MenuItem value={DonViDongGoi.HOP_VI}>Hộp vỉ</MenuItem>
                  <MenuItem value={DonViDongGoi.HOP_ONG}>Hộp ống</MenuItem>
                  <MenuItem value={DonViDongGoi.THUNG}>Thùng</MenuItem>
                  <MenuItem value={DonViDongGoi.CHAI_LO}>Chai lọ</MenuItem>
                  <MenuItem value={DonViDongGoi.GOI}>Gói</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số lượng đóng gói"
                type="number"
                value={formData.SoLuongDongGoi}
                onChange={(e) => setFormData({ ...formData, SoLuongDongGoi: parseInt(e.target.value) || 1 })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Giá (VNĐ)"
                type="number"
                value={formData.Gia}
                onChange={(e) => setFormData({ ...formData, Gia: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.BHYT}
                    onChange={(e) => setFormData({ ...formData, BHYT: e.target.checked })}
                  />
                }
                label="Thuốc BHYT"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => {
              setOpenNewDialog(false);
              setOpenEditDialog(false);
              resetForm();
            }} 
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={openNewDialog ? handleCreateMedicine : handleUpdateMedicine}
            sx={{
              bgcolor: "#3da9fc",
              "&:hover": { bgcolor: "#2b8fd1" }
            }}
          >
            {openNewDialog ? "Thêm thuốc" : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
          <Warning sx={{ color: "#ef4565" }} />
          Xác nhận xóa thuốc
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa thuốc <strong>"{medicineToDelete?.TenThuoc}"</strong>?
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "#5f6c7b" }}>
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => {
              setOpenDeleteDialog(false);
              setMedicineToDelete(null);
            }} 
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={() => medicineToDelete && handleDeleteMedicine(medicineToDelete.MaThuoc)}
            sx={{
              bgcolor: "#ef4565",
              "&:hover": { bgcolor: "#d1395a" }
            }}
          >
            Xác nhận xóa
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

export default AdminMedicines;
