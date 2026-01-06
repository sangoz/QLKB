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
  Snackbar
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  MedicalServices,
  Hotel,
  CheckCircle,
  Cancel,
  Search
} from "@mui/icons-material";
import { roomAPI, Room, LoaiPhong, Employee } from "../../utils/api/roomAPI";

const AdminRooms: FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Room | null>(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form data
  const [formData, setFormData] = useState<{
    MaPhong: string;
    TenPhong: string;
    SoBNHienTai: number;
    SoBNToiDa: number;
    LoaiPhong: LoaiPhong;
    MaNV: string;
  }>({
    MaPhong: "",
    TenPhong: "",
    SoBNHienTai: 0,
    SoBNToiDa: 1,
    LoaiPhong: LoaiPhong.PhongDon,
    MaNV: ""
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
    loadEmployees();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, searchTerm]);

  const loadRooms = async () => {
    try {
      console.log("Loading rooms from API...");
      const roomsData = await roomAPI.getAll();
      setRooms(roomsData);
      console.log("Loaded rooms:", roomsData);
    } catch (error) {
      console.error("Error loading rooms:", error);
      showNotification("Lỗi khi tải danh sách phòng", "error");
    }
  };

  const loadEmployees = async () => {
    try {
      console.log("Loading employees...");
      // TODO: Implement employee API when available
      const mockEmployees: Employee[] = [
        { MaNV: "53cfc564-f66e-475b-b693-c3591b8a3fb3", HoTen: "Nguyễn Văn A" },
        { MaNV: "e1234567-89ab-cdef-0123-456789abcdef", HoTen: "Trần Thị B" },
      ];
      setEmployees(mockEmployees);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  // Helper function to display LoaiPhong in Vietnamese
  const getLoaiPhongDisplay = (loaiPhong: LoaiPhong): string => {
    switch (loaiPhong) {
      case LoaiPhong.PhongDon:
        return "Phòng đơn";
      case LoaiPhong.PhongDoi:
        return "Phòng đôi";
      case LoaiPhong.PhongBon:
        return "Phòng bốn";
      default:
        return "Không xác định";
    }
  };

  const filterRooms = () => {
    let filtered = rooms;
    
    if (searchTerm) {
      filtered = filtered.filter(room => 
        room.MaPhong.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.TenPhong.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getLoaiPhongDisplay(room.LoaiPhong).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredRooms(filtered);
  };

  const handleOpenDialog = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        MaPhong: room.MaPhong,
        TenPhong: room.TenPhong,
        SoBNHienTai: room.SoBNHienTai,
        SoBNToiDa: room.SoBNToiDa,
        LoaiPhong: room.LoaiPhong,
        MaNV: room.MaNV || ""
      });
    } else {
      setEditingRoom(null);
      setFormData({
        MaPhong: "",
        TenPhong: "",
        SoBNHienTai: 0,
        SoBNToiDa: 1,
        LoaiPhong: LoaiPhong.PhongDon,
        MaNV: ""
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRoom(null);
  };

  const handleSave = async () => {
    try {
      const roomData = {
        TenPhong: formData.TenPhong,
        SoBNHienTai: formData.SoBNHienTai,
        SoBNToiDa: formData.SoBNToiDa,
        LoaiPhong: formData.LoaiPhong,
        MaNV: formData.MaNV || undefined
      };
      
      if (editingRoom) {
        console.log("Updating room:", editingRoom.MaPhong, roomData);
        await roomAPI.update(editingRoom.MaPhong, roomData);
        showNotification("Cập nhật phòng thành công", "success");
      } else {
        const createData = {
          MaPhong: formData.MaPhong,
          ...roomData
        };
        console.log("Creating new room:", createData);
        await roomAPI.create(createData);
        showNotification("Tạo phòng mới thành công", "success");
      }
      
      handleCloseDialog();
      loadRooms();
    } catch (error) {
      console.error("Error saving room:", error);
      showNotification("Lỗi khi lưu thông tin phòng", "error");
    }
  };

  const handleDelete = async (room: Room) => {
    try {
      console.log("Deleting room:", room.MaPhong);
      await roomAPI.delete(room.MaPhong);
      showNotification("Xóa phòng thành công", "success");
      setDeleteConfirm(null);
      loadRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      showNotification("Lỗi khi xóa phòng", "error");
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

  // Helper function to display LoaiPhong in Vietnamese
  const getLoaiPhongDisplay = (loaiPhong: LoaiPhong): string => {
    switch (loaiPhong) {
      case LoaiPhong.PhongDon:
        return "Phòng đơn";
      case LoaiPhong.PhongDoi:
        return "Phòng đôi";
      case LoaiPhong.PhongBon:
        return "Phòng bốn";
      default:
        return loaiPhong;
    }
  };

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.SoBNHienTai > 0).length;
  const totalCapacity = rooms.reduce((sum, room) => sum + room.SoBNToiDa, 0);
  const currentPatients = rooms.reduce((sum, room) => sum + room.SoBNHienTai, 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Quản lý Phòng bệnh
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Quản lý danh sách phòng bệnh trong bệnh viện
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #3da9fc" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <MedicalServices sx={{ fontSize: 40, color: "#3da9fc" }} />
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
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #ef4565" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Cancel sx={{ fontSize: 40, color: "#ef4565" }} />
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
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #28a745" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Hotel sx={{ fontSize: 40, color: "#28a745" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {totalCapacity}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng sức chứa
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
                    {currentPatients}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Bệnh nhân hiện tại
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)", mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm theo mã phòng hoặc tên phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: "#5f6c7b", mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
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
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Mã phòng</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Tên phòng</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Loại phòng</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân hiện tại</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Sức chứa tối đa</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Nhân viên phụ trách</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRooms
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((room) => (
                <TableRow key={room.MaPhong} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                      {room.MaPhong}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {room.TenPhong}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getLoaiPhongDisplay(room.LoaiPhong)}
                      size="small"
                      sx={{ 
                        bgcolor: room.LoaiPhong === LoaiPhong.PhongDon ? "#e3f2fd" : 
                                room.LoaiPhong === LoaiPhong.PhongDoi ? "#fff3e0" : "#f3e5f5",
                        color: room.LoaiPhong === LoaiPhong.PhongDon ? "#1976d2" : 
                               room.LoaiPhong === LoaiPhong.PhongDoi ? "#f57c00" : "#7b1fa2",
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {room.SoBNHienTai}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {room.SoBNToiDa}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#5f6c7b">
                      {room.MaNV ? 
                        employees.find(emp => emp.MaNV === room.MaNV)?.HoTen || room.MaNV 
                        : "Chưa phân công"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(room)}
                        sx={{ color: "#3da9fc" }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setDeleteConfirm(room)}
                        sx={{ color: "#ef4565" }}
                      >
                        <Delete />
                      </IconButton>
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

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          {editingRoom ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số phòng"
                value={formData.SoPhong}
                onChange={(e) => setFormData({ ...formData, SoPhong: e.target.value })}
                required
              />
            </Grid>
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
              <FormControl fullWidth>
                <InputLabel>Loại phòng</InputLabel>
                <Select
                  value={formData.LoaiPhong}
                  label="Loại phòng"
                  onChange={(e) => setFormData({ ...formData, LoaiPhong: e.target.value as any })}
                >
                  <MenuItem value="VIP">VIP</MenuItem>
                  <MenuItem value="Thường">Thường</MenuItem>
                  <MenuItem value="Cấp cứu">Cấp cứu</MenuItem>
                  <MenuItem value="Phòng mổ">Phòng mổ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Khoa</InputLabel>
                <Select
                  value={formData.KhoaID}
                  label="Khoa"
                  onChange={(e) => setFormData({ ...formData, KhoaID: e.target.value })}
                  required
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.ID} value={dept.ID.toString()}>
                      {dept.TenKhoa}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số giường"
                type="number"
                value={formData.SoGiuong}
                onChange={(e) => setFormData({ ...formData, SoGiuong: parseInt(e.target.value) || 1 })}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Giá phòng (VNĐ)"
                type="number"
                value={formData.GiaPhong}
                onChange={(e) => setFormData({ ...formData, GiaPhong: parseInt(e.target.value) || 0 })}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.TrangThai}
                  label="Trạng thái"
                  onChange={(e) => setFormData({ ...formData, TrangThai: e.target.value as any })}
                >
                  <MenuItem value="Sẵn sàng">Sẵn sàng</MenuItem>
                  <MenuItem value="Đang sử dụng">Đang sử dụng</MenuItem>
                  <MenuItem value="Bảo trì">Bảo trì</MenuItem>
                  <MenuItem value="Đóng cửa">Đóng cửa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiện nghi (phân cách bằng dấu phẩy)"
                value={formData.TienNghi}
                onChange={(e) => setFormData({ ...formData, TienNghi: e.target.value })}
                placeholder="Điều hòa, TV, Tủ lạnh, ..."
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              bgcolor: "#3da9fc",
              "&:hover": { bgcolor: "#2b8fd1" }
            }}
          >
            {editingRoom ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle sx={{ color: "#ef4565", fontWeight: 600 }}>
          Xác nhận xóa
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa phòng "{deleteConfirm?.SoPhong} - {deleteConfirm?.TenPhong}"?
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteConfirm(null)} color="inherit">
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            sx={{
              bgcolor: "#ef4565",
              "&:hover": { bgcolor: "#d73851" }
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

export default AdminRooms;
