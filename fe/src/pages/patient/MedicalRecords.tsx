import { FC, useState, useEffect } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar
} from "@mui/material";
import {
  Add,
  Search,
  Visibility,
  Edit,
  Download,
  ExpandMore,
  Person,
  MedicalServices,
  LocalHospital,
  Assignment,
  History,
  Print
} from "@mui/icons-material";
import { authAPI, medicalRecordAPI } from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface MedicalRecord {
  MaHSBA: string;
  TrieuChung: string;
  ChanDoan: string;
  NgayKham: Date;
  MaBN: string;
}

interface MedicalVisit {
  ID: number;
  NgayKham: string;
  BacSi: string;
  Khoa: string;
  ChanDoan: string;
  DieuTri: string;
  KetQua: string;
  GhiChu: string;
  ChiPhi: number;
}

const PatientMedicalRecords: FC = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [visitHistory, setVisitHistory] = useState<MedicalVisit[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openNewRecordDialog, setOpenNewRecordDialog] = useState(false);
  // Add MaBN state
  const [MaBN, setMaBN] = useState<string>("");
  const [benhnhan, setBenhNhan] = useState<any>(null);
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await authAPI.patientAccount();
        console.log("Patient account response:", response.data);
        setMaBN(response.data.MaBN); // Lưu mã bệnh nhân vào state
        setBenhNhan(response.data); // Lưu thông tin bệnh nhân vào state
      } catch (error) {
        console.error("Error fetching patient account information:", error);
        toast.error("Lỗi khi tải thông tin tài khoản");
      }
    };
    fetchAccount();
  }, []);
  useEffect(() => {
    const loadMedicalRecords = async () => {
      try {
        const response = await medicalRecordAPI.getByPatient(MaBN);
        setMedicalRecords(response.data);
      } catch (error) {
        if (typeof error === "object" && error !== null && "response" in error) {
          // @ts-ignore
          toast.error(error.response?.data?.message || "Lỗi khi tải hồ sơ bệnh án");
        } else {
          toast.error("Lỗi khi tải hồ sơ bệnh án");
        }
      }
    };
    if (MaBN) {
      loadMedicalRecords();
    }
  }, [MaBN]);

  // Removed filterRecords and related filter logic

  const handleViewRecord = async (record: MedicalRecord) => {
    setSelectedRecord(record);
    // await loadVisitHistory(record.ID);
    setOpenViewDialog(true);
  };


  const handleExportRecord = async () => {
    try {
      toast.info("Đang xuất file hồ sơ...");
      const res = await medicalRecordAPI.exportExcel(MaBN);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ho-so-benh-an-${benhnhan.HoTen}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Xuất file thành công!");
    } catch (error) {
      toast.error("Lỗi khi xuất file hồ sơ!");
    }
  };



  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <ToastContainer />
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Hồ sơ Bệnh án
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Hồ sơ bệnh án của bệnh nhân
        </Typography>
      </Box>

      {/* Nút xuất file tổng */}
      <Box mb={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={<Download />}
          sx={{ bgcolor: "#094067", color: "#fff", fontWeight: 600, borderRadius: 2, textTransform: "none" }}
          onClick={() => handleExportRecord()}
        >
          Xuất file tổng
        </Button>
      </Box>
      <Box mb={2} display="flex" gap={2}>
        <TextField
          label="Từ ngày"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          sx={{ width: 180 }}
        />
        <TextField
          label="Đến ngày"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          sx={{ width: 180 }}
        />
      </Box>
      {/* Medical Records Table: Ngày khám, Triệu chứng, Chẩn đoán, Xem thông tin, Xuất file */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ngày khám</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Triệu chứng</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Chẩn đoán</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(Array.isArray(medicalRecords) ? medicalRecords : [])
                .filter(record => {
                  if (!fromDate && !toDate) return true;
                  const recordDate = dayjs(record.NgayKham);
                  const from = fromDate ? dayjs(fromDate) : null;
                  const to = toDate ? dayjs(toDate) : null;
                  if (from && to) return recordDate.isBetween(from, to, 'day', '[]');
                  if (from) return recordDate.isSameOrAfter(from, 'day');
                  if (to) return recordDate.isSameOrBefore(to, 'day');
                  return true;
                })
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((record) => (
                <TableRow key={record.MaHSBA} hover>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {record.NgayKham ? new Date(record.NgayKham).toLocaleDateString('vi-VN') : ""}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {record.TrieuChung}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {record.ChanDoan}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewRecord(record)}
                      sx={{ textTransform: "none", fontWeight: 600, color: "#3da9fc", borderColor: "#3da9fc" }}
                    >
                      Xem thông tin
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={Array.isArray(medicalRecords) ? medicalRecords.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* View Medical Record Dialog - thêm thông tin bệnh nhân */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Hồ sơ bệnh án chi tiết
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '70vh' }}>
          {selectedRecord && (
            <Grid container spacing={3}>
              {/* Thông tin bệnh nhân */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                      Thông tin bệnh nhân
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      {/* Hiển thị các trường phổ biến nếu có trong benhnhan */}
                      {benhnhan && (
                        <>
                          {benhnhan.HoTen && <Typography><strong>Họ tên:</strong> {benhnhan.HoTen}</Typography>}
                          {benhnhan.CCCD && <Typography><strong>CCCD:</strong> {benhnhan.CCCD}</Typography>}
                          {benhnhan.NgaySinh && <Typography><strong>Ngày sinh:</strong> {new Date(benhnhan.NgaySinh).toLocaleDateString('vi-VN')}</Typography>}
                          {benhnhan.GioiTinh && <Typography><strong>Giới tính:</strong> {benhnhan.GioiTinh}</Typography>}
                          {benhnhan.DiaChi && <Typography><strong>Địa chỉ:</strong> {benhnhan.DiaChi}</Typography>}
                          {benhnhan.SoDienThoai && <Typography><strong>SĐT:</strong> {benhnhan.SoDienThoai}</Typography>}
                        </>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              {/* Thông tin hồ sơ bệnh án */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                      Thông tin hồ sơ bệnh án
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography><strong>Ngày khám:</strong> {selectedRecord.NgayKham ? new Date(selectedRecord.NgayKham).toLocaleDateString('vi-VN') : ""}</Typography>
                      <Typography><strong>Triệu chứng:</strong> {selectedRecord.TrieuChung}</Typography>
                      <Typography><strong>Chẩn đoán:</strong> {selectedRecord.ChanDoan}</Typography>
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
    </Container>
  );
};

export default PatientMedicalRecords;
