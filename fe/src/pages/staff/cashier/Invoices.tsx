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
  Divider
} from "@mui/material";
import {
  AttachMoney,
  Receipt,
  Payment,
  Search,
  Visibility,
  Print,
  CheckCircle,
  Pending,
  Cancel,
  CreditCard,
  AccountBalance,
  LocalAtm
} from "@mui/icons-material";

interface Invoice {
  ID: number;
  MaHoaDon: string;
  BenhNhanID: number;
  TenBenhNhan: string;
  NgayTao: string;
  TongTien: number;
  DaThanhToan: number;
  ConLai: number;
  TrangThai: 'Chờ thanh toán' | 'Đã thanh toán' | 'Hủy';
  PhuongThucThanhToan?: string;
  NgayThanhToan?: string;
  GhiChu?: string;
  ChiTiet: InvoiceDetail[];
}

interface InvoiceDetail {
  ID: number;
  TenDichVu: string;
  SoLuong: number;
  DonGia: number;
  ThanhTien: number;
}

interface PaymentStats {
  tongDoanhThu: number;
  doanhThuHumNay: number;
  soHoaDonChoThanhToan: number;
  soHoaDonDaThanhToan: number;
}

const CashierInvoices: FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats>({
    tongDoanhThu: 0,
    doanhThuHumNay: 0,
    soHoaDonChoThanhToan: 0,
    soHoaDonDaThanhToan: 0
  });
  
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("today");
  
  // Payment form
  const [paymentData, setPaymentData] = useState({
    phuongThucThanhToan: "Tiền mặt",
    soTienThanhToan: 0,
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

  useEffect(() => {
    loadInvoices();
    loadPaymentStats();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchTerm, statusFilter, dateFilter]);

  const loadInvoices = async () => {
    try {
      console.log("Loading invoices for cashier...");
      // TODO: Call API GET /api/cashier/invoices
      // Headers: Authorization: Bearer {access_token}
      // Response: Invoice[] list of invoices
      
      // Mock data
      const mockInvoices: Invoice[] = [
        {
          ID: 1,
          MaHoaDon: "HD001",
          BenhNhanID: 1001,
          TenBenhNhan: "Nguyễn Văn An",
          NgayTao: "2025-07-29",
          TongTien: 500000,
          DaThanhToan: 0,
          ConLai: 500000,
          TrangThai: "Chờ thanh toán",
          ChiTiet: [
            { ID: 1, TenDichVu: "Khám tổng quát", SoLuong: 1, DonGia: 300000, ThanhTien: 300000 },
            { ID: 2, TenDichVu: "Xét nghiệm máu", SoLuong: 1, DonGia: 200000, ThanhTien: 200000 }
          ]
        },
        {
          ID: 2,
          MaHoaDon: "HD002",
          BenhNhanID: 1002,
          TenBenhNhan: "Trần Thị Bình",
          NgayTao: "2025-07-29",
          TongTien: 800000,
          DaThanhToan: 800000,
          ConLai: 0,
          TrangThai: "Đã thanh toán",
          PhuongThucThanhToan: "Chuyển khoản",
          NgayThanhToan: "2025-07-29",
          ChiTiet: [
            { ID: 3, TenDichVu: "Phẫu thuật nhỏ", SoLuong: 1, DonGia: 800000, ThanhTien: 800000 }
          ]
        }
      ];
      
      setInvoices(mockInvoices);
    } catch (error) {
      console.error("Error loading invoices:", error);
      showNotification("Lỗi khi tải danh sách hóa đơn", "error");
    }
  };

  const loadPaymentStats = async () => {
    try {
      console.log("Loading payment statistics...");
      // TODO: Call API GET /api/cashier/stats
      // Headers: Authorization: Bearer {access_token}
      
      const mockStats: PaymentStats = {
        tongDoanhThu: 15000000,
        doanhThuHumNay: 2300000,
        soHoaDonChoThanhToan: 5,
        soHoaDonDaThanhToan: 12
      };
      
      setPaymentStats(mockStats);
    } catch (error) {
      console.error("Error loading payment stats:", error);
    }
  };

  const filterInvoices = () => {
    let filtered = invoices;
    
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.MaHoaDon.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.TenBenhNhan.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(invoice => invoice.TrangThai === statusFilter);
    }
    
    if (dateFilter === "today") {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(invoice => invoice.NgayTao === today);
    }
    
    setFilteredInvoices(filtered);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setOpenViewDialog(true);
  };

  const handleOpenPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentData({
      phuongThucThanhToan: "Tiền mặt",
      soTienThanhToan: invoice.ConLai,
      ghiChu: ""
    });
    setOpenPaymentDialog(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedInvoice) return;
    
    try {
      console.log("Processing payment for invoice:", selectedInvoice.MaHoaDon, paymentData);
      // TODO: Call API POST /api/cashier/invoices/{id}/payment
      // Headers: Authorization: Bearer {access_token}
      // Body: paymentData
      
      showNotification("Thanh toán thành công", "success");
      setOpenPaymentDialog(false);
      setSelectedInvoice(null);
      loadInvoices();
      loadPaymentStats();
    } catch (error) {
      console.error("Error processing payment:", error);
      showNotification("Lỗi khi xử lý thanh toán", "error");
    }
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    console.log("Printing invoice:", invoice.MaHoaDon);
    // TODO: Generate and print invoice
    showNotification("Đang in hóa đơn...", "info");
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
      "Chờ thanh toán": "warning",
      "Đã thanh toán": "success",
      "Hủy": "error"
    } as const;
    
    const icons = {
      "Chờ thanh toán": <Pending sx={{ fontSize: 14 }} />,
      "Đã thanh toán": <CheckCircle sx={{ fontSize: 14 }} />,
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

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Tiền mặt": return <LocalAtm sx={{ fontSize: 20, color: "#28a745" }} />;
      case "Chuyển khoản": return <AccountBalance sx={{ fontSize: 20, color: "#3da9fc" }} />;
      case "Thẻ tín dụng": return <CreditCard sx={{ fontSize: 20, color: "#ef4565" }} />;
      default: return <Payment sx={{ fontSize: 20, color: "#5f6c7b" }} />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Quản lý Thu ngân
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Xử lý thanh toán và quản lý hóa đơn bệnh viện
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #28a745" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AttachMoney sx={{ fontSize: 40, color: "#28a745" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {(paymentStats.tongDoanhThu / 1000000).toFixed(1)}M
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng doanh thu (VNĐ)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #3da9fc" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Receipt sx={{ fontSize: 40, color: "#3da9fc" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {(paymentStats.doanhThuHumNay / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Doanh thu hôm nay (VNĐ)
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
                    {paymentStats.soHoaDonChoThanhToan}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Chờ thanh toán
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
                <CheckCircle sx={{ fontSize: 40, color: "#90b4ce" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {paymentStats.soHoaDonDaThanhToan}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Đã thanh toán
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)", mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm hóa đơn, tên bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: "#5f6c7b", mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="Chờ thanh toán">Chờ thanh toán</MenuItem>
                  <MenuItem value="Đã thanh toán">Đã thanh toán</MenuItem>
                  <MenuItem value="Hủy">Hủy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
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
          </Grid>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Mã hóa đơn</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ngày tạo</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Tổng tiền</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Còn lại</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((invoice) => (
                <TableRow key={invoice.ID} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                      {invoice.MaHoaDon}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: "#3da9fc", width: 32, height: 32 }}>
                        {invoice.TenBenhNhan.split(' ').slice(-1)[0][0]}
                      </Avatar>
                      <Typography variant="body2" color="#5f6c7b">
                        {invoice.TenBenhNhan}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {new Date(invoice.NgayTao).toLocaleDateString('vi-VN')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {invoice.TongTien.toLocaleString('vi-VN')}đ
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: invoice.ConLai > 0 ? "#ef4565" : "#28a745",
                        fontWeight: 600 
                      }}
                    >
                      {invoice.ConLai.toLocaleString('vi-VN')}đ
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(invoice.TrangThai)}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewInvoice(invoice)}
                        sx={{ color: "#3da9fc" }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handlePrintInvoice(invoice)}
                        sx={{ color: "#28a745" }}
                      >
                        <Print />
                      </IconButton>
                      {invoice.TrangThai === "Chờ thanh toán" && (
                        <IconButton
                          size="small"
                          onClick={() => handleOpenPayment(invoice)}
                          sx={{ color: "#ef4565" }}
                        >
                          <Payment />
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
          count={filteredInvoices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* View Invoice Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Chi tiết hóa đơn - {selectedInvoice?.MaHoaDon}
        </DialogTitle>
        <DialogContent dividers>
          {selectedInvoice && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                  Thông tin hóa đơn
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography><strong>Mã hóa đơn:</strong> {selectedInvoice.MaHoaDon}</Typography>
                  <Typography><strong>Bệnh nhân:</strong> {selectedInvoice.TenBenhNhan}</Typography>
                  <Typography><strong>Ngày tạo:</strong> {new Date(selectedInvoice.NgayTao).toLocaleDateString('vi-VN')}</Typography>
                  <Typography><strong>Tổng tiền:</strong> {selectedInvoice.TongTien.toLocaleString('vi-VN')}đ</Typography>
                  <Typography><strong>Đã thanh toán:</strong> {selectedInvoice.DaThanhToan.toLocaleString('vi-VN')}đ</Typography>
                  <Typography><strong>Còn lại:</strong> {selectedInvoice.ConLai.toLocaleString('vi-VN')}đ</Typography>
                  <Typography><strong>Trạng thái:</strong> {getStatusChip(selectedInvoice.TrangThai)}</Typography>
                </Box>
              </Grid>
              
              {selectedInvoice.TrangThai === "Đã thanh toán" && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                    Thông tin thanh toán
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <strong>Phương thức:</strong>
                      {getPaymentMethodIcon(selectedInvoice.PhuongThucThanhToan || "")}
                      <Typography>{selectedInvoice.PhuongThucThanhToan}</Typography>
                    </Box>
                    <Typography><strong>Ngày thanh toán:</strong> {selectedInvoice.NgayThanhToan ? new Date(selectedInvoice.NgayThanhToan).toLocaleDateString('vi-VN') : ""}</Typography>
                    {selectedInvoice.GhiChu && (
                      <Typography><strong>Ghi chú:</strong> {selectedInvoice.GhiChu}</Typography>
                    )}
                  </Box>
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                  Chi tiết dịch vụ
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Dịch vụ</TableCell>
                        <TableCell align="center">Số lượng</TableCell>
                        <TableCell align="right">Đơn giá</TableCell>
                        <TableCell align="right">Thành tiền</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedInvoice.ChiTiet.map((detail) => (
                        <TableRow key={detail.ID}>
                          <TableCell>{detail.TenDichVu}</TableCell>
                          <TableCell align="center">{detail.SoLuong}</TableCell>
                          <TableCell align="right">{detail.DonGia.toLocaleString('vi-VN')}đ</TableCell>
                          <TableCell align="right">{detail.ThanhTien.toLocaleString('vi-VN')}đ</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
            onClick={() => selectedInvoice && handlePrintInvoice(selectedInvoice)}
            sx={{
              bgcolor: "#28a745",
              "&:hover": { bgcolor: "#1e7e34" }
            }}
          >
            In hóa đơn
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Xử lý thanh toán - {selectedInvoice?.MaHoaDon}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: "#ef4565", mb: 2 }}>
                Số tiền cần thanh toán: {selectedInvoice?.ConLai.toLocaleString('vi-VN')}đ
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phương thức thanh toán</InputLabel>
                <Select
                  value={paymentData.phuongThucThanhToan}
                  label="Phương thức thanh toán"
                  onChange={(e) => setPaymentData({ ...paymentData, phuongThucThanhToan: e.target.value })}
                >
                  <MenuItem value="Tiền mặt">
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocalAtm /> Tiền mặt
                    </Box>
                  </MenuItem>
                  <MenuItem value="Chuyển khoản">
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccountBalance /> Chuyển khoản
                    </Box>
                  </MenuItem>
                  <MenuItem value="Thẻ tín dụng">
                    <Box display="flex" alignItems="center" gap={1}>
                      <CreditCard /> Thẻ tín dụng
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số tiền thanh toán"
                type="number"
                value={paymentData.soTienThanhToan}
                onChange={(e) => setPaymentData({ ...paymentData, soTienThanhToan: parseFloat(e.target.value) || 0 })}
                InputProps={{
                  endAdornment: <Typography>VNĐ</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                value={paymentData.ghiChu}
                onChange={(e) => setPaymentData({ ...paymentData, ghiChu: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenPaymentDialog(false)} color="inherit">
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleProcessPayment}
            disabled={paymentData.soTienThanhToan <= 0 || paymentData.soTienThanhToan > (selectedInvoice?.ConLai || 0)}
            sx={{
              bgcolor: "#3da9fc",
              "&:hover": { bgcolor: "#2b8fd1" }
            }}
          >
            Xác nhận thanh toán
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

export default CashierInvoices;
