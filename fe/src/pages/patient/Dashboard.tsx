import { FC, useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { CalendarMonth, Receipt, MedicalServices, Person } from "@mui/icons-material";
import { appointmentAPI } from "../../services/api";

import { authAPI } from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { invoiceAPI } from "../../services/api";

const PatientDashboard: FC = () => {
  // Define the type for upcomingAppointments
  interface Appointment {
    Lich: {
      Ngay: string;
      Buoi: string;
      MaNV: string; // Add MaNV to the structure
    };
    BacSi: string;
    TrangThai: "Pending" | "Accept" | "Done" | "Cancel"; // Add 'Cancel' status
  }

  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  interface Invoice {
    NgayTao: string;
    LoaiHoaDon: string;
    TongTien: number;
    TrangThai: string;
    PhuongThucThanhToan: string;
  }
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [maBN, setMaBN] = useState<string>(""); // Initialize with an empty string
  const [doctorNamesFetched, setDoctorNamesFetched] = useState(false); // Track if doctor names are fetched
  const [totalServices, setTotalServices] = useState<number>(0); // State to store total services
  const [totalPendingInvoices, setTotalPendingInvoices] = useState<number>(0); // State to store total pending invoices

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await authAPI.patientAccount();
        setMaBN(response.data.MaBN);
      } catch (error) {
        toast.error("Error fetching account information");
      }
    };

    fetchAccount();
  }, []);

  useEffect(() => {

    if (!maBN) return;

    const fetchAppointments = async () => {
      try {
        const response = await appointmentAPI.getByPatient(maBN);
        // Chỉ lấy các lịch hẹn có trạng thái 'Accept' và ngày >= hôm nay
        const now = new Date();
        const filteredAppointments = response.data.filter((appointment: Appointment) => {
          return (
            appointment.TrangThai === "Done" &&
            new Date(appointment.Lich.Ngay).getTime() >= now.setHours(0,0,0,0)
          );
        });

        // Sắp xếp lịch hẹn tương lai theo ngày tăng dần

        const sortedAppointments = filteredAppointments.sort((a: Appointment, b: Appointment) => {
          return new Date(a.Lich.Ngay).getTime() - new Date(b.Lich.Ngay).getTime();
        });

        setUpcomingAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [maBN]);


  useEffect(() => {
    if (!maBN) return;

    const fetchTotalServices = async () => {
      try {
        const response = await appointmentAPI.getTotalServicesByPatient(maBN);
        console.log("Total services response:", response.data);

        // Định nghĩa kiểu dữ liệu cho service
        interface Service {
          MaDichVu: string;
        }

        //Lọc các mã dịch vụ trùng lặp và tính tổng số dịch vụ có mã dịch vụ khác null

        const totalServices = response.data.filter((service: Service) => service.MaDichVu !== null && service.MaDichVu !== undefined);
        setTotalServices(totalServices.length); // Count unique service codes
      } catch (error) {
        console.error("Error fetching total services:", error);
      }
    };

    fetchTotalServices();
  }, [maBN]);

  useEffect(() => {
    if (!maBN) return;

    const fetchInvoices = async () => {
      try {
        const response = await invoiceAPI.getByPatient(maBN); // Gọi API để lấy danh sách hóa đơn

        // Sắp xếp hóa đơn theo trạng thái và ngày
        const sortedInvoices = response.data.sort((a: Invoice, b: Invoice) => {
          const statusOrder: { [key in Invoice["TrangThai"]]: number } = { Pending: 1, Done: 2 };
          const statusComparison = statusOrder[a.TrangThai] - statusOrder[b.TrangThai];

          if (statusComparison !== 0) {
            return statusComparison;
          }

          // Nếu trạng thái giống nhau, sắp xếp theo ngày (tương lai đến quá khứ)
          return new Date(b.NgayTao).getTime() - new Date(a.NgayTao).getTime();
        });

        const pendingInvoices = sortedInvoices.filter((invoice: Invoice) => invoice.TrangThai === "Pending");
        console.log("Pending Invoices:", pendingInvoices);
        setTotalPendingInvoices(pendingInvoices.length);
        // Lưu danh sách hóa đơn đã sắp xếp vào state
        setRecentInvoices(sortedInvoices);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, [maBN]);
  const stats = [
    {
      title: "Lịch hẹn sắp tới",
      value: upcomingAppointments.length,
      icon: <CalendarMonth />,
      color: "primary"
    },
    {
      title: "Hóa đơn chờ thanh toán", 
      value: totalPendingInvoices, // Use the fetched total pending invoices
      icon: <Receipt />,
      color: "warning"
    },
    {
      title: "Dịch vụ đã sử dụng",
      value: totalServices, // Use the fetched total services
      icon: <MedicalServices />,
      color: "success"
    }
  ];

  useEffect(() => {
    const fetchDoctorNames = async () => {
      try {
        const updatedAppointments = await Promise.all(
          upcomingAppointments.map(async (appointment) => {
            const response = await appointmentAPI.getDoctor(appointment.Lich.MaNV);

            console.log("Doctor response:", response.data);
            return {
              ...appointment,
              BacSi: response.data.HoTen,
            };
          })
        );
        setUpcomingAppointments(updatedAppointments);
        setDoctorNamesFetched(true); // Mark as fetched
      } catch (error) {
        console.error("Error fetching doctor names:", error);
      }
    };

    if (upcomingAppointments.length > 0 && !doctorNamesFetched) {
      fetchDoctorNames();
    }
  }, [upcomingAppointments, doctorNamesFetched]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Bệnh nhân
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box color={`${stat.color}.main`}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lịch hẹn sắp tới
              </Typography>
              {upcomingAppointments.length === 0 ? (
                <Typography color="textSecondary">
                  Không có lịch hẹn nào
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Ngày</TableCell>
                        <TableCell>Buổi</TableCell>
                        <TableCell>Bác sĩ</TableCell>
                        <TableCell>Trạng thái</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Map through upcomingAppointments */}
                      {upcomingAppointments.map((appointment, index) => (
                        <TableRow key={index}>
                          <TableCell>{format(new Date(appointment.Lich.Ngay), 'dd/MM/yyyy', { locale: vi })}</TableCell>
                          <TableCell>{appointment.Lich.Buoi === 'Sang' ? 'Sáng' : 'Chiều'}</TableCell>
                          <TableCell>{appointment.BacSi}</TableCell>
                          <TableCell>
                            <Chip 
                              label={appointment.TrangThai} 
                              color={
                                appointment.TrangThai === 'Pending' ? 'warning' : 
                                appointment.TrangThai === 'Accept' ? 'success' : 
                                appointment.TrangThai === 'Done' ? 'primary' :
                                appointment.TrangThai === 'Cancel' ? 'error' :
                                'default'
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={() => window.location.href = "/patient/appointments"}
              >
                Xem tất cả lịch hẹn
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Invoices */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hóa đơn gần đây
              </Typography>
              {recentInvoices.length === 0 ? (
                <Typography color="textSecondary">
                  Không có hóa đơn nào
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Ngày</TableCell>
                        <TableCell>Loại</TableCell>
                        <TableCell>Số tiền</TableCell>
                        <TableCell>Trạng thái</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentInvoices.map((invoice, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {invoice.NgayTao ? format(new Date(invoice.NgayTao), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}
                          </TableCell>
                          <TableCell>{invoice.LoaiHoaDon}</TableCell>
                          <TableCell>{invoice.TongTien != null ? invoice.TongTien.toLocaleString() : 'N/A'}₫</TableCell>
                          <TableCell>
                            <Chip 
                              label={invoice.TrangThai} 
                              color={
                                invoice.TrangThai === 'Pending' ? 'warning' : 
                                invoice.TrangThai === 'Done' ? 'success' : 
                                'default'
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={() => window.location.href = "/patient/invoices"}
              >
                Xem tất cả hóa đơn
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDashboard;
