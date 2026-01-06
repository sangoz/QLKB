import dayjs from "dayjs";
import { FC, useState, useEffect } from "react";
import { medicalFormAPI, patientAPI, momoAPI } from "../../services/api";
import axiosInstance from "../../utils/axiosCustomize";
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import {
  PersonAdd,
  CalendarMonth,
  Assignment,
  Phone,
  Schedule,
  People,
  Receipt,
  Payment,
  Refresh
} from "@mui/icons-material";
import { toast } from "react-toastify";

const ReceptionDashboard: FC = () => {
  // State cho dialog tạo phiếu khám bệnh
  const [openCreatePhieuDialog, setOpenCreatePhieuDialog] = useState(false);
  // State cho dialog nhập hóa đơn đã thanh toán
  const [openPaidInvoiceDialog, setOpenPaidInvoiceDialog] = useState(false);
  // State cho tra cứu CCCD tạo phiếu
  const [cccdInputCreate, setCccdInputCreate] = useState("");
  // State cho nhập mã hóa đơn đã thanh toán
  const [invoiceIdInput, setInvoiceIdInput] = useState("");
  // State cho tra cứu CCCD liệt kê phiếu
  const [cccdInputList, setCccdInputList] = useState("");
  const [foundPatient, setFoundPatient] = useState<any>(null);
  const [foundInvoice, setFoundInvoice] = useState<any>(null);
  const [donGiaInput, setDonGiaInput] = useState("");
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [creatingPhieu, setCreatingPhieu] = useState(false);
  const [createPhieuError, setCreatePhieuError] = useState("");
  const [invoiceError, setInvoiceError] = useState("");
  // State cho trạng thái phiếu khi tạo mới
  const [phieuStatus, setPhieuStatus] = useState<'Pending' | 'Payed'>('Pending');
  // State cho danh sách phiếu đăng ký gần đây
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);
  // State cho thông tin bệnh nhân theo MaBN
  const [patientsById, setPatientsById] = useState<Record<string, any>>({});

  // Hàm refresh danh sách phiếu
  const refreshRegistrations = async () => {
    try {
      const res = await medicalFormAPI.getAll();
      if (Array.isArray(res?.data)) {
        // Lọc chỉ những phiếu có loại "KhamBenh"
        const khamBenhPhieus = res.data.filter((phieu) => phieu.Loai === "KhamBenh");
        
        // Sắp xếp mới nhất trước
        const sortedPhieus = khamBenhPhieus.reverse();
        
        // Lấy thông tin bệnh nhân cho tất cả phiếu khám bệnh
        const phieusWithPatientInfo = await Promise.all(
          sortedPhieus.map(async (phieu) => {
            if (phieu.MaBN) {
              try {
                const patientRes = await patientAPI.getPatientById(phieu.MaBN);
                if (patientRes?.data) {
                  return {
                    ...phieu,
                    HoTen: patientRes.data.HoTen,
                    CCCD: patientRes.data.CCCD,
                  };
                }
              } catch (e) {
                console.error("Lỗi khi lấy thông tin bệnh nhân:", e);
              }
            }
            return phieu;
          })
        );
        
        setRecentRegistrations(phieusWithPatientInfo);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách phiếu:", err);
      setRecentRegistrations([]);
    }
  };

  // Lấy danh sách phiếu đăng ký khi component mount
  useEffect(() => {
    refreshRegistrations();
  }, []);
  // Hàm tra cứu hóa đơn đã thanh toán online
  const handleSearchPaidInvoice = async () => {
    setLoadingInvoice(true);
    setFoundInvoice(null);
    setInvoiceError("");
    try {
      // Sử dụng API mới để kiểm tra hóa đơn và lịch hẹn
      const result = await axiosInstance.post('/api/v1/lich/check-invoice-appointment', { 
        maHD: invoiceIdInput 
      });

      if (result?.data) {
        const { hoadon, benhnhan, appointments, hasAppointments, todayAppointments, hasTodayAppointment, totalTodayAppointments, currentDate } = result.data;
        
        // Kiểm tra xem hóa đơn có được thanh toán MoMo không
        if (hoadon.PhuongThucThanhToan === 'MoMo' && hoadon.TrangThai === 'Done') {
          setFoundInvoice({
            ...hoadon,
            patient: benhnhan,
            appointments,
            hasAppointments,
            totalAppointments: appointments?.length || 0,
            todayAppointments,
            hasTodayAppointment,
            totalTodayAppointments,
            currentDate
          });
        } else if (hoadon.PhuongThucThanhToan !== 'MoMo') {
          setInvoiceError("Hóa đơn này không được thanh toán qua MoMo");
        } else if (hoadon.TrangThai !== 'Done') {
          setInvoiceError("Hóa đơn này chưa được thanh toán thành công");
        }
      } else {
        setInvoiceError("Không tìm thấy hóa đơn với mã này");
      }
    } catch (err: any) {
      setInvoiceError(err?.message || "Lỗi khi tra cứu hóa đơn");
      console.error("Error checking invoice:", err);
    }
    setLoadingInvoice(false);
  };

  // Hàm tạo phiếu khám từ hóa đơn đã thanh toán
  const handleCreatePhieuFromPaidInvoice = async () => {
    if (!foundInvoice) return;
    
    // Kiểm tra lịch hẹn hôm nay
    if (!foundInvoice.hasTodayAppointment) {
      setInvoiceError("Bệnh nhân cần có lịch hẹn trong ngày hôm nay để được xuất phiếu khám");
      return;
    }
    
    setCreatingPhieu(true);
    setInvoiceError("");
    try {
      await medicalFormAPI.create({
        NgayYeuCau: dayjs().format("YYYY-MM-DD"),
        //nếu đã thanh toán thì đơn giá là 0 đồng
        DonGia: foundInvoice.TrangThai === 'Payed' ? 0 : foundInvoice.TongTien,
        Loai: "KhamBenh",
        MaBN: foundInvoice.MaBN,
        TrangThai: "Payed" // Trạng thái đã thanh toán
      });
      toast.success("Tạo phiếu khám từ hóa đơn đã thanh toán thành công!");
      setOpenPaidInvoiceDialog(false);
      setInvoiceIdInput("");
      setFoundInvoice(null);
      // Refresh danh sách phiếu
      await refreshRegistrations();
    } catch (err) {
      setInvoiceError("Lỗi khi tạo phiếu khám từ hóa đơn");
    }
    setCreatingPhieu(false);
  };
  // Hàm tra cứu bệnh nhân theo CCCD cho tạo phiếu
  const handleSearchPatientByCCCDCreate = async () => {
    setLoadingPatient(true);
    setFoundPatient(null);
    setCreatePhieuError("");
    try {
      const res = await medicalFormAPI.getPatientByCCCD(cccdInputCreate);
      let patient = null;
      if (Array.isArray(res.data)) {
        patient = res.data.find((bn: any) => bn.CCCD === cccdInputCreate);
      } else if (res.data && res.data.CCCD === cccdInputCreate) {
        patient = res.data;
      }
      if (patient) {
        setFoundPatient(patient);
      } else {
        setCreatePhieuError("Không tìm thấy bệnh nhân với CCCD này");
      }
    } catch (err) {
      setCreatePhieuError("Lỗi khi tra cứu bệnh nhân");
    }
    setLoadingPatient(false);
  };

  // Hàm tạo phiếu khám bệnh (chưa thanh toán)
  const handleCreatePhieuKhamBenh = async () => {
    if (!foundPatient) return;
    if (phieuStatus === 'Pending' && !donGiaInput) return;
    setCreatingPhieu(true);
    setCreatePhieuError("");
    try {
      await medicalFormAPI.create({
        NgayYeuCau: dayjs().format("YYYY-MM-DD"),
        DonGia: phieuStatus === 'Payed' ? '0' : donGiaInput,
        Loai: "KhamBenh",
        MaBN: foundPatient.MaBN,
        TrangThai: phieuStatus // Trạng thái do người dùng chọn
      });
      toast.success("Tạo phiếu khám bệnh thành công!");
      setOpenCreatePhieuDialog(false);
      setDonGiaInput("");
      setFoundPatient(null);
      setCccdInputCreate("");
      setPhieuStatus('Pending');
      // Refresh danh sách phiếu
      await refreshRegistrations();
    } catch (err) {
      console.error("Error creating phieu:", err);
      setCreatePhieuError("Lỗi khi tạo phiếu khám bệnh");
    }
    setCreatingPhieu(false);
  };

  // Hàm xuất PDF phiếu
  const handleDownloadPhieuPdf = async (phieuId: string) => {
    try {
      const response = await axiosInstance.get(`/api/v1/phieu/${phieuId}/download-pdf`, {
        responseType: 'blob'
      });
      
      // Tạo blob URL và download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `phieu-${phieuId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Tải xuống phiếu PDF thành công!");
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error("Lỗi khi tải xuống phiếu PDF");
    }
  };


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4} display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
            Dashboard Tiếp nhận
          </Typography>
          <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
            Tra cứu và quản lý các phiếu đăng ký khám bệnh
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<Receipt />}
            onClick={() => setOpenPaidInvoiceDialog(true)}
            sx={{ bgcolor: "#28a745", "&:hover": { bgcolor: "#1e7e34" }, py: 1.5, fontWeight: 600 }}
          >
            Nhập hóa đơn đã thanh toán
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => setOpenCreatePhieuDialog(true)}
            sx={{ bgcolor: "#3da9fc", "&:hover": { bgcolor: "#2c8fd1" }, py: 1.5, fontWeight: 600 }}
          >
            Tạo phiếu khám bệnh
          </Button>
        </Box>

      {/* Dialog nhập hóa đơn đã thanh toán */}
      <Dialog open={openPaidInvoiceDialog} onClose={() => { setOpenPaidInvoiceDialog(false); setFoundInvoice(null); setInvoiceIdInput(""); setInvoiceError(""); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: "#28a745", fontWeight: 600 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Receipt />
            Nhập hóa đơn đã thanh toán online
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <TextField
              label="Nhập mã hóa đơn"
              value={invoiceIdInput}
              onChange={e => setInvoiceIdInput(e.target.value)}
              fullWidth
              disabled={loadingInvoice}
              placeholder="Ví dụ: HD001"
            />
            <Button variant="contained" onClick={handleSearchPaidInvoice} disabled={loadingInvoice || !invoiceIdInput}>
              Tra cứu
            </Button>
          </Box>
          {loadingInvoice && <Typography color="text.secondary">Đang kiểm tra hóa đơn...</Typography>}
          {foundInvoice && (
            <Box mb={2} p={2} sx={{ bgcolor: "#f8f9fa", borderRadius: 2, border: "1px solid #dee2e6" }}>
              <Typography variant="h6" fontWeight={600} color="#28a745" mb={1}>
                ✅ Hóa đơn đã thanh toán online thành công
              </Typography>
              <Typography><strong>Mã hóa đơn:</strong> {foundInvoice.MaHD}</Typography>
              <Typography><strong>Bệnh nhân:</strong> {foundInvoice.patient?.HoTen}</Typography>
              <Typography><strong>CCCD:</strong> {foundInvoice.patient?.CCCD}</Typography>
              <Typography><strong>Tổng tiền:</strong> {Number(foundInvoice.TongTien).toLocaleString()} VND</Typography>
              <Typography><strong>Phương thức:</strong> {foundInvoice.PhuongThucThanhToan}</Typography>
              <Typography><strong>Trạng thái:</strong> {foundInvoice.TrangThai}</Typography>
              
              {/* Thông tin lịch hẹn */}
              <Box mt={2} p={1} sx={{ bgcolor: "#e3f2fd", borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight={600} color="#1976d2" mb={1}>
                  📅 Thông tin lịch hẹn
                </Typography>
                {foundInvoice.hasAppointments ? (
                  <Box>
                    <Typography color="#1976d2">
                      ✅ Bệnh nhân đã có {foundInvoice.totalAppointments} lịch hẹn
                    </Typography>
                    {foundInvoice.appointments?.slice(0, 3).map((appointment: any, idx: number) => (
                      <Typography key={idx} variant="body2" color="text.secondary">
                        • Lịch {appointment.MaLich} - Trạng thái: {appointment.TrangThai}
                      </Typography>
                    ))}
                    {foundInvoice.totalAppointments > 3 && (
                      <Typography variant="body2" color="text.secondary">
                        ... và {foundInvoice.totalAppointments - 3} lịch khác
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography color="#ff9800">
                    ⚠️ Bệnh nhân chưa có lịch hẹn nào
                  </Typography>
                )}
                
                {/* Thông tin lịch hẹn hôm nay */}
                <Box mt={2} p={1} sx={{ 
                  bgcolor: foundInvoice.hasTodayAppointment ? "#e8f5e8" : "#fff3e0", 
                  borderRadius: 1,
                  border: `1px solid ${foundInvoice.hasTodayAppointment ? "#4caf50" : "#ff9800"}`
                }}>
                  <Typography variant="subtitle2" fontWeight={600} mb={1}
                    color={foundInvoice.hasTodayAppointment ? "#2e7d32" : "#f57c00"}>
                    📅 Lịch hẹn hôm nay ({foundInvoice.currentDate})
                  </Typography>
                  {foundInvoice.hasTodayAppointment ? (
                    <Box>
                      <Typography color="#2e7d32" fontWeight={600}>
                        ✅ Có {foundInvoice.totalTodayAppointments} lịch hẹn hôm nay
                      </Typography>
                      {foundInvoice.todayAppointments?.map((appointment: any, idx: number) => (
                        <Typography key={idx} variant="body2" color="text.secondary">
                          • Lịch {appointment.MaLich} - {appointment.lich?.Buoi} - Trạng thái: {appointment.TrangThai}
                        </Typography>
                      ))}
                    </Box>
                  ) : (
                    <Typography color="#f57c00" fontWeight={600}>
                      ⚠️ Không có lịch hẹn nào trong ngày hôm nay
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          )}
          {invoiceError && <Typography color="error" mb={1}>{invoiceError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaidInvoiceDialog(false)} disabled={creatingPhieu}>Hủy</Button>
          <Button 
            variant="contained" 
            onClick={handleCreatePhieuFromPaidInvoice} 
            disabled={!foundInvoice || !foundInvoice.hasTodayAppointment || creatingPhieu}
            sx={{ 
              bgcolor: foundInvoice?.hasTodayAppointment ? "#28a745" : "#6c757d", 
              "&:hover": { bgcolor: foundInvoice?.hasTodayAppointment ? "#1e7e34" : "#5a6268" } 
            }}
            title={!foundInvoice?.hasTodayAppointment ? "Bệnh nhân cần có lịch hẹn trong ngày hôm nay để được xuất phiếu" : ""}
          >
            {creatingPhieu ? "Đang tạo..." : "Xuất phiếu khám"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog tạo phiếu khám bệnh */}
      <Dialog open={openCreatePhieuDialog} onClose={() => { setOpenCreatePhieuDialog(false); setFoundPatient(null); setCccdInputCreate(""); setDonGiaInput(""); setCreatePhieuError(""); setPhieuStatus('Pending'); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: "#3da9fc", fontWeight: 600 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonAdd />
            Tạo phiếu khám bệnh
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <TextField
              label="Nhập CCCD bệnh nhân"
              value={cccdInputCreate}
              onChange={e => setCccdInputCreate(e.target.value)}
              fullWidth
              disabled={loadingPatient}
            />
            <Button variant="contained" onClick={handleSearchPatientByCCCDCreate} disabled={loadingPatient || !cccdInputCreate}>
              Tra cứu
            </Button>
          </Box>
          {loadingPatient && <Typography color="text.secondary">Đang tra cứu...</Typography>}
          {foundPatient && (
            <Box mb={2}>
              <Typography fontWeight={600}>Thông tin bệnh nhân:</Typography>
              <Typography>Họ tên: {foundPatient.HoTen}</Typography>
              <Typography>CCCD: {foundPatient.CCCD}</Typography>
              <Typography>SĐT: {foundPatient.SDT}</Typography>
              <Typography>Địa chỉ: {foundPatient.DiaChi}</Typography>
            </Box>
          )}
          <TextField
            label="Đơn giá khám bệnh"
            value={donGiaInput}
            onChange={e => setDonGiaInput(e.target.value)}
            fullWidth
            type="number"
            sx={{ mb: 2 }}
            disabled={!foundPatient || phieuStatus === 'Payed'}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="phieu-status-label">Trạng thái phiếu</InputLabel>
            <Select
              labelId="phieu-status-label"
              value={phieuStatus}
              label="Trạng thái phiếu"
              onChange={e => setPhieuStatus(e.target.value as 'Pending' | 'Payed')}
              disabled={!foundPatient}
            >
              <MenuItem value="Pending">Chờ thanh toán</MenuItem>
              <MenuItem value="Payed">Đã thanh toán</MenuItem>
            </Select>
          </FormControl>
          {createPhieuError && <Typography color="error" mb={1}>{createPhieuError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreatePhieuDialog(false)} disabled={creatingPhieu}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleCreatePhieuKhamBenh}
            disabled={
              !foundPatient || creatingPhieu || (phieuStatus === 'Pending' && !donGiaInput)
            }
          >
            Tạo phiếu
          </Button>
        </DialogActions>
      </Dialog>
      </Box>

      {/* Tra cứu CCCD cho lọc danh sách phiếu đăng ký khám bệnh */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)", mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              fullWidth
              label="Lọc phiếu theo CCCD bệnh nhân"
              placeholder="Nhập số CCCD để lọc phiếu đăng ký khám bệnh"
              value={cccdInputList}
              onChange={e => setCccdInputList(e.target.value)}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Danh sách phiếu đăng ký khám bệnh gần đây */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.10)", mb: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600 }}>
              Danh sách phiếu đăng ký khám bệnh ({recentRegistrations.length})
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={refreshRegistrations}
              sx={{ minWidth: 120 }}
            >
              Làm mới
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Họ tên BN</TableCell>
                  <TableCell>CCCD</TableCell>
                  <TableCell>Ngày yêu cầu</TableCell>
                  <TableCell>Đơn giá</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentRegistrations.filter(phieu => !cccdInputList || (phieu.CCCD && phieu.CCCD.includes(cccdInputList))).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">Không có dữ liệu</TableCell>
                  </TableRow>
                ) : (
                  recentRegistrations.filter(phieu => !cccdInputList || (phieu.CCCD && phieu.CCCD.includes(cccdInputList))).map((phieu, idx) => (
                    <TableRow key={phieu.MaPhieu || idx}>
                      <TableCell>{phieu.HoTen}</TableCell>
                      <TableCell>{phieu.CCCD}</TableCell>
                      <TableCell>{dayjs(phieu.NgayYeuCau).format("DD/MM/YYYY")}</TableCell>
                      <TableCell>{phieu.DonGia?.toLocaleString() || "-"}</TableCell>
                      <TableCell>
                        <Chip 
                          label={
                            phieu.TrangThai === "Pending" ? "Chờ thanh toán" :
                            phieu.TrangThai === "Payed" ? "Đã thanh toán" :
                            phieu.TrangThai === "Done" ? "Hoàn thành" : 
                            phieu.TrangThai || "-"
                          } 
                          color={
                            phieu.TrangThai === "Pending" ? "warning" : 
                            phieu.TrangThai === "Payed" ? "success" :
                            phieu.TrangThai === "Done" ? "primary" : 
                            "default"
                          } 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDownloadPhieuPdf(phieu.MaPYC)}
                          sx={{ 
                            minWidth: 100,
                            bgcolor: "#f8f9fa",
                            color: "#3da9fc",
                            borderColor: "#3da9fc",
                            "&:hover": { 
                              bgcolor: "#3da9fc", 
                              color: "white" 
                            }
                          }}
                        >
                          Xuất phiếu
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

    </Container>
  );
};

export default ReceptionDashboard;
