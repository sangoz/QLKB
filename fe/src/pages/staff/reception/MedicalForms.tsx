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
  Stepper,
  Step,
  StepLabel,
  Divider
} from "@mui/material";
import {
  Assignment,
  PersonAdd,
  Search,
  Visibility,
  Edit,
  Print,
  CheckCircle,
  Pending,
  Cancel,
  MedicalServices,
  CalendarMonth,
  Person
} from "@mui/icons-material";

interface MedicalForm {
  ID: number;
  MaPhieu: string;
  BenhNhanID: number;
  TenBenhNhan: string;
  CCCD: string;
  NgaySinh: string;
  GioiTinh: string;
  SoDienThoai: string;
  DiaChi: string;
  NgayTaoPhieu: string;
  LoaiKham: 'Khám tổng quát' | 'Khám chuyên khoa' | 'Tái khám' | 'Cấp cứu';
  BacSiKham?: string;
  KhoaKham?: string;
  TrieuChung: string;
  TienSuBenh: string;
  DiUng: string;
  TrangThai: 'Chờ khám' | 'Đang khám' | 'Hoàn thành' | 'Hủy';
  GhiChu?: string;
  ThuTu: number;
}

interface ReceptionStats {
  phieuHomNay: number;
  phieuChoKham: number;
  phieuHoanThanh: number;
  benhNhanMoi: number;
}

const ReceptionMedicalForms: FC = () => {
  const [medicalForms, setMedicalForms] = useState<MedicalForm[]>([]);
  const [filteredForms, setFilteredForms] = useState<MedicalForm[]>([]);
  const [receptionStats, setReceptionStats] = useState<ReceptionStats>({
    phieuHomNay: 0,
    phieuChoKham: 0,
    phieuHoanThanh: 0,
    benhNhanMoi: 0
  });
  
  const [selectedForm, setSelectedForm] = useState<MedicalForm | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("today");
  
  // Form data
  const [formData, setFormData] = useState({
    // Thông tin bệnh nhân
    tenBenhNhan: "",
    cccd: "",
    ngaySinh: "",
    gioiTinh: "Nam",
    soDienThoai: "",
    diaChi: "",
    // Thông tin khám
    loaiKham: "Khám tổng quát",
    bacSiKham: "",
    khoaKham: "",
    trieuChung: "",
    tienSuBenh: "",
    diUng: "",
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

  const steps = ['Thông tin bệnh nhân', 'Thông tin khám bệnh', 'Xác nhận'];

  useEffect(() => {
    loadMedicalForms();
    loadReceptionStats();
  }, []);

  useEffect(() => {
    filterForms();
  }, [medicalForms, searchTerm, statusFilter, typeFilter, dateFilter]);

  const loadMedicalForms = async () => {
    try {
      console.log("Loading medical forms...");
      // TODO: Call API GET /api/reception/medical-forms
      // Headers: Authorization: Bearer {access_token}
      // Response: MedicalForm[] list of medical forms
      
      // Mock data
      const mockForms: MedicalForm[] = [
        {
          ID: 1,
          MaPhieu: "PKB001",
          BenhNhanID: 1001,
          TenBenhNhan: "Nguyễn Văn An",
          CCCD: "001234567890",
          NgaySinh: "1980-05-15",
          GioiTinh: "Nam",
          SoDienThoai: "0901234567",
          DiaChi: "123 Nguyễn Trãi, Q.1, TP.HCM",
          NgayTaoPhieu: "2025-07-29",
          LoaiKham: "Khám tổng quát",
          BacSiKham: "BS. Trần Thị Lan",
          KhoaKham: "Khoa Nội",
          TrieuChung: "Đau đầu, chóng mặt",
          TienSuBenh: "Cao huyết áp",
          DiUng: "Không",
          TrangThai: "Chờ khám",
          ThuTu: 1
        },
        {
          ID: 2,
          MaPhieu: "PKB002",
          BenhNhanID: 1002,
          TenBenhNhan: "Trần Thị Bình",
          CCCD: "001234567891",
          NgaySinh: "1975-08-22",
          GioiTinh: "Nữ",
          SoDienThoai: "0907654321",
          DiaChi: "456 Lê Lợi, Q.3, TP.HCM",
          NgayTaoPhieu: "2025-07-29",
          LoaiKham: "Khám chuyên khoa",
          BacSiKham: "BS. Lê Văn Minh",
          KhoaKham: "Khoa Tim mạch",
          TrieuChung: "Đau ngực, khó thở",
          TienSuBenh: "Bệnh tim",
          DiUng: "Penicillin",
          TrangThai: "Đang khám",
          ThuTu: 2
        }
      ];
      
      setMedicalForms(mockForms);
    } catch (error) {
      console.error("Error loading medical forms:", error);
      showNotification("Lỗi khi tải danh sách phiếu khám", "error");
    }
  };

  const loadReceptionStats = async () => {
    try {
      console.log("Loading reception statistics...");
      // TODO: Call API GET /api/reception/stats
      // Headers: Authorization: Bearer {access_token}
      
      const mockStats: ReceptionStats = {
        phieuHomNay: 15,
        phieuChoKham: 8,
        phieuHoanThanh: 7,
        benhNhanMoi: 5
      };
      
      setReceptionStats(mockStats);
    } catch (error) {
      console.error("Error loading reception stats:", error);
    }
  };

  const filterForms = () => {
    let filtered = medicalForms;
    
    if (searchTerm) {
      filtered = filtered.filter(form => 
        form.MaPhieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.TenBenhNhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.CCCD.includes(searchTerm) ||
        form.SoDienThoai.includes(searchTerm)
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(form => form.TrangThai === statusFilter);
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(form => form.LoaiKham === typeFilter);
    }
    
    if (dateFilter === "today") {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(form => form.NgayTaoPhieu === today);
    }
    
    setFilteredForms(filtered);
  };

  const handleCreateForm = () => {
    setFormData({
      tenBenhNhan: "",
      cccd: "",
      ngaySinh: "",
      gioiTinh: "Nam",
      soDienThoai: "",
      diaChi: "",
      loaiKham: "Khám tổng quát",
      bacSiKham: "",
      khoaKham: "",
      trieuChung: "",
      tienSuBenh: "",
      diUng: "",
      ghiChu: ""
    });
    setActiveStep(0);
    setOpenCreateDialog(true);
  };

  const handleViewForm = (form: MedicalForm) => {
    setSelectedForm(form);
    setOpenViewDialog(true);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmitForm = async () => {
    try {
      console.log("Creating medical form:", formData);
      // TODO: Call API POST /api/reception/medical-forms
      // Headers: Authorization: Bearer {access_token}
      // Body: formData
      
      showNotification("Tạo phiếu khám bệnh thành công", "success");
      setOpenCreateDialog(false);
      setActiveStep(0);
      loadMedicalForms();
      loadReceptionStats();
    } catch (error) {
      console.error("Error creating medical form:", error);
      showNotification("Lỗi khi tạo phiếu khám bệnh", "error");
    }
  };

  const handlePrintForm = (form: MedicalForm) => {
    console.log("Printing medical form:", form.MaPhieu);
    // TODO: Generate and print medical form
    showNotification("Đang in phiếu khám bệnh...", "info");
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

  const getStatusChip = (status: string) => {
    const colors = {
      "Chờ khám": "warning",
      "Đang khám": "info",
      "Hoàn thành": "success",
      "Hủy": "error"
    } as const;
    
    const icons = {
      "Chờ khám": <Pending sx={{ fontSize: 14 }} />,
      "Đang khám": <MedicalServices sx={{ fontSize: 14 }} />,
      "Hoàn thành": <CheckCircle sx={{ fontSize: 14 }} />,
      "Hủy": <Cancel sx={{ fontSize: 14 }} />
    };
    
    return (
      <Chip 
        label={status}
        color={colors[status as keyof typeof colors] || "default"}
        size="small"
        icon={icons[status as keyof typeof icons]}
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const getTypeChip = (type: string) => {
    const colors = {
      "Khám tổng quát": "#3da9fc",
      "Khám chuyên khoa": "#ef4565",
      "Tái khám": "#90b4ce",
      "Cấp cứu": "#ff6b35"
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

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ tên bệnh nhân"
                value={formData.tenBenhNhan}
                onChange={(e) => setFormData({ ...formData, tenBenhNhan: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CCCD/CMND"
                value={formData.cccd}
                onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày sinh"
                type="date"
                value={formData.ngaySinh}
                onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={formData.gioiTinh}
                  label="Giới tính"
                  onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={formData.soDienThoai}
                onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={formData.diaChi}
                onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                multiline
                rows={2}
                required
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Loại khám</InputLabel>
                <Select
                  value={formData.loaiKham}
                  label="Loại khám"
                  onChange={(e) => setFormData({ ...formData, loaiKham: e.target.value })}
                >
                  <MenuItem value="Khám tổng quát">Khám tổng quát</MenuItem>
                  <MenuItem value="Khám chuyên khoa">Khám chuyên khoa</MenuItem>
                  <MenuItem value="Tái khám">Tái khám</MenuItem>
                  <MenuItem value="Cấp cứu">Cấp cứu</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Khoa khám"
                value={formData.khoaKham}
                onChange={(e) => setFormData({ ...formData, khoaKham: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bác sĩ khám"
                value={formData.bacSiKham}
                onChange={(e) => setFormData({ ...formData, bacSiKham: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Triệu chứng"
                value={formData.trieuChung}
                onChange={(e) => setFormData({ ...formData, trieuChung: e.target.value })}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tiền sử bệnh"
                value={formData.tienSuBenh}
                onChange={(e) => setFormData({ ...formData, tienSuBenh: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dị ứng"
                value={formData.diUng}
                onChange={(e) => setFormData({ ...formData, diUng: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                value={formData.ghiChu}
                onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
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
              Xác nhận thông tin phiếu khám bệnh
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, bgcolor: "#f8f9fa" }}>
                  <Typography variant="subtitle1" sx={{ color: "#094067", fontWeight: 600, mb: 2 }}>
                    Thông tin bệnh nhân
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography><strong>Họ tên:</strong> {formData.tenBenhNhan}</Typography>
                    <Typography><strong>CCCD:</strong> {formData.cccd}</Typography>
                    <Typography><strong>Ngày sinh:</strong> {formData.ngaySinh ? new Date(formData.ngaySinh).toLocaleDateString('vi-VN') : ""}</Typography>
                    <Typography><strong>Giới tính:</strong> {formData.gioiTinh}</Typography>
                    <Typography><strong>SĐT:</strong> {formData.soDienThoai}</Typography>
                    <Typography><strong>Địa chỉ:</strong> {formData.diaChi}</Typography>
                  </Box>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, bgcolor: "#f8f9fa" }}>
                  <Typography variant="subtitle1" sx={{ color: "#094067", fontWeight: 600, mb: 2 }}>
                    Thông tin khám bệnh
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography><strong>Loại khám:</strong> {getTypeChip(formData.loaiKham)}</Typography>
                    <Typography><strong>Khoa:</strong> {formData.khoaKham}</Typography>
                    <Typography><strong>Bác sĩ:</strong> {formData.bacSiKham || "Chưa chỉ định"}</Typography>
                    <Typography><strong>Triệu chứng:</strong> {formData.trieuChung}</Typography>
                    <Typography><strong>Tiền sử bệnh:</strong> {formData.tienSuBenh || "Không"}</Typography>
                    <Typography><strong>Dị ứng:</strong> {formData.diUng || "Không"}</Typography>
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Tiếp nhận bệnh nhân
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Lập phiếu khám bệnh và quản lý tiếp nhận
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
                    {receptionStats.phieuHomNay}
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
                <Pending sx={{ fontSize: 40, color: "#ef4565" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {receptionStats.phieuChoKham}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Chờ khám
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
                    {receptionStats.phieuHoanThanh}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Hoàn thành
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
                <Person sx={{ fontSize: 40, color: "#90b4ce" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {receptionStats.benhNhanMoi}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Bệnh nhân mới
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
                placeholder="Tìm kiếm phiếu, bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: "#5f6c7b", mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="Chờ khám">Chờ khám</MenuItem>
                  <MenuItem value="Đang khám">Đang khám</MenuItem>
                  <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                  <MenuItem value="Hủy">Hủy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Loại khám</InputLabel>
                <Select
                  value={typeFilter}
                  label="Loại khám"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="Khám tổng quát">Khám tổng quát</MenuItem>
                  <MenuItem value="Khám chuyên khoa">Khám chuyên khoa</MenuItem>
                  <MenuItem value="Tái khám">Tái khám</MenuItem>
                  <MenuItem value="Cấp cứu">Cấp cứu</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Thời gian</InputLabel>
                <Select
                  value={dateFilter}
                  label="Thời gian"
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="today">Hôm nay</MenuItem>
                  <MenuItem value="week">Tuần này</MenuItem>
                  <MenuItem value="month">Tháng này</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={handleCreateForm}
                sx={{
                  bgcolor: "#3da9fc",
                  "&:hover": { bgcolor: "#2b8fd1" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                Lập phiếu khám bệnh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Medical Forms Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Mã phiếu</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Loại khám</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Khoa/Bác sĩ</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Triệu chứng</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thứ tự</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredForms
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((form) => (
                <TableRow key={form.ID} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                      {form.MaPhieu}
                    </Typography>
                    <Typography variant="body2" color="#5f6c7b">
                      {new Date(form.NgayTaoPhieu).toLocaleDateString('vi-VN')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: "#3da9fc", width: 32, height: 32 }}>
                        {form.TenBenhNhan.split(' ').slice(-1)[0][0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ color: "#094067", fontWeight: 600 }}>
                          {form.TenBenhNhan}
                        </Typography>
                        <Typography variant="body2" color="#5f6c7b">
                          {form.SoDienThoai}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{getTypeChip(form.LoaiKham)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {form.KhoaKham}
                    </Typography>
                    <Typography variant="body2" color="#5f6c7b">
                      {form.BacSiKham || "Chưa chỉ định"}
                    </Typography>
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
                      {form.TrieuChung}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`STT ${form.ThuTu}`}
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>{getStatusChip(form.TrangThai)}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewForm(form)}
                        sx={{ color: "#3da9fc" }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handlePrintForm(form)}
                        sx={{ color: "#28a745" }}
                      >
                        <Print />
                      </IconButton>
                      {form.TrangThai === "Chờ khám" && (
                        <IconButton
                          size="small"
                          sx={{ color: "#90b4ce" }}
                        >
                          <Edit />
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
          count={filteredForms.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Create Medical Form Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Lập phiếu khám bệnh
        </DialogTitle>
        <DialogContent dividers>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {renderStepContent(activeStep)}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenCreateDialog(false)} color="inherit">
            Hủy
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Quay lại
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmitForm}
              sx={{
                bgcolor: "#3da9fc",
                "&:hover": { bgcolor: "#2b8fd1" }
              }}
            >
              Tạo phiếu khám
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
        </DialogActions>
      </Dialog>

      {/* View Medical Form Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Chi tiết phiếu khám - {selectedForm?.MaPhieu}
        </DialogTitle>
        <DialogContent dividers>
          {selectedForm && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                  Thông tin bệnh nhân
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography><strong>Họ tên:</strong> {selectedForm.TenBenhNhan}</Typography>
                  <Typography><strong>CCCD:</strong> {selectedForm.CCCD}</Typography>
                  <Typography><strong>Ngày sinh:</strong> {new Date(selectedForm.NgaySinh).toLocaleDateString('vi-VN')}</Typography>
                  <Typography><strong>Giới tính:</strong> {selectedForm.GioiTinh}</Typography>
                  <Typography><strong>SĐT:</strong> {selectedForm.SoDienThoai}</Typography>
                  <Typography><strong>Địa chỉ:</strong> {selectedForm.DiaChi}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                  Thông tin khám bệnh
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography><strong>Mã phiếu:</strong> {selectedForm.MaPhieu}</Typography>
                  <Typography><strong>Ngày tạo:</strong> {new Date(selectedForm.NgayTaoPhieu).toLocaleDateString('vi-VN')}</Typography>
                  <Typography><strong>Loại khám:</strong> {getTypeChip(selectedForm.LoaiKham)}</Typography>
                  <Typography><strong>Khoa:</strong> {selectedForm.KhoaKham}</Typography>
                  <Typography><strong>Bác sĩ:</strong> {selectedForm.BacSiKham || "Chưa chỉ định"}</Typography>
                  <Typography><strong>Thứ tự:</strong> {selectedForm.ThuTu}</Typography>
                  <Typography><strong>Trạng thái:</strong> {getStatusChip(selectedForm.TrangThai)}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                  Thông tin y tế
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Triệu chứng:
                    </Typography>
                    <Typography variant="body2" color="#5f6c7b">
                      {selectedForm.TrieuChung}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Tiền sử bệnh:
                    </Typography>
                    <Typography variant="body2" color="#5f6c7b">
                      {selectedForm.TienSuBenh || "Không có"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Dị ứng:
                    </Typography>
                    <Typography variant="body2" color="#5f6c7b">
                      {selectedForm.DiUng || "Không có"}
                    </Typography>
                  </Grid>
                  {selectedForm.GhiChu && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Ghi chú:
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        {selectedForm.GhiChu}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenViewDialog(false)} color="inherit">
            Đóng
          </Button>
          <Button
            variant="contained"
            startIcon={<Print />}
            onClick={() => selectedForm && handlePrintForm(selectedForm)}
            sx={{
              bgcolor: "#28a745",
              "&:hover": { bgcolor: "#1e7e34" }
            }}
          >
            In phiếu
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

export default ReceptionMedicalForms;
