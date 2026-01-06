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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  TablePagination,
  InputAdornment
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  Hotel,
  Bed,
  AttachMoney
} from "@mui/icons-material";
import { roomAPI, employeeAPI } from "../../services/api";

interface CurrentUser {
  MaNV: string;
  HoTen: string;
  LoaiNV: string;
}

interface Room {
  MaPhong: string;
  TenPhong: string;
  SoBNHienTai: number;
  SoBNToiDa: number;
  LoaiPhong: 'PhongDon' | 'PhongDoi' | 'PhongBon';
  MaNV: string;
  TenNhanVien?: string;
}

interface Employee {
  MaNV: string;
  HoTen: string;
  LoaiNV: string;
}

const RoomManagement: FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("all");
  
  // Form data
  const [formData, setFormData] = useState({
    TenPhong: "",
    SoBNHienTai: 0,
    SoBNToiDa: 1,
    LoaiPhong: "PhongDon" as "PhongDon" | "PhongDoi" | "PhongBon",
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
    loadRooms();
    loadCurrentUser();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, searchTerm, roomTypeFilter]);

  const loadCurrentUser = async () => {
    try {
      const response = await employeeAPI.getAccount();
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error loading current user:", error);
      showNotification("Lỗi khi tải thông tin người dùng", "error");
    }
  };

  const loadRooms = async () => {
    try {
      const response = await roomAPI.getAll();
      setRooms(response.data);
    } catch (error) {
      console.error("Error loading rooms:", error);
      showNotification("Lỗi khi tải danh sách phòng bệnh", "error");
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await employeeAPI.getByType("QuanLyNoiTru");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error loading employees:", error);
      showNotification("Lỗi khi tải danh sách nhân viên", "error");
    }
  };

  const filterRooms = () => {
    let filtered = rooms;
    
    if (searchTerm) {
      filtered = filtered.filter(room => 
        room.TenPhong.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.MaPhong.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (roomTypeFilter !== "all") {
      filtered = filtered.filter(room => room.LoaiPhong === roomTypeFilter);
    }
    
    setFilteredRooms(filtered);
  };

  const handleCreateRoom = async () => {
    try {
      if (!currentUser) {
        showNotification("Không thể xác định thông tin người dùng", "error");
        return;
      }

      const roomData = {
        ...formData,
        MaNV: currentUser.MaNV
      };

      await roomAPI.create(roomData);
      showNotification("Tạo phòng bệnh thành công", "success");
      setOpenDialog(false);
      resetFormData();
      loadRooms();
    } catch (error) {
      console.error("Error creating room:", error);
      showNotification("Lỗi khi tạo phòng bệnh", "error");
    }
  };

  const handleUpdateRoom = async () => {
    try {
      if (!editingRoom || !currentUser) return;
      
      const roomData = {
        ...formData,
        MaNV: currentUser.MaNV
      };

      await roomAPI.update(editingRoom.MaPhong, roomData);
      showNotification("Cập nhật phòng bệnh thành công", "success");
      setOpenDialog(false);
      setEditingRoom(null);
      resetFormData();
      loadRooms();
    } catch (error) {
      console.error("Error updating room:", error);
      showNotification("Lỗi khi cập nhật phòng bệnh", "error");
    }
  };

  const handleDeleteRoom = async (room: Room) => {
    setRoomToDelete(room);
    setDeleteConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!roomToDelete) return;
    
    try {
      await roomAPI.delete(roomToDelete.MaPhong);
      showNotification("Xóa phòng bệnh thành công", "success");
      loadRooms();
      setDeleteConfirmDialog(false);
      setRoomToDelete(null);
    } catch (error) {
      console.error("Error deleting room:", error);
      showNotification("Lỗi khi xóa phòng bệnh", "error");
    }
  };

  const resetFormData = () => {
    setFormData({
      TenPhong: "",
      SoBNHienTai: 0,
      SoBNToiDa: 1,
      LoaiPhong: "PhongDon",
    });
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      TenPhong: room.TenPhong,
      SoBNHienTai: room.SoBNHienTai,
      SoBNToiDa: room.SoBNToiDa,
      LoaiPhong: room.LoaiPhong,
    });
    setOpenDialog(true);
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const getRoomTypeChip = (type: string) => {
    const colors = {
      "PhongDon": "primary",
      "PhongDoi": "secondary", 
      "PhongBon": "info"
    } as const;
    
    const labels = {
      "PhongDon": "Phòng đơn",
      "PhongDoi": "Phòng đôi",
      "PhongBon": "Phòng 4 người"
    };
    
    return (
      <Chip 
        label={labels[type as keyof typeof labels] || type}
        color={colors[type as keyof typeof colors] || "default"}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.SoBNHienTai > 0).length;
  const totalBeds = rooms.reduce((sum, room) => sum + room.SoBNToiDa, 0);
  const occupiedBeds = rooms.reduce((sum, room) => sum + room.SoBNHienTai, 0);

  const paginatedRooms = filteredRooms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Quản lý phòng bệnh
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Tạo, cập nhật và quản lý thông tin phòng bệnh
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
                    {totalRooms}
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
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #90b4ce" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Hotel sx={{ fontSize: 40, color: "#90b4ce" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {occupiedRooms}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Phòng có bệnh nhân
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#5f6c7b" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: "#ffffff", borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Loại phòng</InputLabel>
              <Select
                value={roomTypeFilter}
                onChange={(e) => setRoomTypeFilter(e.target.value)}
                label="Loại phòng"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="PhongDon">Phòng đơn</MenuItem>
                <MenuItem value="PhongDoi">Phòng đôi</MenuItem>
                <MenuItem value="PhongBon">Phòng 4 người</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  bgcolor: "#3da9fc",
                  "&:hover": { bgcolor: "#2b8fd1" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                Thêm phòng mới
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Rooms Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
            Danh sách phòng bệnh ({filteredRooms.length})
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Tên phòng</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Loại phòng</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Sức chứa</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Nhân viên phụ trách</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRooms.map((room) => (
                  <TableRow key={room.MaPhong} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                        {room.TenPhong}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        ID: {room.MaPhong}
                      </Typography>
                    </TableCell>
                    <TableCell>{getRoomTypeChip(room.LoaiPhong)}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#5f6c7b">
                        {room.SoBNHienTai}/{room.SoBNToiDa} bệnh nhân
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#5f6c7b">
                        {currentUser?.HoTen || "Quản lý nội trú"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => {
                            setSelectedRoom(room);
                            setOpenViewDialog(true);
                          }}
                          sx={{ color: "#3da9fc" }}
                        >
                          Xem
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleEditRoom(room)}
                          sx={{ color: "#28a745" }}
                        >
                          Sửa
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => handleDeleteRoom(room)}
                          sx={{ color: "#ef4565" }}
                          disabled={room.SoBNHienTai > 0}
                        >
                          Xóa
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredRooms.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} của ${count}`}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Room Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          {editingRoom ? "Cập nhật phòng bệnh" : "Thêm phòng bệnh mới"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên phòng"
                value={formData.TenPhong}
                onChange={(e) => setFormData({ ...formData, TenPhong: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Loại phòng</InputLabel>
                <Select
                  value={formData.LoaiPhong}
                  onChange={(e) => setFormData({ ...formData, LoaiPhong: e.target.value as any })}
                  label="Loại phòng"
                  // @ts-ignore
                  disabled={editingRoom}
                >
                  <MenuItem value="PhongDon">Phòng đơn</MenuItem>
                  <MenuItem value="PhongDoi">Phòng đôi</MenuItem>
                  <MenuItem value="PhongBon">Phòng 4 người</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số bệnh nhân hiện tại"
                type="number"
                value={formData.SoBNHienTai}
                onChange={(e) => setFormData({ ...formData, SoBNHienTai: parseInt(e.target.value) || 0 })}
                inputProps={{ min: 0 }}
                disabled={true}
                helperText={editingRoom ? "Mặc định 0 khi tạo mới" : ""}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số bệnh nhân tối đa"
                type="number"
                value={formData.SoBNToiDa}
                onChange={(e) => setFormData({ ...formData, SoBNToiDa: parseInt(e.target.value) || 1 })}
                inputProps={{ min: 1 }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => {
              setOpenDialog(false);
              setEditingRoom(null);
              resetFormData();
            }} 
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={editingRoom ? handleUpdateRoom : handleCreateRoom}
            sx={{
              bgcolor: "#3da9fc",
              "&:hover": { bgcolor: "#2b8fd1" }
            }}
          >
            {editingRoom ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Room Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Chi tiết phòng bệnh
        </DialogTitle>
        {selectedRoom && (
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="#5f6c7b">Mã phòng:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedRoom.MaPhong}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="#5f6c7b">Tên phòng:</Typography>
                <Typography variant="body1">{selectedRoom.TenPhong}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="#5f6c7b">Loại phòng:</Typography>
                {getRoomTypeChip(selectedRoom.LoaiPhong)}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="#5f6c7b">Sức chứa:</Typography>
                <Typography variant="body1">{selectedRoom.SoBNHienTai}/{selectedRoom.SoBNToiDa} bệnh nhân</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="#5f6c7b">Nhân viên phụ trách:</Typography>
                <Typography variant="body1">{currentUser?.HoTen || "N/A"}</Typography>
              </Grid>
            </Grid>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)} color="inherit">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialog} onClose={() => setDeleteConfirmDialog(false)}>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Xác nhận xóa phòng bệnh
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn xóa phòng bệnh này không?
          </Typography>
          {roomToDelete && (
            <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" color="#5f6c7b">Thông tin phòng:</Typography>
              <Typography variant="body2"><strong>Tên phòng:</strong> {roomToDelete.TenPhong}</Typography>
              <Typography variant="body2"><strong>Loại phòng:</strong> {roomToDelete.LoaiPhong}</Typography>
              <Typography variant="body2"><strong>Số bệnh nhân hiện tại:</strong> {roomToDelete.SoBNHienTai}</Typography>
            </Box>
          )}
          <Typography variant="body2" color="error" sx={{ mt: 2, fontStyle: "italic" }}>
            Hành động này không thể hoàn tác!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setDeleteConfirmDialog(false);
              setRoomToDelete(null);
            }} 
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            color="error"
            sx={{
              bgcolor: "#ef4565",
              "&:hover": { bgcolor: "#d63447" }
            }}
          >
            Xóa
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

export default RoomManagement;
