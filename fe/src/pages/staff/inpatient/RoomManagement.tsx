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
  LinearProgress
} from "@mui/material";
import {
  Hotel,
  PersonAdd,
  PersonRemove,
  Search,
  Edit,
  Visibility,
  CheckCircle,
  Cancel,
  Pending,
  MedicalServices,
  Business,
  Assignment
} from "@mui/icons-material";

interface RoomAssignment {
  ID: number;
  PhongID: number;
  SoPhong: string;
  TenPhong: string;
  LoaiPhong: string;
  BenhNhanID?: number;
  TenBenhNhan?: string;
  NgayNhapVien?: string;
  NgayDuKienXuatVien?: string;
  TrangThai: 'Trống' | 'Đã có bệnh nhân' | 'Chuẩn bị xuất viện' | 'Bảo trì';
  SoGiuongTong: number;
  SoGiuongTrong: number;
  GiaPhong: number;
  KhoaID: number;
  TenKhoa: string;
  GhiChu?: string;
}

interface InpatientStats {
  tongPhong: number;
  phongDangSuDung: number;
  phongTrong: number;
  benhNhanNoiTru: number;
}

const InpatientRoomManagement: FC = () => {
  const [roomAssignments, setRoomAssignments] = useState<RoomAssignment[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomAssignment[]>([]);
  const [inpatientStats, setInpatientStats] = useState<InpatientStats>({
    tongPhong: 0,
    phongDangSuDung: 0,
    phongTrong: 0,
    benhNhanNoiTru: 0
  });
  
  const [selectedRoom, setSelectedRoom] = useState<RoomAssignment | null>(null);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openDischargeDialog, setOpenDischargeDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  
  // Assignment form
  const [assignmentData, setAssignmentData] = useState({
    benhNhanId: "",
    tenBenhNhan: "",
    ngayNhapVien: new Date().toISOString().split('T')[0],
    ngayDuKienXuatVien: "",
    ghiChu: ""
  });
  
  // Discharge form
  const [dischargeData, setDischargeData] = useState({
    ngayXuatVien: new Date().toISOString().split('T')[0],
    lyDoXuatVien: "",
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
    loadRoomAssignments();
    loadInpatientStats();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [roomAssignments, searchTerm, statusFilter, roomTypeFilter, departmentFilter]);

  const loadRoomAssignments = async () => {
    try {
      console.log("Loading room assignments...");
      // TODO: Call API GET /api/inpatient/rooms
      // Headers: Authorization: Bearer {access_token}
      // Response: RoomAssignment[] list of room assignments
      
      // Mock data
      const mockRooms: RoomAssignment[] = [
        {
          ID: 1,
          PhongID: 101,
          SoPhong: "101",
          TenPhong: "Phòng nội tổng quát 1",
          LoaiPhong: "Thường",
          BenhNhanID: 1001,
          TenBenhNhan: "Nguyễn Văn An",
          NgayNhapVien: "2025-07-25",
          NgayDuKienXuatVien: "2025-08-05",
          TrangThai: "Đã có bệnh nhân",
          SoGiuongTong: 4,
          SoGiuongTrong: 3,
          GiaPhong: 200000,
          KhoaID: 1,
          TenKhoa: "Khoa Nội",
          GhiChu: "Bệnh nhân cần theo dõi đặc biệt"
        },
        {
          ID: 2,
          PhongID: 102,
          SoPhong: "102",
          TenPhong: "Phòng nội tổng quát 2",
          LoaiPhong: "Thường",
          TrangThai: "Trống",
          SoGiuongTong: 4,
          SoGiuongTrong: 4,
          GiaPhong: 200000,
          KhoaID: 1,
          TenKhoa: "Khoa Nội"
        },
        {
          ID: 3,
          PhongID: 201,
          SoPhong: "VIP01",
          TenPhong: "Phòng VIP 1",
          LoaiPhong: "VIP",
          BenhNhanID: 1002,
          TenBenhNhan: "Trần Thị Bình",
          NgayNhapVien: "2025-07-28",
          NgayDuKienXuatVien: "2025-07-30",
          TrangThai: "Chuẩn bị xuất viện",
          SoGiuongTong: 1,
          SoGiuongTrong: 0,
          GiaPhong: 800000,
          KhoaID: 2,
          TenKhoa: "Khoa Ngoại"
        }
      ];
      
      setRoomAssignments(mockRooms);
    } catch (error) {
      console.error("Error loading room assignments:", error);
      showNotification("Lỗi khi tải danh sách phòng", "error");
    }
  };

  const loadInpatientStats = async () => {
    try {
      console.log("Loading inpatient statistics...");
      // TODO: Call API GET /api/inpatient/stats
      // Headers: Authorization: Bearer {access_token}
      
      const mockStats: InpatientStats = {
        tongPhong: 25,
        phongDangSuDung: 15,
        phongTrong: 10,
        benhNhanNoiTru: 28
      };
      
      setInpatientStats(mockStats);
    } catch (error) {
      console.error("Error loading inpatient stats:", error);
    }
  };

  const filterRooms = () => {
    let filtered = roomAssignments;
    
    if (searchTerm) {
      filtered = filtered.filter(room => 
        room.SoPhong.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.TenPhong.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.TenBenhNhan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.TenKhoa.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(room => room.TrangThai === statusFilter);
    }
    
    if (roomTypeFilter !== "all") {
      filtered = filtered.filter(room => room.LoaiPhong === roomTypeFilter);
    }
    
    if (departmentFilter !== "all") {
      filtered = filtered.filter(room => room.KhoaID.toString() === departmentFilter);
    }
    
    setFilteredRooms(filtered);
  };

  const handleAssignRoom = (room: RoomAssignment) => {
    setSelectedRoom(room);
    setAssignmentData({
      benhNhanId: "",
      tenBenhNhan: "",
      ngayNhapVien: new Date().toISOString().split('T')[0],
      ngayDuKienXuatVien: "",
      ghiChu: ""
    });
    setOpenAssignDialog(true);
  };

  const handleDischargePatient = (room: RoomAssignment) => {
    setSelectedRoom(room);
    setDischargeData({
      ngayXuatVien: new Date().toISOString().split('T')[0],
      lyDoXuatVien: "",
      ghiChu: ""
    });
    setOpenDischargeDialog(true);
  };

  const handleViewRoom = (room: RoomAssignment) => {
    setSelectedRoom(room);
    setOpenViewDialog(true);
  };

  const handleConfirmAssignment = async () => {
    if (!selectedRoom) return;
    
    try {
      console.log("Assigning patient to room:", selectedRoom.SoPhong, assignmentData);
      // TODO: Call API POST /api/inpatient/rooms/{roomId}/assign
      // Headers: Authorization: Bearer {access_token}
      // Body: assignmentData
      
      showNotification("Phân phòng thành công", "success");
      setOpenAssignDialog(false);
      setSelectedRoom(null);
      loadRoomAssignments();
      loadInpatientStats();
    } catch (error) {
      console.error("Error assigning room:", error);
      showNotification("Lỗi khi phân phòng", "error");
    }
  };

  const handleConfirmDischarge = async () => {
    if (!selectedRoom) return;
    
    try {
      console.log("Discharging patient from room:", selectedRoom.SoPhong, dischargeData);
      // TODO: Call API POST /api/inpatient/rooms/{roomId}/discharge
      // Headers: Authorization: Bearer {access_token}
      // Body: dischargeData
      
      showNotification("Xuất viện thành công", "success");
      setOpenDischargeDialog(false);
      setSelectedRoom(null);
      loadRoomAssignments();
      loadInpatientStats();
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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status: string) => {
    const colors = {
      "Trống": "success",
      "Đã có bệnh nhân": "warning",
      "Chuẩn bị xuất viện": "info",
      "Bảo trì": "error"
    } as const;
    
    const icons = {
      "Trống": <CheckCircle sx={{ fontSize: 14 }} />,
      "Đã có bệnh nhân": <Pending sx={{ fontSize: 14 }} />,
      "Chuẩn bị xuất viện": <Assignment sx={{ fontSize: 14 }} />,
      "Bảo trì": <Cancel sx={{ fontSize: 14 }} />
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

  const getRoomTypeChip = (type: string) => {
    const colors = {
      "VIP": "#ef4565",
      "Thường": "#3da9fc",
      "Cấp cứu": "#ff6b35",
      "Phòng mổ": "#094067"
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

  const getOccupancyColor = (occupied: number, total: number) => {
    const percentage = (occupied / total) * 100;
    if (percentage >= 90) return "#ef4565";
    if (percentage >= 70) return "#ff6b35";
    if (percentage >= 50) return "#3da9fc";
    return "#28a745";
  };

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
                    {inpatientStats.tongPhong}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng số phòng
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
                <Cancel sx={{ fontSize: 40, color: "#ef4565" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {inpatientStats.phongDangSuDung}
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
                <CheckCircle sx={{ fontSize: 40, color: "#28a745" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {inpatientStats.phongTrong}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Phòng trống
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
                <MedicalServices sx={{ fontSize: 40, color: "#90b4ce" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {inpatientStats.benhNhanNoiTru}
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

      {/* Filters */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)", mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm phòng, bệnh nhân..."
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
                  <MenuItem value="Trống">Trống</MenuItem>
                  <MenuItem value="Đã có bệnh nhân">Đã có bệnh nhân</MenuItem>
                  <MenuItem value="Chuẩn bị xuất viện">Chuẩn bị xuất viện</MenuItem>
                  <MenuItem value="Bảo trì">Bảo trì</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Loại phòng</InputLabel>
                <Select
                  value={roomTypeFilter}
                  label="Loại phòng"
                  onChange={(e) => setRoomTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="VIP">VIP</MenuItem>
                  <MenuItem value="Thường">Thường</MenuItem>
                  <MenuItem value="Cấp cứu">Cấp cứu</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Khoa</InputLabel>
                <Select
                  value={departmentFilter}
                  label="Khoa"
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="1">Khoa Nội</MenuItem>
                  <MenuItem value="2">Khoa Ngoại</MenuItem>
                  <MenuItem value="3">Khoa Tim mạch</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Rooms Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Phòng</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Loại</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Khoa</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Giường</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ngày nhập viện</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRooms
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((room) => (
                <TableRow key={room.ID} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                        {room.SoPhong}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        {room.TenPhong}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{getRoomTypeChip(room.LoaiPhong)}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Business sx={{ fontSize: 16, color: "#5f6c7b" }} />
                      <Typography variant="body2" color="#5f6c7b">
                        {room.TenKhoa}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {room.TenBenhNhan ? (
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: "#3da9fc", width: 32, height: 32 }}>
                          {room.TenBenhNhan.split(' ').slice(-1)[0][0]}
                        </Avatar>
                        <Typography variant="body2" color="#5f6c7b">
                          {room.TenBenhNhan}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="#5f6c7b">
                        Trống
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" color="#5f6c7b">
                        {room.SoGiuongTrong}/{room.SoGiuongTong}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(1 - room.SoGiuongTrong / room.SoGiuongTong) * 100}
                        sx={{ 
                          height: 4, 
                          borderRadius: 2,
                          mt: 0.5,
                          bgcolor: "#f0f0f0",
                          "& .MuiLinearProgress-bar": { 
                            bgcolor: getOccupancyColor(room.SoGiuongTong - room.SoGiuongTrong, room.SoGiuongTong)
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {room.NgayNhapVien ? new Date(room.NgayNhapVien).toLocaleDateString('vi-VN') : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(room.TrangThai)}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewRoom(room)}
                        sx={{ color: "#3da9fc" }}
                      >
                        <Visibility />
                      </IconButton>
                      {room.TrangThai === "Trống" && (
                        <IconButton
                          size="small"
                          onClick={() => handleAssignRoom(room)}
                          sx={{ color: "#28a745" }}
                        >
                          <PersonAdd />
                        </IconButton>
                      )}
                      {(room.TrangThai === "Đã có bệnh nhân" || room.TrangThai === "Chuẩn bị xuất viện") && (
                        <IconButton
                          size="small"
                          onClick={() => handleDischargePatient(room)}
                          sx={{ color: "#ef4565" }}
                        >
                          <PersonRemove />
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
          count={filteredRooms.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Room Assignment Dialog */}
      <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Phân phòng - {selectedRoom?.SoPhong}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mã bệnh nhân"
                value={assignmentData.benhNhanId}
                onChange={(e) => setAssignmentData({ ...assignmentData, benhNhanId: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên bệnh nhân"
                value={assignmentData.tenBenhNhan}
                onChange={(e) => setAssignmentData({ ...assignmentData, tenBenhNhan: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày nhập viện"
                type="date"
                value={assignmentData.ngayNhapVien}
                onChange={(e) => setAssignmentData({ ...assignmentData, ngayNhapVien: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày dự kiến xuất viện"
                type="date"
                value={assignmentData.ngayDuKienXuatVien}
                onChange={(e) => setAssignmentData({ ...assignmentData, ngayDuKienXuatVien: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                value={assignmentData.ghiChu}
                onChange={(e) => setAssignmentData({ ...assignmentData, ghiChu: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenAssignDialog(false)} color="inherit">
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmAssignment}
            sx={{
              bgcolor: "#3da9fc",
              "&:hover": { bgcolor: "#2b8fd1" }
            }}
          >
            Xác nhận phân phòng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Patient Discharge Dialog */}
      <Dialog open={openDischargeDialog} onClose={() => setOpenDischargeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Xuất viện - {selectedRoom?.TenBenhNhan}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ngày xuất viện"
                type="date"
                value={dischargeData.ngayXuatVien}
                onChange={(e) => setDischargeData({ ...dischargeData, ngayXuatVien: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lý do xuất viện"
                value={dischargeData.lyDoXuatVien}
                onChange={(e) => setDischargeData({ ...dischargeData, lyDoXuatVien: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                value={dischargeData.ghiChu}
                onChange={(e) => setDischargeData({ ...dischargeData, ghiChu: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDischargeDialog(false)} color="inherit">
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmDischarge}
            sx={{
              bgcolor: "#ef4565",
              "&:hover": { bgcolor: "#d73851" }
            }}
          >
            Xác nhận xuất viện
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Room Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Thông tin phòng - {selectedRoom?.SoPhong}
        </DialogTitle>
        <DialogContent dividers>
          {selectedRoom && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                  Thông tin phòng
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography><strong>Số phòng:</strong> {selectedRoom.SoPhong}</Typography>
                  <Typography><strong>Tên phòng:</strong> {selectedRoom.TenPhong}</Typography>
                  <Typography><strong>Loại phòng:</strong> {getRoomTypeChip(selectedRoom.LoaiPhong)}</Typography>
                  <Typography><strong>Khoa:</strong> {selectedRoom.TenKhoa}</Typography>
                  <Typography><strong>Tổng giường:</strong> {selectedRoom.SoGiuongTong}</Typography>
                  <Typography><strong>Giường trống:</strong> {selectedRoom.SoGiuongTrong}</Typography>
                  <Typography><strong>Giá phòng:</strong> {selectedRoom.GiaPhong.toLocaleString('vi-VN')}đ/ngày</Typography>
                </Box>
              </Grid>
              
              {selectedRoom.TenBenhNhan && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: "#094067", mb: 2 }}>
                    Thông tin bệnh nhân
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography><strong>Tên bệnh nhân:</strong> {selectedRoom.TenBenhNhan}</Typography>
                    <Typography><strong>Ngày nhập viện:</strong> {selectedRoom.NgayNhapVien ? new Date(selectedRoom.NgayNhapVien).toLocaleDateString('vi-VN') : ""}</Typography>
                    <Typography><strong>Dự kiến xuất viện:</strong> {selectedRoom.NgayDuKienXuatVien ? new Date(selectedRoom.NgayDuKienXuatVien).toLocaleDateString('vi-VN') : ""}</Typography>
                    <Typography><strong>Trạng thái:</strong> {getStatusChip(selectedRoom.TrangThai)}</Typography>
                    {selectedRoom.GhiChu && (
                      <Typography><strong>Ghi chú:</strong> {selectedRoom.GhiChu}</Typography>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenViewDialog(false)} color="inherit">
            Đóng
          </Button>
          {selectedRoom && selectedRoom.TrangThai === "Trống" && (
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => {
                setOpenViewDialog(false);
                handleAssignRoom(selectedRoom);
              }}
              sx={{
                bgcolor: "#28a745",
                "&:hover": { bgcolor: "#1e7e34" }
              }}
            >
              Phân phòng
            </Button>
          )}
          {selectedRoom && (selectedRoom.TrangThai === "Đã có bệnh nhân" || selectedRoom.TrangThai === "Chuẩn bị xuất viện") && (
            <Button
              variant="contained"
              startIcon={<PersonRemove />}
              onClick={() => {
                setOpenViewDialog(false);
                handleDischargePatient(selectedRoom);
              }}
              sx={{
                bgcolor: "#ef4565",
                "&:hover": { bgcolor: "#d73851" }
              }}
            >
              Xuất viện
            </Button>
          )}
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

export default InpatientRoomManagement;
