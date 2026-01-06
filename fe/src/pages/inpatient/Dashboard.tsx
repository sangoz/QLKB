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
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Snackbar
} from "@mui/material";
import {
  Hotel,
  PersonAdd,
  SwapHoriz,
  CheckCircle,
  Cancel,
  People,
  Bed,
  Edit,
  Visibility,
  LocalHospital
} from "@mui/icons-material";
import { roomAPI, patientAPI } from "../../services/api";

interface RoomOccupancy {
  ID: string;
  MaPhong: string;
  SoPhong: string;
  TenPhong: string;
  LoaiPhong: string;
  SoBNHienTai: number;
  SoBNToiDa: number;
  MaNV: string;
  DanhSachBenhNhan: Patient[];
  TrangThai: 'Sẵn sàng' | 'Đang sử dụng' | 'Bảo trì';
}

interface Patient {
  MaBN: string;
  ID: string;
  HoTen: string;
  NgaySinh: string;
  GioiTinh: string;
  NgayNhapVien: string;
  ChanDoan: string;
  BacSiPhuTrach: string;
  TrangThai: 'Nội trú' | 'Sắp xuất viện' | 'Chờ chuyển phòng';
}

const InpatientManagerDashboard: FC = () => {
  const [rooms, setRooms] = useState<RoomOccupancy[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomOccupancy | null>(null);
  const [openRoomDialog, setOpenRoomDialog] = useState(false);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [targetRoom, setTargetRoom] = useState("");
  
  // Form data for room transfer
  const [transferData, setTransferData] = useState({
    FromRoomID: "",
    ToRoomID: "",
    PatientID: "",
    Reason: "",
    TransferDate: new Date().toISOString().split('T')[0]
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
    loadRoomOccupancy();
  }, []);

  const loadRoomOccupancy = async () => {
    try {
      // Lấy danh sách phòng bệnh
      const roomsResponse = await roomAPI.getAll();
      console.log("Rooms response:", roomsResponse.data);
      
      // Lấy danh sách bệnh nhân cho từng phòng
      const roomsWithPatients = await Promise.all(
        roomsResponse.data.map(async (room: any) => {
          try {
            const patientsResponse = await patientAPI.getPatientsByRoom(room.MaPhong);
            return {
              ...room,
              ID: room.MaPhong, // Sử dụng MaPhong làm ID
              SoPhong: room.MaPhong,
              DanhSachBenhNhan: patientsResponse.data || []
            };
          } catch (error) {
            console.error(`Error loading patients for room ${room.MaPhong}:`, error);
            return {
              ...room,
              ID: room.MaPhong,
              SoPhong: room.MaPhong,
              DanhSachBenhNhan: []
            };
          }
        })
      );
      
      setRooms(roomsWithPatients);
    } catch (error) {
      console.error("Error loading room occupancy:", error);
      showNotification("Lỗi khi tải dữ liệu phòng bệnh", "error");
    }
  };

  const handleViewRoomDetails = async (room: RoomOccupancy) => {
    try {
      // Nếu phòng có bệnh nhân, gọi API để lấy danh sách bệnh nhân thực tế
      if (room.SoBNHienTai > 0) {
        const patientsResponse = await patientAPI.getPatientsByRoom(room.MaPhong);
        setSelectedRoom({
          ...room,
          DanhSachBenhNhan: patientsResponse.data || []
        });
      } else {
        // Nếu phòng trống, chỉ set phòng với danh sách bệnh nhân rỗng
        setSelectedRoom({
          ...room,
          DanhSachBenhNhan: []
        });
      }
      setOpenRoomDialog(true);
    } catch (error) {
      console.error("Error loading patients for room details:", error);
      // Nếu lỗi, vẫn hiển thị dialog nhưng với danh sách trống
      setSelectedRoom({
        ...room,
        DanhSachBenhNhan: []
      });
      setOpenRoomDialog(true);
      showNotification("Lỗi khi tải danh sách bệnh nhân", "error");
    }
  };

  const handleTransferPatient = (patient: Patient, fromRoom: RoomOccupancy) => {
    setSelectedPatient(patient);
    setTransferData({
      FromRoomID: fromRoom?.MaPhong || "",
      ToRoomID: "",
      PatientID: patient?.MaBN || "",
      Reason: "",
      TransferDate: new Date().toISOString().split('T')[0]
    });
    setOpenTransferDialog(true);
  };

  const handleConfirmTransfer = async () => {
    try {
      // Cập nhật thông tin bệnh nhân với mã phòng mới
      await patientAPI.updatePatientInfo(transferData.PatientID, {
        MaPhongBenhId: transferData.ToRoomID
      });

      showNotification("Chuyển phòng thành công", "success");
      setOpenTransferDialog(false);
      loadRoomOccupancy();
    } catch (error) {
      console.error("Error transferring patient:", error);
      showNotification("Lỗi khi chuyển phòng", "error");
    }
  };

  const handleDischargePatient = async (patient: Patient) => {
    try {
      // Cập nhật thông tin bệnh nhân với MaPhong = null để xuất viện
      await patientAPI.updatePatientInfo(patient?.MaBN || "", {
        MaPhongBenhId: null
      });

      showNotification("Xuất viện thành công", "success");
      loadRoomOccupancy();
    } catch (error) {
      console.error("Error discharging patient:", error);
      showNotification("Lỗi khi xuất viện", "error");
    }
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
      "Nội trú": "primary",
      "Sắp xuất viện": "warning",
      "Chờ chuyển phòng": "info"
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

  const getRoomStatusChip = (status: string) => {
    const colors = {
      "Sẵn sàng": "success",
      "Đang sử dụng": "warning",
      "Bảo trì": "error"
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

  const totalRooms = rooms?.length || 0;
  const occupiedRooms = rooms?.filter(room => room.SoBNHienTai > 0).length || 0;
  const totalBeds = rooms?.reduce((sum, room) => sum + room.SoBNToiDa, 0) || 0;
  const occupiedBeds = rooms?.reduce((sum, room) => sum + room.SoBNHienTai, 0) || 0;
  const totalPatients = rooms?.reduce((sum, room) => sum + (room.DanhSachBenhNhan?.length || 0), 0) || 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Quản lý Nội trú
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Quản lý phòng bệnh và bệnh nhân nội trú
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #3da9fc" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Hotel sx={{ fontSize: 40, color: "#3da9fc" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {occupiedRooms}/{totalRooms}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Phòng đang sử dụng
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
                <People sx={{ fontSize: 40, color: "#28a745" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {totalPatients}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Bệnh nhân nội trú
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Rooms Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)", mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
            Danh sách phòng bệnh
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Phòng</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Loại</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms?.map((room) => (
                  <TableRow key={room?.MaPhong || Math.random()} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                        {room.MaPhong}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        {room.TenPhong}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={room.LoaiPhong}
                        size="small"
                        sx={{ 
                          bgcolor: room.LoaiPhong === "VIP" ? "#ef4565" : 
                                   room.LoaiPhong === "Cấp cứu" ? "#ff6b35" : "#3da9fc",
                          color: "#fffffe",
                          fontWeight: 500 
                        }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" color="#5f6c7b">
                        {room.SoBNHienTai}/{room.SoBNToiDa} người
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewRoomDetails(room)}
                        sx={{ color: "#3da9fc" }}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )) || []}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Transfer Patient Dialog */}
      <Dialog open={openTransferDialog} onClose={() => setOpenTransferDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Chuyển phòng - {selectedPatient?.HoTen}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phòng đích</InputLabel>
                <Select
                  value={transferData.ToRoomID}
                  label="Phòng đích"
                  onChange={(e) => setTransferData({ ...transferData, ToRoomID: e.target.value })}
                >
                  {rooms
                    ?.filter(room => room?.MaPhong !== transferData.FromRoomID && room.SoBNHienTai < room.SoBNToiDa)
                    .map((room) => (
                      <MenuItem key={room?.MaPhong || Math.random()} value={room?.MaPhong || ""}>
                        {room.MaPhong} - {room.TenPhong} ({room.SoBNToiDa - room.SoBNHienTai} chỗ trống)
                      </MenuItem>
                    )) || []}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lý do chuyển phòng"
                value={transferData.Reason}
                onChange={(e) => setTransferData({ ...transferData, Reason: e.target.value })}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ngày chuyển"
                type="date"
                value={transferData.TransferDate}
                onChange={(e) => setTransferData({ ...transferData, TransferDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenTransferDialog(false)} color="inherit">
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmTransfer}
            disabled={!transferData.ToRoomID || !transferData.Reason}
            sx={{
              bgcolor: "#3da9fc",
              "&:hover": { bgcolor: "#2b8fd1" }
            }}
          >
            Xác nhận chuyển
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

      {/* Room Details Dialog */}
      <Dialog open={openRoomDialog} onClose={() => setOpenRoomDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Chi tiết phòng {selectedRoom?.MaPhong} - {selectedRoom?.TenPhong}
        </DialogTitle>
        <DialogContent dividers>
          {selectedRoom && (
            <Box>
              <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                Danh sách bệnh nhân ({selectedRoom.DanhSachBenhNhan?.length || 0})
              </Typography>

              {!selectedRoom.DanhSachBenhNhan || selectedRoom.DanhSachBenhNhan.length === 0 ? (
                <Typography color="#5f6c7b" align="center" sx={{ py: 2 }}>
                  Phòng trống
                </Typography>
              ) : (
                <List>
                  {selectedRoom.DanhSachBenhNhan.map((patient) => (
                    <ListItem key={patient?.MaBN || Math.random()} sx={{ border: "1px solid #f0f0f0", borderRadius: 2, mb: 1 }}>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {patient.HoTen}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenRoomDialog(false)} color="inherit">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InpatientManagerDashboard;
