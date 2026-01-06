import { FC, useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem
} from "@mui/material";
import { Payment, Download } from "@mui/icons-material";
import { invoiceAPI, authAPI } from "../../services/api";
import { toast } from "react-toastify";
import { saveAs } from 'file-saver';

const PatientInvoices: FC = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [maBN, setMaBN] = useState<string>("");

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await authAPI.patientAccount();
        setMaBN(response.data.MaBN); // Lưu mã bệnh nhân vào state
      } catch (error) {
        console.error("Error fetching patient account information:", error);
      }
    };

    fetchAccount();
  }, []);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await invoiceAPI.getByPatient(maBN); // Gọi API để lấy danh sách hóa đơn
        console.log("Invoices response:", response.data);
        setInvoices(response.data); // Lưu danh sách hóa đơn vào state
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    if (maBN) {
      fetchInvoices();
    }
  }, [maBN]);

  const handleDownloadInvoice = async (invoiceId: string) => {

    try {
      const response = await invoiceAPI.downloadPDF(invoiceId); // Đảm bảo responseType là 'blob'
      saveAs(response.data, `invoice_${invoiceId}.pdf`);
      toast.success("Tải hóa đơn thành công!");
    } catch (error) {
      const errorMessage = typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message
        : "Có lỗi xảy ra khi tải hóa đơn.";
      toast.error(`Tải hóa đơn thất bại! ${errorMessage}`);
    }
  };

  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "warning";
      case "Done": return "success";
      default: return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Pending": return "Chờ thanh toán";
      case "Done": return "Đã thanh toán";
      default: return status;
    }
  };

  const getInvoiceTypeText = (type: string) => {
    switch (type) {
      case "NhapVien": return "Nhập viện";
      case "XuatVien": return "Xuất viện";
      case "DichVu": return "Dịch vụ";
      case "KhamBenh": return "Khám bệnh";
      case "ToaThuoc": return "Toa thuốc";
      default: return type;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Hóa đơn gần đây
      </Typography>

      {/* Thanh tìm kiếm và lọc */}
      <Box mb={2} display="flex" gap={2}>
        <TextField
          label="Tìm kiếm ngày tạo (dd/mm/yyyy)"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          sx={{ width: 220 }}
        />
        <TextField
          select
          label="Loại hóa đơn"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          size="small"
          sx={{ width: 180 }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="KhamBenh">Khám bệnh</MenuItem>
          <MenuItem value="NhapVien">Nhập viện</MenuItem>
          <MenuItem value="XuatVien">Xuất viện</MenuItem>
          <MenuItem value="DichVu">Dịch vụ</MenuItem>
          <MenuItem value="ToaThuoc">Toa thuốc</MenuItem>
        </TextField>
        <TextField
          select
          label="Phương thức"
          value={methodFilter}
          onChange={e => setMethodFilter(e.target.value)}
          size="small"
          sx={{ width: 150 }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="TienMat">Tiền mặt</MenuItem>
          <MenuItem value="MoMo">MoMo</MenuItem>
        </TextField>
        <TextField
          select
          label="Trạng thái"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          size="small"
          sx={{ width: 150 }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="Pending">Chờ thanh toán</MenuItem>
          <MenuItem value="Done">Đã thanh toán</MenuItem>
        </TextField>
      </Box>
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Loại hóa đơn</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                  <TableCell>Phương thức TT</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Chưa có hóa đơn nào
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.filter((invoice: any) => {
                    const dateStr = new Date(invoice.NgayTao).toLocaleDateString('vi-VN');
                    const matchDate = !searchText || dateStr.includes(searchText);
                    const matchType = typeFilter === 'all' || invoice.LoaiHoaDon === typeFilter;
                    const matchMethod = methodFilter === 'all' || invoice.PhuongThucThanhToan === methodFilter;
                    const matchStatus = statusFilter === 'all' || invoice.TrangThai === statusFilter;
                    return matchDate && matchType && matchMethod && matchStatus;
                  }).map((invoice: any) => (
                    <TableRow key={invoice.MaHD}>
                      <TableCell>
                        {new Date(invoice.NgayTao).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        {getInvoiceTypeText(invoice.LoaiHoaDon)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(invoice.TongTien)}
                      </TableCell>
                      <TableCell>
                        {invoice.PhuongThucThanhToan === "TienMat" ? "Tiền mặt" : "MoMo"}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusText(invoice.TrangThai)} 
                          color={getStatusColor(invoice.TrangThai) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          {invoice.TrangThai === "Done" && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Download />}
                              onClick={() => handleDownloadInvoice(invoice.MaHD)}
                            >
                              Tải xuống
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog thanh toán đã bị loại bỏ theo yêu cầu */}
    </Box>
  );
};

export default PatientInvoices;
