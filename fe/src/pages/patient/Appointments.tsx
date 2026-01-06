import { FC, useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from "@mui/material";
import { Add, Payment } from "@mui/icons-material";
import { toast } from "react-toastify";
import { appointmentAPI, authAPI, momoAPI, invoiceAPI, medicalFormAPI } from "../../services/api";
import "react-toastify/dist/ReactToastify.css";



const PatientAppointments: FC = () => {
  // State cho lịch tháng
  const [calendarMonth, setCalendarMonth] = useState<number>(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [maBN, setMaBN] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [khoaSearch, setKhoaSearch] = useState<string>("");
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [openBooking, setOpenBooking] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState({
  selectedDoctor: "",
  selectedSchedule: "",
  selectedDate: "",
  selectedBuoi: "",
  selectedNameDoctor: "",
  selectedPrice: 0
});
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await authAPI.patientAccount();
        setMaBN(response.data.MaBN);
        console.log("Account Info:", response.data.MaBN);
      } catch (error) {
        toast.error("Error fetching account information");
      }
    };
    fetchAccount();
  }, []);

  // Lấy danh sách bác sĩ khi mở dialog đặt lịch
  useEffect(() => {
    if (!openBooking) return;
    const fetchDoctors = async () => {
      try {
        const response = await appointmentAPI.getAllDoctors();
        const data = Array.isArray(response.data) ? response.data : [];
        // Gán tên khoa và tên nhân viên cho từng appointment
        const doctorWithKhoa = await Promise.all(
          data.map(async (doctor: any) => {
            let khoa = "";
            try {
              const resKhoa = await appointmentAPI.getKhoaByMaNV(doctor.MaNV);
              khoa = resKhoa.data?.TenKhoa || "";
            } catch (err) {
              console.error("Error fetching Khoa:", err);
            }
            return { ...doctor, khoa };
          })
        );
        setDoctors(doctorWithKhoa);
        setFilteredDoctors(doctorWithKhoa);
      } catch (error) {
        toast.error("Không thể lấy danh sách bác sĩ");
      }
    };
    fetchDoctors();
  }, [openBooking]);

  // Lọc bác sĩ theo khoa
  useEffect(() => {
    if (!khoaSearch) {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(doctors.filter((d: any) => d.khoa && d.khoa.toLowerCase().includes(khoaSearch.toLowerCase())));
    }
  }, [khoaSearch, doctors]);
  useEffect(() => {
    if (!maBN) return;
    const fetchAppointments = async () => {
      try {
        const response = await appointmentAPI.getByPatient(maBN);
        console.log("Appointments:", response.data);
        const data = Array.isArray(response.data) ? response.data : [];
        // Gán tên khoa và tên nhân viên cho từng appointment
        const appointmentsWithInfo = await Promise.all(
          data.map(async (appointment: any) => {
            let khoa = "";
            let tenNhanVien = "";
            try {
              const resKhoa = await appointmentAPI.getKhoaByMaNV(appointment.Lich.MaNV);
              khoa = resKhoa.data?.TenKhoa || "";
            } catch (err) {
              console.error("Error fetching Khoa:", err);
            }
            try {
              const resNV = await appointmentAPI.getNhanVienByMaNV(appointment.Lich.MaNV);
              tenNhanVien = resNV.data?.HoTen || "";
            } catch (err) {
              console.error("Error fetching NhanVien:", err);
            }
            return { ...appointment, khoa, tenNhanVien };
          })
        );
        // Sort filtered appointments by date (future to past)
        const sortedAppointments = appointmentsWithInfo.sort((a: any, b: any) => {
          return new Date(a.NgayDat).getTime() - new Date(b.NgayDat).getTime();
        });
        setAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, [maBN]);

  const handleSelectDoctor = (doctorId: string) => {
    // Lấy tên bác sĩ
    const doctor = doctors.find((d: any) => d.MaNV === doctorId);
    setBookingData({
      ...bookingData,
      selectedDoctor: doctorId,
      selectedNameDoctor: doctor ? doctor.HoTen : ""
    });
    // Lấy lịch của bác sĩ
    const fetchSchedules = async () => {
      try {
        const response = await appointmentAPI.getSchedulesByDoctor(doctorId);
        setSchedules(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast.error("Không thể lấy lịch của bác sĩ");
      }
    };
    fetchSchedules();
    setActiveStep(1);
  };

  const handleSelectSchedule = (scheduleId: string) => {
    // Lấy thông tin lịch đã chọn
    const schedule = schedules.find((s: any) => s.MaLich === scheduleId);
    console.log("Selected Schedule:", schedule);
    setBookingData({
      ...bookingData,
      selectedSchedule: scheduleId,
      selectedDate: schedule && schedule.Ngay ? schedule.Ngay.slice(0, 10) : "",
      selectedBuoi: schedule ? schedule.Buoi : "",
      selectedPrice: schedule ? schedule.Gia : 0
    });
    console.log("Selected Schedule:", bookingData);
    setActiveStep(2);
  };

  const handleConfirmBooking = async () => {
    if (!maBN) {
      toast.error("Không tìm thấy mã bệnh nhân.");
      return;
    }

    // Kiểm tra xem đã đặt lịch này chưa
    const existingAppointment = appointments.find(
      (apt: any) => apt.MaLich === bookingData.selectedSchedule
    );
    
    if (existingAppointment) {
      toast.error("Bạn đã đặt lịch khám này rồi. Không thể đặt lại!");
      return;
    }

    try {
      // TODO: Call API POST /api/v1/chitietdatlich
      // Params: { MaLich: string, MaBN: string, NgayDat: DateTime, DonGia: Decimal }
      // Response: success message
      const response = await appointmentAPI.book({
        MaLich: bookingData.selectedSchedule,
        MaBN: maBN,
        NgayDat: bookingData.selectedDate  + "T00:00:00.000Z",
        DonGia: bookingData.selectedPrice,
        TrangThai: "Pending" // Trạng thái ban đầu là Pending
      });
      console.log("Booking confirmed:", bookingData);
      toast.success("Đặt lịch thành công!");
      setOpenBooking(false);
      setActiveStep(0);
      // Reload appointments
      if (maBN) {
        const appointmentsResponse = await appointmentAPI.getByPatient(maBN);
        const data = Array.isArray(appointmentsResponse.data) ? appointmentsResponse.data : [];
        const appointmentsWithInfo = await Promise.all(
          data.map(async (appointment: any) => {
            let khoa = "";
            let tenNhanVien = "";
            try {
              const resKhoa = await appointmentAPI.getKhoaByMaNV(appointment.Lich.MaNV);
              khoa = resKhoa.data?.TenKhoa || "";
            } catch (err) {
              console.error("Error fetching Khoa:", err);
            }
            try {
              const resNV = await appointmentAPI.getNhanVienByMaNV(appointment.Lich.MaNV);
              tenNhanVien = resNV.data?.HoTen || "";
            } catch (err) {
              console.error("Error fetching NhanVien:", err);
            }
            return { ...appointment, khoa, tenNhanVien };
          })
        );
        const sortedAppointments = appointmentsWithInfo.sort((a: any, b: any) => {
          return new Date(a.NgayDat).getTime() - new Date(b.NgayDat).getTime();
        });
        setAppointments(sortedAppointments);
      }
    } catch (err) {
      console.error("Booking failed:", err);
      const errorMessage = typeof err === "object" && err !== null && "message" in err
        ? (err as { message?: string }).message
        : "Có lỗi xảy ra khi đặt lịch.";
      toast.error(errorMessage);
    }
  };

  const handleMoMoPayment = async () => {
    if (!selectedAppointment) return;
    
    setPaymentLoading(true);
    let paymentWindow: Window | null = null;
    let checkPaymentStatus: number | null = null;
    
    try {
      // Tạo payment link MoMo
      const paymentData = {
        amount: selectedAppointment.DonGia,
        orderInfo: `Thanh toan lich kham - Bac si: ${selectedAppointment.tenNhanVien}`,
        extraData: `MaLich=${selectedAppointment.MaLich}&MaBN=${selectedAppointment.MaBN}`,
      };
      
      const response = await momoAPI.createPaymentLink(paymentData);
      
      if (response.data.success && response.data.data.payUrl) {
        // Mở cửa sổ thanh toán MoMo
        paymentWindow = window.open(response.data.data.payUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        
        if (!paymentWindow) {
          toast.error("Popup bị chặn. Vui lòng cho phép popup và thử lại.");
          return;
        }
        
        // Polling để kiểm tra trạng thái thanh toán
        const orderId = response.data.data.orderId;
        toast.info("Đang chờ thanh toán... Vui lòng hoàn tất giao dịch trên cửa sổ MoMo");
        
        checkPaymentStatus = setInterval(async () => {
          try {
            // Kiểm tra xem cửa sổ có bị đóng không
            if (paymentWindow?.closed) {
              clearInterval(checkPaymentStatus!);
              toast.warning("Cửa sổ thanh toán đã đóng. Vui lòng kiểm tra lại trạng thái giao dịch.");
              setPaymentLoading(false);
              return;
            }
            
            const statusResponse = await momoAPI.checkTransactionStatus(orderId);
            const transaction = statusResponse.data.data;
            
            if (transaction.TrangThai === 'Success') {
              clearInterval(checkPaymentStatus!);
              paymentWindow?.close();
              
              // Cập nhật trạng thái appointment thành Done
              try {
                await appointmentAPI.updateAppointmentStatus(
                   selectedAppointment.MaLich,
                      selectedAppointment.MaBN,
                      selectedAppointment.NgayDat,
                      selectedAppointment.DonGia.toString(),
                      'Done'
                );

                toast.success("🎉 Thanh toán thành công! Lịch hẹn đã được xác nhận.");
                setOpenPaymentDialog(false);
                await reloadAppointments();
              } catch (updateError) {
                console.error("Error updating appointment status:", updateError);
                toast.error("Thanh toán thành công nhưng không thể cập nhật trạng thái. Vui lòng liên hệ hỗ trợ.");
              }
              
            } else if (transaction.TrangThai === 'Failed' || transaction.TrangThai === 'Cancelled') {
              clearInterval(checkPaymentStatus!);
              paymentWindow?.close();
              toast.error("❌ Thanh toán thất bại hoặc đã bị hủy.");
              setPaymentLoading(false);
            }
          } catch (error) {
            console.error("Error checking payment status:", error);
            // Không hiển thị lỗi liên tục, chỉ log
          }
        }, 3000); // Kiểm tra mỗi 3 giây
        
        // Dừng polling sau 5 phút (giảm từ 10 phút)
        setTimeout(() => {
          if (checkPaymentStatus) {
            clearInterval(checkPaymentStatus);
            paymentWindow?.close();
            toast.warning("⏰ Timeout thanh toán. Vui lòng thử lại nếu chưa hoàn tất.");
            setPaymentLoading(false);
          }
        }, 300000); // 5 phút
        
      } else {
        toast.error("Không thể tạo link thanh toán MoMo");
        setPaymentLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Lỗi khi tạo thanh toán MoMo");
      setPaymentLoading(false);
    }
  };

  // Helper function để reload appointments
  const reloadAppointments = async () => {
    if (maBN) {
      const appointmentsResponse = await appointmentAPI.getByPatient(maBN);
      const data = Array.isArray(appointmentsResponse.data) ? appointmentsResponse.data : [];
      const appointmentsWithInfo = await Promise.all(
        data.map(async (appointment: any) => {
          let khoa = "";
          let tenNhanVien = "";
          try {
            const resKhoa = await appointmentAPI.getKhoaByMaNV(appointment.Lich.MaNV);
            khoa = resKhoa.data?.TenKhoa || "";
          } catch (err) {
            console.error("Error fetching Khoa:", err);
          }
          try {
            const resNV = await appointmentAPI.getNhanVienByMaNV(appointment.Lich.MaNV);
            tenNhanVien = resNV.data?.HoTen || "";
          } catch (err) {
            console.error("Error fetching NhanVien:", err);
          }
          return { ...appointment, khoa, tenNhanVien };
        })
      );
      const sortedAppointments = appointmentsWithInfo.sort((a: any, b: any) => {
        return new Date(a.NgayDat).getTime() - new Date(b.NgayDat).getTime();
      });
      setAppointments(sortedAppointments);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "warning";
      case "Accept": return "success";
      case "Cancel": return "error";
      case "Done": return "info";
      default: return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Pending": return "Chờ xác nhận";
      case "Accept": return "Cần thanh toán";
      case "Cancel": return "Đã hủy";
      case "Done": return "Đã thanh toán";
      default: return status;
    }
  };

  const steps = ["Chọn bác sĩ", "Chọn lịch khám", "Xác nhận"];
  // ...existing code...

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Lịch hẹn của bạn
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenBooking(true)}
        >
          Đặt lịch mới
        </Button>
      </Box>

      {/* Appointments Table */}
      {/* Thanh tìm kiếm theo tên bác sĩ hoặc ngày khám */}
      <Box mb={2} display="flex" gap={2}>
        <TextField
          label="Tìm kiếm theo bác sĩ hoặc ngày khám"
          variant="outlined"
          size="small"
          value={searchText}
          sx={{ width: 400 }}
          onChange={e => setSearchText(e.target.value)}
          placeholder="Nhập tên bác sĩ hoặc ngày (dd/mm/yyyy)"
        />
        <TextField
          select
          label="Lọc trạng thái"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          size="small"
          sx={{ width: 180 }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="Pending">Chờ xác nhận</MenuItem>
          <MenuItem value="Accept">Cần thanh toán</MenuItem>
          <MenuItem value="Done">Đã thanh toán</MenuItem>
          <MenuItem value="Cancel">Đã hủy</MenuItem>
        </TextField>
      </Box>
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày khám</TableCell>
                  <TableCell>Buổi</TableCell>
                  <TableCell>Bác sĩ</TableCell>
                  <TableCell>Khoa</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(() => {
                  // Lọc theo tên bác sĩ hoặc ngày khám
                  const filtered = appointments.filter((appointment: any) => {
                    const doctorName = appointment.tenNhanVien?.toLowerCase() || "";
                    const dateStr = new Date(appointment.Lich.Ngay).toLocaleDateString("vi-VN");
                    const search = searchText.toLowerCase();
                    const matchSearch = doctorName.includes(search) || dateStr.includes(search);
                    const matchStatus = statusFilter === "all" || appointment.TrangThai === statusFilter;
                    return matchSearch && matchStatus;
                  });
                  if (filtered.length === 0) {
                    return (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          Không có lịch hẹn phù hợp
                        </TableCell>
                      </TableRow>
                    );
                  }
                  return filtered.map((appointment: any) => (
                    <TableRow key={appointment.MaLich + appointment.MaBN}>
                      <TableCell>{new Date(appointment.Lich.Ngay).toLocaleDateString()}</TableCell>
                      <TableCell>{appointment.Lich.Buoi}</TableCell>
                      <TableCell>{appointment.tenNhanVien}</TableCell>
                      <TableCell>{appointment.khoa}</TableCell>
                      <TableCell>{appointment.DonGia}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusText(appointment.TrangThai)}
                          color={getStatusColor(appointment.TrangThai) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {appointment.TrangThai === "Accept" && (
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="success"
                            startIcon={<Payment />}
                            sx={{ 
                              color: '#fff', 
                              bgcolor: '#4caf50', 
                              '&:hover': { bgcolor: '#45a049' },
                              fontWeight: 600
                            }}
                            onClick={() => {
                              console.log("Selected Appointment:", appointment);
                              setSelectedAppointment(appointment);
                              setOpenPaymentDialog(true);
                            }}
                          >
                            Thanh toán MoMo
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ));
                })()}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      {/* Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', color: '#2f32d3', fontWeight: 700 }}>
          Thanh toán qua MoMo
        </DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box display="flex" flexDirection="column" alignItems="center" gap={3} py={2}>
              <Box sx={{
                width: 80,
                height: 80,
                bgcolor: '#e8f5e8',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1
              }}>
                <Payment sx={{ fontSize: 50, color: '#4caf50' }} />
              </Box>
              
              <Typography variant="h5" color="#2f32d3" fontWeight={700} gutterBottom>
                Thông tin thanh toán
              </Typography>
              
              <Card sx={{ width: '100%', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1"><strong>Bác sĩ:</strong> {selectedAppointment.tenNhanVien}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1"><strong>Khoa:</strong> {selectedAppointment.khoa}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Ngày khám:</strong> {new Date(selectedAppointment.Lich.Ngay).toLocaleDateString("vi-VN")}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Buổi:</strong> {selectedAppointment.Lich.Buoi === "Sang" ? "Sáng" : "Chiều"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700, textAlign: 'center', mt: 1 }}>
                      Tổng tiền: {selectedAppointment.DonGia?.toLocaleString('vi-VN')} VNĐ
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
              
              <Box display="flex" alignItems="center" gap={1} sx={{ bgcolor: '#fff3cd', p: 2, borderRadius: 1, width: '100%' }}>
                <Typography variant="body2" color="#856404">
                  💡 Bạn sẽ được chuyển hướng đến trang thanh toán MoMo để hoàn tất giao dịch.
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={1} sx={{ bgcolor: '#d1ecf1', p: 2, borderRadius: 1, width: '100%' }}>
                <Typography variant="body2" color="#0c5460">
                  🧪 <strong>Test Mode:</strong> Hiện tại đang trong chế độ test. <br/>
                  📱 <strong>Test data:</strong> SDT: 0999999999, OTP: 123456 <br/>
                  🔧 Hoặc dùng nút "🧪 Test Success" để mô phỏng thanh toán thành công.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={() => setOpenPaymentDialog(false)}
            variant="outlined"
            sx={{ minWidth: 120 }}
          >
            Hủy
          </Button>
          <Button 
            variant="outlined" 
            color="info"
            onClick={async () => {
              if (window.confirm("Bạn có muốn mô phỏng thanh toán thành công không?")) {
                try {
                  console.log("Updating appointment status:", {
                    MaBN: selectedAppointment.MaBN,
                    MaLich: selectedAppointment.MaLich,
                    TrangThai: 'Done'
                  });

                  // Tạo hóa đơn tự động trước
                  const hoadonData = {
                    NgayTao: new Date().toISOString(),
                    TongTien: selectedAppointment.DonGia,
                    TrangThai: 'Done',
                    LoaiHoaDon: 'KhamBenh',
                    PhuongThucThanhToan: 'MoMo',
                    MaBN: selectedAppointment.MaBN
                  };

                  try {
                    // Gọi API tạo hóa đơn (endpoint không cần nhân viên)
                    const hoadonResponse = await invoiceAPI.createAutoInvoice(hoadonData);
                    console.log("Hóa đơn đã được tạo thành công:", hoadonResponse.data);
                  } catch (hoadonError) {
                    console.error("Lỗi khi tạo hóa đơn:", hoadonError);
                  }

                  // Gọi API cập nhật trạng thái appointment thành Done
                  await appointmentAPI.updateAppointmentStatus(
                      selectedAppointment.MaLich,
                      selectedAppointment.MaBN,
                      selectedAppointment.NgayDat,
                      selectedAppointment.DonGia.toString(),
                      'Done'
                  );

                  toast.success("🎉 Mô phỏng thanh toán thành công! Hóa đơn đã được tạo.");
                  setOpenPaymentDialog(false);
                  await reloadAppointments();
                } catch (error) {
                  console.error("Error updating appointment status:", error);
                  const errorMessage = error instanceof Error ? error.message : "Không thể cập nhật trạng thái";
                  toast.error("Lỗi khi mô phỏng thanh toán: " + errorMessage);
                }
              }
            }}
            sx={{ minWidth: 140 }}
          >
            🧪 Test Success
          </Button>
          <Button 
            variant="contained" 
            color="success"
            startIcon={paymentLoading ? <CircularProgress size={20} color="inherit" /> : <Payment />}
            disabled={!selectedAppointment || paymentLoading}
            onClick={handleMoMoPayment}
            sx={{ 
              minWidth: 180,
              bgcolor: '#4caf50',
              '&:hover': { bgcolor: '#45a049' },
              fontWeight: 600
            }}
          >
            {paymentLoading ? 'Đang xử lý...' : 'Thanh toán MoMo'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Booking Dialog */}
      <Dialog open={openBooking} onClose={() => setOpenBooking(false)} maxWidth="md" fullWidth>
        <DialogTitle>Đặt lịch khám</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step 1: Select Doctor */}
          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  Chọn bác sĩ
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Tìm kiếm theo khoa"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={khoaSearch}
                  onChange={e => setKhoaSearch(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              {filteredDoctors.map((doctor: any) => (
                <Grid item xs={12} md={6} lg={4} key={doctor.MaNV}>
                  <Card 
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      boxShadow: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: '0.2s',
                      '&:hover': { boxShadow: 6, bgcolor: 'action.hover' }
                    }}
                    onClick={() => handleSelectDoctor(doctor.MaNV)}
                  >
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                      <Box sx={{
                        width: 70,
                        height: 70,
                        bgcolor: '#e3f2fd',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1
                      }}>
                        <Add sx={{ fontSize: 40, color: '#2196f3' }} />
                      </Box>
                      <Typography variant="h6" fontWeight={700} color="#2f32d3">
                        {doctor.HoTen}
                      </Typography>
                      {doctor.TrinhDo && (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          Trình độ: {doctor.TrinhDo}
                        </Typography>
                      )}
                      {doctor.khoa && (
                        <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                          Chuyên khoa: {doctor.khoa}
                        </Typography>
                      )}
                      {doctor.SDT && (
                        <Box display="flex" alignItems="center" mt={1}>
                          <span style={{ fontSize: 18, marginRight: 6 }}>📞</span>
                          <Typography variant="body2">{doctor.SDT}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Step 2: Select Schedule */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Chọn ngày khám
              </Typography>
              {/* Lịch tháng dạng lưới */}
              <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Button size="small" onClick={() => {
                    if (calendarMonth === 0) {
                      setCalendarMonth(11);
                      setCalendarYear(calendarYear - 1);
                    } else {
                      setCalendarMonth(calendarMonth - 1);
                    }
                  }}>◀</Button>
                  <Typography variant="h6" color="#03a9f4" mx={2}>
                    THÁNG {String(calendarMonth + 1).padStart(2, '0')}-{calendarYear}
                  </Typography>
                  <Button size="small" onClick={() => {
                    if (calendarMonth === 11) {
                      setCalendarMonth(0);
                      setCalendarYear(calendarYear + 1);
                    } else {
                      setCalendarMonth(calendarMonth + 1);
                    }
                  }}>▶</Button>
                </Box>
                <Box width="100%">
                  <Grid container spacing={0} sx={{ mb: 1 }}>
                    {["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"].map((d, idx) => (
                      <Grid item xs={1.71} key={d}>
                        <Typography align="center" color={idx === 0 ? "error" : idx === 6 ? "#ff9800" : "textSecondary"} fontWeight={600}>{d}</Typography>
                      </Grid>
                    ))}
                  </Grid>
                  {/* Render ngày trong tháng */}
                  <Grid container spacing={0}>
                    {(() => {
                      const days: JSX.Element[] = [];
                      const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
                      const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
                      // Lấy các ngày có lịch
                      const scheduleDates = schedules
                        .filter((s: any) => {
                          const d = new Date(s.Ngay);
                          return d.getMonth() === calendarMonth && d.getFullYear() === calendarYear && d > new Date();
                        })
                        .map((s: any) => s.Ngay.slice(0, 10));
                      let dayNum = 1;
                      for (let i = 0; i < firstDay + daysInMonth; i++) {
                        if (i < firstDay) {
                          days.push(<Grid item xs={1.71} key={"empty-" + i}><Box height={40} /></Grid>);
                        } else {
                          const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                          const isToday = dateStr === new Date().toISOString().slice(0, 10);
                          const isFuture = new Date(dateStr) > new Date();
                          const hasSchedule = scheduleDates.includes(dateStr);
                          days.push(
                            <Grid item xs={1.71} key={dateStr}>
                              <Button
                                fullWidth
                                variant={selectedDate === dateStr ? "contained" : hasSchedule ? "outlined" : "text"}
                                color={isToday ? "error" : hasSchedule ? "primary" : "inherit"}
                                disabled={!hasSchedule || !isFuture}
                                sx={{ height: 40, fontWeight: hasSchedule ? 700 : 400, bgcolor: selectedDate === dateStr ? '#121affff' : undefined }}
                                onClick={() => setSelectedDate(dateStr)}
                              >
                                {String(dayNum).padStart(2, '0')}
                              </Button>
                            </Grid>
                          );
                          dayNum++;
                        }
                      }
                      return days;
                    })()}
                  </Grid>
                </Box>
              </Box>
              {/* Hiển thị các khung giờ của ngày đã chọn */}
              {selectedDate && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Chọn khung giờ
                  </Typography>
                  <Grid container spacing={2}>
                    {schedules
                      .filter((s: any) => s.Ngay.slice(0, 10) === selectedDate)
                      .map((schedule: any) => {
                        // Kiểm tra xem đã đặt lịch này chưa
                        const isAlreadyBooked = appointments.some(
                          (apt: any) => apt.MaLich === schedule.MaLich
                        );
                        
                        return (
                          <Grid item xs={12} md={6} key={schedule.MaLich}>
                            <Card 
                              sx={{ 
                                cursor: isAlreadyBooked ? "not-allowed" : "pointer", 
                                opacity: isAlreadyBooked ? 0.6 : 1,
                                bgcolor: isAlreadyBooked ? "#f5f5f5" : "white",
                                "&:hover": { 
                                  bgcolor: isAlreadyBooked ? "#f5f5f5" : "action.hover" 
                                } 
                              }}
                              onClick={() => {
                                if (!isAlreadyBooked) {
                                  handleSelectSchedule(schedule.MaLich);
                                } else {
                                  toast.warning("Bạn đã đặt lịch khám này rồi!");
                                }
                              }}
                            >
                              <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                  <Typography variant="h6">
                                    Buổi: {schedule.Buoi === "Sang" ? "Sáng" : "Chiều"}
                                  </Typography>
                                  {isAlreadyBooked && (
                                    <Chip 
                                      label="Đã đặt" 
                                      color="secondary" 
                                      size="small"
                                      sx={{ fontWeight: 600 }}
                                    />
                                  )}
                                </Box>
                                <Typography color="textSecondary">
                                  Số bệnh nhân hiện tại: {schedule.SoBNHienTai}
                                </Typography>
                                <Typography color="textSecondary">
                                  Số bệnh nhân tối đa: {schedule.SoBNToiDa}
                                </Typography>
                                <Typography variant="h6" color={isAlreadyBooked ? "textSecondary" : "primary"}>
                                  Giá: {schedule.Gia} VNĐ
                                </Typography>
                                {isAlreadyBooked && (
                                  <Typography variant="body2" color="error" sx={{ mt: 1, fontStyle: "italic" }}>
                                    Bạn đã có lịch hẹn này
                                  </Typography>
                                )}
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                  </Grid>
                </Box>
              )}
            </Box>
          )}

          {/* Step 3: Confirm */}
          {activeStep === 2 && (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={250}>
              <Card sx={{ minWidth: 350, maxWidth: 420, mx: 'auto', p: 3, borderRadius: 4, boxShadow: 6 }}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    bgcolor: '#e3f2fd',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1
                  }}>
                    <span style={{ fontSize: 36, color: '#2196f3' }}>📝</span>
                  </Box>
                  <Typography variant="h5" fontWeight={700} color="#2f32d3" gutterBottom>
                    Xác nhận thông tin đặt lịch
                  </Typography>
                  
                  {/* Thông báo cảnh báo */}
                  <Box sx={{ 
                    width: '100%', 
                    bgcolor: '#fff3cd', 
                    border: '1px solid #ffeaa7', 
                    borderRadius: 1, 
                    p: 2, 
                    mb: 2 
                  }}>
                    <Typography variant="body2" color="#856404" sx={{ fontWeight: 500 }}>
                      ⚠️ <strong>Lưu ý:</strong> Mỗi lịch khám chỉ có thể đặt một lần. Sau khi xác nhận, bạn không thể đặt lại lịch này.
                    </Typography>
                  </Box>
                  
                  <Box width="100%" mt={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" align="center"><strong>Bác sĩ:</strong> {bookingData.selectedNameDoctor}</Typography>
                        <Typography variant="subtitle1" align="center"><strong>Ngày khám:</strong> {bookingData.selectedDate}</Typography>
                        <Typography variant="subtitle1" align="center"><strong>Buổi:</strong> {bookingData.selectedBuoi === "Sang" ? "Sáng" : "Chiều"}</Typography>
                        <Typography variant="subtitle1" align="center"><strong>Giá:</strong> <span style={{ color: '#1976d2', fontWeight: 700 }}>{bookingData.selectedPrice} VNĐ</span></Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            if (activeStep === 0) setOpenBooking(false);
            else setActiveStep(activeStep - 1);
          }}>
            {activeStep === 0 ? 'Hủy' : 'Quay lại'}
          </Button>
          {activeStep < 2 && (
            <Button 
              variant="contained" 
              onClick={() => setActiveStep(activeStep + 1)}
              disabled={
                (activeStep === 0 && !bookingData.selectedDoctor) ||
                (activeStep === 1 && (!selectedDate || !bookingData.selectedSchedule))
              }
            >
              Tiếp theo
            </Button>
          )}
          {activeStep === 2 && (
            <Button variant="contained" onClick={handleConfirmBooking}>
              Xác nhận đặt lịch
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientAppointments;
