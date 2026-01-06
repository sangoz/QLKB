import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Grid,
  InputAdornment,
  TablePagination,
  TableSortLabel
} from '@mui/material';
import {
  Visibility,
  Edit,
  Search,
  Refresh,
  Close,
  Person,
  LocalHospital,
  CalendarMonth
} from '@mui/icons-material';
import axiosInstance from '../../utils/axiosCustomize';

// API Services
const chiTietDatLichAPI = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/api/v1/chitietdatlich/all');
      return response;
    } catch (error) {
      console.error('Error fetching chitietdatlich:', error);
      throw error;
    }
  },

  updateStatus: async (maBN: string, maLich: string, fullData: any) => {
    try {
      const response = await axiosInstance.put(`/api/v1/chitietdatlich/${maBN}/${maLich}`, fullData);
      return response;
    } catch (error) {
      console.error('Error updating chitietdatlich status:', error);
      throw error;
    }
  }
};

// API for patient information
const benhNhanAPI = {
  getById: async (maBN: string) => {
    try {
      const response = await axiosInstance.get(`/api/v1/benhnhan/${maBN}`);
      return response;
    } catch (error) {
      console.error('Error fetching benhnhan:', error);
      throw error;
    }
  }
};

// Types
interface ChiTietLich {
  MaLich: string;
  MaBN: string;
  NgayDat: string;
  DonGia: string;
  TrangThai: 'Pending' | 'Accept' | 'Cancel' | 'Done';
  Lich?: {
    MaLich: string;
    SoBNHienTai: number;
    SoBNToiDa: number;
    Ngay: string;
    Buoi: 'Sang' | 'Chieu';
    Gia: string;
    MaNV: string;
  };
  BenhNhan?: {
    MaBN: string;
    HoTen: string;
    Email: string;
    SDT?: string;
    NgaySinh?: string;
    GioiTinh?: string;
    DiaChi?: string;
    CCCD?: string;
  };
}

interface DetailedPatientInfo {
  MaBN: string;
  HoTen: string;
  Email?: string;
  SDT: string;
  NgaySinh?: string;
  GioiTinh?: string;
  DiaChi: string;
  CCCD: string;
  MaPhongBenhId?: string | null;
}

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<ChiTietLich[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<ChiTietLich | null>(null);
  const [detailedPatientInfo, setDetailedPatientInfo] = useState<DetailedPatientInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('TrangThai');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [newStatus, setNewStatus] = useState<'Accept' | 'Cancel'>('Accept');
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  useEffect(() => {
    loadData();
  }, []);

  // Debug effect for detailedPatientInfo
  useEffect(() => {
  }, [detailedPatientInfo]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const response = await chiTietDatLichAPI.getAll();
      
      if (response && response.data) {
        const appointmentsData = response.data;
        
        if (Array.isArray(appointmentsData) && appointmentsData.length > 0) {
          setAppointments(appointmentsData);
          showNotification(`Đã tải ${appointmentsData.length} chi tiết lịch đặt`, "success");
        } else {
          console.warn('Không có dữ liệu chi tiết đặt lịch');
          showNotification('Không tìm thấy dữ liệu chi tiết đặt lịch', 'info');
          setAppointments([]);
        }
      } else {
        console.error('Invalid API response structure:', response);
        showNotification('Cấu trúc dữ liệu API không hợp lệ', 'error');
        setAppointments([]);
      }
      
    } catch (error: any) {
      console.error('Error loading data:', error);
      showNotification(error.response?.data?.message || 'Lỗi khi tải dữ liệu từ API', 'error');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Show notification helper
  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Handle view appointment details
  const handleViewDetails = async (appointment: ChiTietLich) => {
    setSelectedAppointment(appointment);
    setDetailedPatientInfo(null); // Reset previous data
    setViewDialogOpen(true);
    
    // Fetch detailed patient information
    try {
      const response = await benhNhanAPI.getById(appointment.MaBN);
      
      
      if (response && response.data) {
        setDetailedPatientInfo(response.data);
      } else {
        console.warn('No data in response:', response);
      }
    } catch (error: any) {
      console.error('Error fetching patient details:', error);
      showNotification(
        error.response?.data?.message || 'Lỗi khi tải thông tin chi tiết bệnh nhân', 
        'warning'
      );
    }
  };

  // Handle status change dialog
  const handleStatusChange = (appointment: ChiTietLich) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.TrangThai === 'Accept' ? 'Cancel' : 'Accept');
    setStatusDialogOpen(true);
  };

  // Update appointment status
  const handleStatusUpdate = async () => {
    if (!selectedAppointment) return;
    
    try {
      setLoading(true);
      
      // Truyền đầy đủ 5 tham số theo yêu cầu của backend
      const updateData = {
        MaLich: selectedAppointment.MaLich,
        MaBN: selectedAppointment.MaBN,
        NgayDat: selectedAppointment.NgayDat,
        DonGia: selectedAppointment.DonGia,
        TrangThai: newStatus
      };
      
      
      const response = await chiTietDatLichAPI.updateStatus(
        selectedAppointment.MaBN, 
        selectedAppointment.MaLich, 
        updateData
      );
      
      if (response && response.data) {
        showNotification(`Cập nhật trạng thái thành ${newStatus} thành công`, 'success');
        await loadData();
        setStatusDialogOpen(false);
        setSelectedAppointment(null);
      }
    } catch (error: any) {
      console.error('Error updating appointment status:', error);
      showNotification(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Accept': return 'success';
      case 'Cancel': return 'error';
      case 'Done': return 'info';
      default: return 'default';
    }
  };

  // Filter and sort appointments
  const getFilteredAndSortedAppointments = () => {
    let filtered = appointments.filter((appointment) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        appointment.MaLich.toLowerCase().includes(searchLower) ||
        appointment.TrangThai.toLowerCase().includes(searchLower) ||
        appointment.BenhNhan?.HoTen?.toLowerCase().includes(searchLower) ||
        appointment.BenhNhan?.Email?.toLowerCase().includes(searchLower)
      );
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof ChiTietLich];
      let bValue: any = b[sortField as keyof ChiTietLich];

      // Handle nested properties
      if (sortField === 'BenhNhan.HoTen') {
        aValue = a.BenhNhan?.HoTen || '';
        bValue = b.BenhNhan?.HoTen || '';
      } else if (sortField === 'Lich.Ngay') {
        aValue = a.Lich?.Ngay || '';
        bValue = b.Lich?.Ngay || '';
      }

      // Special sorting for TrangThai to prioritize Pending
      if (sortField === 'TrangThai') {
        const statusOrder = { 'Pending': 1, 'Accept': 2, 'Cancel': 3, 'Done': 4 };
        const aOrder = statusOrder[aValue as keyof typeof statusOrder] || 5;
        const bOrder = statusOrder[bValue as keyof typeof statusOrder] || 5;
        
        return sortDirection === 'asc' 
          ? aOrder - bOrder
          : bOrder - aOrder;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const filteredAppointments = getFilteredAndSortedAppointments();
  const paginatedAppointments = filteredAppointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalHospital color="primary" />
            Quản Lý Lịch Hẹn 
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadData}
            disabled={loading}
          >
            Làm mới
          </Button>
        </Box>

        {/* Search and Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm theo mã lịch, trạng thái..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Tổng số: {filteredAppointments.length} lịch hẹn
            </Typography>
          </Grid>
        </Grid>

        {/* Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'MaLich'}
                        direction={sortField === 'MaLich' ? sortDirection : 'asc'}
                        onClick={() => handleSort('MaLich')}
                      >
                        Mã Lịch
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'NgayDat'}
                        direction={sortField === 'NgayDat' ? sortDirection : 'asc'}
                        onClick={() => handleSort('NgayDat')}
                      >
                        Ngày Đặt
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'DonGia'}
                        direction={sortField === 'DonGia' ? sortDirection : 'asc'}
                        onClick={() => handleSort('DonGia')}
                      >
                        Đơn Giá
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'TrangThai'}
                        direction={sortField === 'TrangThai' ? sortDirection : 'asc'}
                        onClick={() => handleSort('TrangThai')}
                      >
                        Trạng Thái
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Thao Tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAppointments.map((appointment) => (
                    <TableRow key={`${appointment.MaBN}-${appointment.MaLich}`}>
                      <TableCell>{appointment.MaLich}</TableCell>
                      <TableCell>{new Date(appointment.NgayDat).toLocaleDateString('vi-VN')}</TableCell>
                      <TableCell>{Number(appointment.DonGia).toLocaleString('vi-VN')} VNĐ</TableCell>
                      <TableCell>
                        <Chip
                          label={appointment.TrangThai}
                          color={getStatusColor(appointment.TrangThai) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(appointment)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        {(appointment.TrangThai === 'Pending' || appointment.TrangThai === 'Accept') && (
                          <Tooltip title="Thay đổi trạng thái">
                            <IconButton
                              size="small"
                              onClick={() => handleStatusChange(appointment)}
                              color="primary"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={filteredAppointments.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage="Số dòng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} của ${count}`}
            />
          </>
        )}

        {/* View Details Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person />
            Chi Tiết Lịch Hẹn
          </DialogTitle>
          <DialogContent>
            {selectedAppointment && (
              <Grid container spacing={2}>
                {/* Thông tin bệnh nhân chi tiết (từ API riêng) - Hiển thị đầu tiên */}
                {detailedPatientInfo ? (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                        Thông Tin Bệnh Nhân
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Mã Bệnh Nhân"
                        value={detailedPatientInfo.MaBN || 'N/A'}
                        InputProps={{ readOnly: true }}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Họ Tên"
                        value={detailedPatientInfo.HoTen || 'N/A'}
                        InputProps={{ readOnly: true }}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Số Điện Thoại"
                        value={detailedPatientInfo.SDT || 'N/A'}
                        InputProps={{ readOnly: true }}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="CCCD"
                        value={detailedPatientInfo.CCCD || 'N/A'}
                        InputProps={{ readOnly: true }}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Địa Chỉ"
                        value={detailedPatientInfo.DiaChi || 'N/A'}
                        InputProps={{ readOnly: true }}
                        margin="normal"
                        multiline
                        rows={2}
                      />
                    </Grid>
                    {detailedPatientInfo.NgaySinh && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Ngày Sinh"
                          value={new Date(detailedPatientInfo.NgaySinh).toLocaleDateString('vi-VN')}
                          InputProps={{ readOnly: true }}
                          margin="normal"
                        />
                      </Grid>
                    )}
                    {detailedPatientInfo.GioiTinh && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Giới Tính"
                          value={detailedPatientInfo.GioiTinh}
                          InputProps={{ readOnly: true }}
                          margin="normal"
                        />
                      </Grid>
                    )}
                    {detailedPatientInfo.MaPhongBenhId && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Mã Phòng Bệnh"
                          value={detailedPatientInfo.MaPhongBenhId}
                          InputProps={{ readOnly: true }}
                          margin="normal"
                        />
                      </Grid>
                    )}
                  </>
                ) : (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Đang tải thông tin bệnh nhân...</Typography>
                    </Box>
                  </Grid>
                )}

                {/* Thông tin lịch hẹn */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, mt: 3, color: 'primary.main' }}>
                    Thông Tin Lịch Hẹn
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mã Lịch"
                    value={selectedAppointment.MaLich}
                    InputProps={{ readOnly: true }}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ngày Đặt"
                    value={new Date(selectedAppointment.NgayDat).toLocaleDateString('vi-VN')}
                    InputProps={{ readOnly: true }}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Đơn Giá"
                    value={`${Number(selectedAppointment.DonGia).toLocaleString('vi-VN')} VNĐ`}
                    InputProps={{ readOnly: true }}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Trạng Thái"
                    value={selectedAppointment.TrangThai}
                    InputProps={{ readOnly: true }}
                    margin="normal"
                  />
                </Grid>
                
                {/* Thông tin lịch khám */}
                {selectedAppointment.Lich && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2, mt: 2, color: 'primary.main' }}>
                        Thông Tin Lịch Khám
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Ngày Khám"
                        value={new Date(selectedAppointment.Lich.Ngay).toLocaleDateString('vi-VN')}
                        InputProps={{ readOnly: true }}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Buổi"
                        value={selectedAppointment.Lich.Buoi}
                        InputProps={{ readOnly: true }}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Số BN Hiện Tại"
                        value={selectedAppointment.Lich.SoBNHienTai}
                        InputProps={{ readOnly: true }}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Số BN Tối Đa"
                        value={selectedAppointment.Lich.SoBNToiDa}
                        InputProps={{ readOnly: true }}
                        margin="normal"
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Đóng</Button>
          </DialogActions>
        </Dialog>

        {/* Status Change Dialog */}
        <Dialog
          open={statusDialogOpen}
          onClose={() => setStatusDialogOpen(false)}
        >
          <DialogTitle>Thay Đổi Trạng Thái</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Bạn có muốn thay đổi trạng thái lịch hẹn của bệnh nhân{' '}
              <strong>{selectedAppointment?.BenhNhan?.HoTen || selectedAppointment?.MaBN}</strong>?
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Trạng thái mới</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as 'Accept' | 'Cancel')}
                label="Trạng thái mới"
              >
                <MenuItem value="Accept">Accept</MenuItem>
                <MenuItem value="Cancel">Cancel</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialogOpen(false)}>Hủy</Button>
            <Button
              onClick={handleStatusUpdate}
              variant="contained"
              disabled={loading}
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default AppointmentManagement;
