import { FC, useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Snackbar,
  Alert
} from "@mui/material";
import {
  AttachMoney,
  Pending,
  CheckCircle,
  Payment,
  AccountBalance
} from "@mui/icons-material";
import { cashierAPI, HoaDon } from "../../utils/api/cashierAPI";

const CashierDashboard: FC = () => {
  const [dailyStats, setDailyStats] = useState({
    totalRevenue: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    cashTransactions: 0,
    cardTransactions: 0
  });
  const [pendingPayments, setPendingPayments] = useState<HoaDon[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<HoaDon[]>([]);
  const [loading, setLoading] = useState(true);
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
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadMonthlyStats(),
        loadPendingPayments(),
        loadRecentTransactions()
      ]);
    } catch (error) {
      console.error("Error loading cashier data:", error);
      showNotification("Lỗi khi tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyStats = async () => {
    try {
      console.log("Loading cashier monthly stats...");
      const hoaDonData = await cashierAPI.getAllHoaDon();
      
      // Calculate this month's stats
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const monthInvoices = hoaDonData.filter(hd => {
        const hdDate = new Date(hd.NgayTao);
        return hdDate >= monthStart && hdDate <= monthEnd;
      });

      const paidInvoices = monthInvoices.filter(hd => hd.TrangThai === 'Done').length;
      const pendingInvoices = monthInvoices.filter(hd => hd.TrangThai === 'Pending').length;
      const totalRevenue = monthInvoices
        .filter(hd => hd.TrangThai === 'Done')
        .reduce((sum, hd) => sum + Number(hd.TongTien), 0);
      
      const cashTransactions = monthInvoices.filter(hd => 
        hd.TrangThai === 'Done' && hd.PhuongThucThanhToan === 'TienMat'
      ).length;
      
      const cardTransactions = monthInvoices.filter(hd => 
        hd.TrangThai === 'Done' && hd.PhuongThucThanhToan !== 'TienMat'
      ).length;

      setDailyStats({
        totalRevenue,
        paidInvoices,
        pendingInvoices,
        cashTransactions,
        cardTransactions
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadPendingPayments = async () => {
    try {
      console.log("Loading all invoices...");
      const hoaDonData = await cashierAPI.getAllHoaDon();
      // Show all invoices instead of just pending ones
      const sortedInvoices = hoaDonData
        .sort((a, b) => new Date(b.NgayTao).getTime() - new Date(a.NgayTao).getTime())
        .slice(0, 20); // Show latest 20 invoices
      setPendingPayments(sortedInvoices);
    } catch (error) {
      console.error("Error loading invoices:", error);
    }
  };

  const loadRecentTransactions = async () => {
    try {
      console.log("Loading recent transactions...");
      const hoaDonData = await cashierAPI.getAllHoaDon();
      const completed = hoaDonData
        .filter(hd => hd.TrangThai === 'Done')
        .sort((a, b) => new Date(b.NgayTao).getTime() - new Date(a.NgayTao).getTime())
        .slice(0, 10);
      setRecentTransactions(completed);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const statsCards = [
    {
      title: "Doanh thu tháng này",
      value: `${dailyStats.totalRevenue.toLocaleString('vi-VN')}đ`,
      icon: <AttachMoney sx={{ fontSize: 40, color: "#28a745" }} />,
      color: "#28a745"
    },
    {
      title: "HĐ đã thanh toán",
      value: dailyStats.paidInvoices,
      icon: <CheckCircle sx={{ fontSize: 40, color: "#3da9fc" }} />,
      color: "#3da9fc"
    },
    {
      title: "HĐ chờ thanh toán",
      value: dailyStats.pendingInvoices,
      icon: <Pending sx={{ fontSize: 40, color: "#ef4565" }} />,
      color: "#ef4565"
    },
    {
      title: "Giao dịch tiền mặt",
      value: dailyStats.cashTransactions,
      icon: <Payment sx={{ fontSize: 40, color: "#90b4ce" }} />,
      color: "#90b4ce"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Dashboard Thu ngân
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Quản lý thanh toán và doanh thu tháng {new Date().getMonth() + 1}/{new Date().getFullYear()} {loading && "(Đang tải...)"}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(9, 64, 103, 0.1)",
              borderLeft: `4px solid ${stat.color}`,
              "&:hover": {
                transform: "translateY(-2px)",
                transition: "transform 0.3s ease"
              }
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  {stat.icon}
                  <Box>
                    <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="#5f6c7b">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Pending Payments */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
                Danh sách hóa đơn
              </Typography>
              
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Mã HĐ</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Số tiền</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ngày tạo</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography color="#5f6c7b">
                            {loading ? "Đang tải..." : "Không có hóa đơn nào"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingPayments.map((invoice: HoaDon) => (
                        <TableRow key={invoice.MaHD} hover>
                          <TableCell>HD{invoice.MaHD}</TableCell>
                          <TableCell>Bệnh nhân #{invoice.MaBN.slice(-6)}</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#094067" }}>
                            {Number(invoice.TongTien).toLocaleString('vi-VN')}đ
                          </TableCell>
                          <TableCell>
                            {new Date(invoice.NgayTao).toLocaleDateString('vi-VN')}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={invoice.TrangThai === 'Pending' ? 'Chờ thanh toán' : 'Đã thanh toán'}
                              size="small"
                              color={invoice.TrangThai === 'Done' ? 'success' : 'warning'}
                              sx={{ fontSize: '0.7rem' }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions & Quick Actions */}
        <Grid item xs={12} lg={5}>
          {/* Quick Payment Methods */}
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)", mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
                Phương thức thanh toán
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      border: "2px solid #28a745", 
                      borderRadius: 2, 
                      textAlign: "center",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "rgba(40, 167, 69, 0.04)" }
                    }}
                  >
                    <Payment sx={{ fontSize: 40, color: "#28a745", mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ color: "#094067" }}>
                      Tiền mặt
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#28a745", fontWeight: 700 }}>
                      {dailyStats.cashTransactions}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      border: "2px solid #3da9fc", 
                      borderRadius: 2, 
                      textAlign: "center",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "rgba(61, 169, 252, 0.04)" }
                    }}
                  >
                    <AccountBalance sx={{ fontSize: 40, color: "#3da9fc", mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ color: "#094067" }}>
                      Thẻ/Chuyển khoản
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#3da9fc", fontWeight: 700 }}>
                      {dailyStats.cardTransactions}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
                Giao dịch gần đây
              </Typography>
              
              <Box>
                {recentTransactions.length === 0 ? (
                  <Typography color="#5f6c7b" align="center" sx={{ py: 2 }}>
                    {loading ? "Đang tải..." : "Chưa có giao dịch nào"}
                  </Typography>
                ) : (
                  recentTransactions.slice(0, 5).map((transaction: HoaDon) => (
                    <Box 
                      key={transaction.MaHD} 
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center"
                      sx={{ 
                        py: 2, 
                        borderBottom: "1px solid #f0f0f0",
                        "&:last-child": { borderBottom: "none" }
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "#094067" }}>
                          HD{transaction.MaHD}
                        </Typography>
                        <Typography variant="body2" color="#5f6c7b">
                          Bệnh nhân #{transaction.MaBN.slice(-6)}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="subtitle2" sx={{ color: "#28a745", fontWeight: 600 }}>
                          +{Number(transaction.TongTien).toLocaleString('vi-VN')}đ
                        </Typography>
                        <Chip 
                          label={transaction.PhuongThucThanhToan === 'TienMat' ? 'Tiền mặt' : transaction.PhuongThucThanhToan}
                          size="small"
                          sx={{ bgcolor: "#f8f9fa", color: "#5f6c7b" }}
                        />
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

export default CashierDashboard;
