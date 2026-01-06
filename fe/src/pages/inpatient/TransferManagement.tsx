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
  Alert,
  Snackbar,
  TablePagination,
  InputAdornment,
  Autocomplete,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider
} from "@mui/material";
import {
  Add,
  Search,
  SwapHoriz,
  CheckCircle,
  Hotel,
  Person
} from "@mui/icons-material";
import { roomAPI, patientAPI, employeeAPI, phieuAPI } from "../../services/api";

interface Patient {
  MaBN: string;
  HoTen: string;
  CCCD: string;
  SDT: string;
  DiaChi: string;
  MaPhongBenhId: string | null;
}

interface Room {
  MaPhong: string;
  TenPhong: string;
  SoBNToiDa: number;
  SoBNHienTai: number;
  LoaiPhong: string;
  GiaPhong: number;
  MaNV: string;
}

const TransferManagement: FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [openDischargeDialog, setOpenDischargeDialog] = useState(false);
  const [openAdmitDialog, setOpenAdmitDialog] = useState(false);
  const [openPhieuSearchDialog, setOpenPhieuSearchDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchPhieuData, setSearchPhieuData] = useState({
    PatientID: "",
    LoaiPhieu: "" as 'NhapVien' | 'XuatVien' | '',
    MaPhieu: ""
  });
  const [availablePhieus, setAvailablePhieus] = useState<any[]>([]);
  const [selectedPhieu, setSelectedPhieu] = useState<any>(null);
  const [currentAction, setCurrentAction] = useState<'transfer' | 'admit' | 'discharge' | ''>('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form data for operations
  const [transferData, setTransferData] = useState({
    PatientID: "",
    ToRoomID: ""
  });

  const [admitData, setAdmitData] = useState({
    PatientID: "",
    RoomID: ""
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
    loadInpatients();
    loadAllPatients();
    loadRooms();
    loadCurrentUser();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm]);

  const loadCurrentUser = async () => {
    try {
      const response = await employeeAPI.getAccount();
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  };

  const loadInpatients = async () => {
    try {
      const allPatientsResponse = await patientAPI.getAllPatients();
      const inpatients = allPatientsResponse.data.filter((p: any) => p.MaPhongBenhId);
      setPatients(inpatients);
    } catch (error) {
      console.error("Error loading inpatients:", error);
      showNotification("Lỗi khi tải danh sách bệnh nhân nội trú", "error");
    }
  };

  const loadAllPatients = async () => {
    try {
      const response = await patientAPI.getAllPatients();
      setAllPatients(response.data);
    } catch (error) {
      console.error("Error loading all patients:", error);
      showNotification("Lỗi khi tải danh sách bệnh nhân", "error");
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

  const filterPatients = () => {
    let filtered = patients;
    
    if (searchTerm) {
      filtered = filtered.filter(patient => 
        patient.HoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.MaBN.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.MaPhongBenhId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredPatients(filtered);
  };

  const handleTransferPatient = async () => {
    try {
      if (!transferData.PatientID || !transferData.ToRoomID) {
        showNotification("Vui lòng điền đầy đủ thông tin", "error");
        return;
      }

      // Mở dialog tra cứu phiếu thay vì tự động kiểm tra
      setSearchPhieuData({
        PatientID: transferData.PatientID,
        LoaiPhieu: '', // Chuyển phòng không cần phiếu cụ thể
        MaPhieu: ""
      });
      setCurrentAction('transfer');
      setOpenPhieuSearchDialog(true);
    } catch (error) {
      console.error("Error transferring patient:", error);
      showNotification("Lỗi khi chuyển phòng", "error");
    }
  };

  const handleDischargePatient = async () => {
    try {
      if (!selectedPatient) return;

      // Mở dialog tra cứu phiếu xuất viện
      setSearchPhieuData({
        PatientID: selectedPatient.MaBN,
        LoaiPhieu: 'XuatVien',
        MaPhieu: ""
      });
      setCurrentAction('discharge');
      setOpenPhieuSearchDialog(true);
    } catch (error) {
      console.error("Error discharging patient:", error);
      showNotification("Lỗi khi xuất viện", "error");
    }
  };

  const checkPhieuStatus = async (patientId: string, loaiPhieu: 'NhapVien' | 'XuatVien'): Promise<{ canProceed: boolean; phieuId?: string }> => {
    try {
      // Lấy danh sách phiếu của bệnh nhân
      const response = await phieuAPI.getPhieuByPatient(patientId);
      
      if (!response.data) return { canProceed: false };
      
      const phieus = response.data;
      
      // Tìm phiếu phù hợp với loại và trạng thái Payed
      for (const phieu of phieus) {
        if (phieu.Loai === loaiPhieu && 
            (phieu.TrangThai === "Payed" || phieu.MaDichVu === "Payed")) {
          return { canProceed: true, phieuId: phieu.MaPYC };
        }
      }
      return { canProceed: false };
    } catch (error) {
      console.error("Error checking phieu status:", error);
      return { canProceed: false };
    }
  };

  const updatePhieuStatus = async (phieuId: string) => {
    try {
      await phieuAPI.updatePhieu(phieuId, {
        TrangThai: "Done"
      });
    } catch (error) {
      console.error("Error updating phieu status:", error);
    }
  };

  // Tra cứu phiếu cho bệnh nhân
  const searchPhieuForPatient = async () => {
    try {
      if (!searchPhieuData.PatientID) {
        showNotification("Vui lòng chọn bệnh nhân", "error");
        return;
      }

      let response;
      let filteredPhieus = [];

      // Nếu có mã phiếu, tra cứu theo mã phiếu cụ thể
      if (searchPhieuData.MaPhieu.trim()) {
        try {
          response = await phieuAPI.getPhieuById(searchPhieuData.MaPhieu.trim());
          if (response.data) {
            // Kiểm tra phiếu có thuộc về bệnh nhân này không
            if (response.data.MaBN === searchPhieuData.PatientID) {
              filteredPhieus = [response.data];
            } else {
              showNotification("Phiếu này không thuộc về bệnh nhân đã chọn", "error");
              setAvailablePhieus([]);
              return;
            }
          } else {
            showNotification("Không tìm thấy phiếu với mã này", "warning");
            setAvailablePhieus([]);
            return;
          }
        } catch (error) {
          showNotification("Không tìm thấy phiếu với mã này", "warning");
          setAvailablePhieus([]);
          return;
        }
      } else {
        // Tra cứu theo bệnh nhân như cũ
        response = await phieuAPI.getPhieuByPatient(searchPhieuData.PatientID);
        
        if (!response.data || response.data.length === 0) {
          showNotification("Không tìm thấy phiếu nào cho bệnh nhân này", "warning");
          setAvailablePhieus([]);
          return;
        }

        filteredPhieus = response.data;
        
        // Lọc theo loại phiếu nếu có
        if (searchPhieuData.LoaiPhieu) {
          filteredPhieus = filteredPhieus.filter((phieu: any) => 
            phieu.Loai === searchPhieuData.LoaiPhieu && 
            (phieu.TrangThai === "Payed" || phieu.MaDichVu === "Payed")
          );
        } else {
          // Nếu không chỉ định loại phiếu, lọc tất cả phiếu đã thanh toán
          filteredPhieus = filteredPhieus.filter((phieu: any) => 
            phieu.TrangThai === "Payed" || phieu.MaDichVu === "Payed"
          );
        }
      }

      setAvailablePhieus(filteredPhieus);
      
      if (filteredPhieus.length === 0) {
        showNotification(`Không tìm thấy phiếu ${searchPhieuData.LoaiPhieu || ''} đã thanh toán cho bệnh nhân này`, "warning");
      }
    } catch (error) {
      console.error("Error searching phieu:", error);
      showNotification("Lỗi khi tra cứu phiếu", "error");
    }
  };

  // Xác nhận thực hiện action với phiếu đã chọn
  const confirmActionWithPhieu = async () => {
    try {
      if (!selectedPhieu && currentAction !== 'transfer') {
        showNotification("Vui lòng chọn phiếu", "error");
        return;
      }

      switch (currentAction) {
        case 'transfer':
          // Chuyển phòng - cần truyền đầy đủ thông tin theo CreaUpDto
          const currentPatient = patients.find(p => p.MaBN === transferData.PatientID);
          if (!currentPatient) {
            showNotification("Không tìm thấy thông tin bệnh nhân", "error");
            return;
          }
          
          await patientAPI.updatePatientInfo(transferData.PatientID, {
            HoTen: currentPatient.HoTen,
            DiaChi: currentPatient.DiaChi,
            SDT: currentPatient.SDT,
            CCCD: currentPatient.CCCD,
            MaPhongBenhId: transferData.ToRoomID
          });
          showNotification("Chuyển phòng thành công", "success");
          setOpenTransferDialog(false);
          resetTransferData();
          break;

        case 'admit':
          // Nhập viện - cần truyền đầy đủ thông tin
          const admitPatient = allPatients.find(p => p.MaBN === admitData.PatientID);
          if (!admitPatient) {
            showNotification("Không tìm thấy thông tin bệnh nhân", "error");
            return;
          }
          
          await patientAPI.updatePatientInfo(admitData.PatientID, {
            HoTen: admitPatient.HoTen,
            DiaChi: admitPatient.DiaChi,
            SDT: admitPatient.SDT,
            CCCD: admitPatient.CCCD,
            MaPhongBenhId: admitData.RoomID
          });
          if (selectedPhieu) {
            await updatePhieuStatus(selectedPhieu.MaPYC);
          }
          showNotification("Nhập viện thành công", "success");
          setOpenAdmitDialog(false);
          resetAdmitData();
          break;

        case 'discharge':
          // Xuất viện - cần truyền đầy đủ thông tin
          if (selectedPatient) {
            await patientAPI.updatePatientInfo(selectedPatient.MaBN, {
              HoTen: selectedPatient.HoTen,
              DiaChi: selectedPatient.DiaChi,
              SDT: selectedPatient.SDT,
              CCCD: selectedPatient.CCCD,
              MaPhongBenhId: null
            });
            if (selectedPhieu) {
              await updatePhieuStatus(selectedPhieu.MaPYC);
            }
            showNotification("Xuất viện thành công", "success");
            setOpenDischargeDialog(false);
            setSelectedPatient(null);
          }
          break;
      }

      // Reset và đóng dialog
      setOpenPhieuSearchDialog(false);
      setAvailablePhieus([]);
      setSelectedPhieu(null);
      setCurrentAction('');
      loadInpatients();
    } catch (error) {
      console.error("Error confirming action:", error);
      showNotification("Lỗi khi thực hiện thao tác", "error");
    }
  };

  const handleAdmitPatient = async () => {
    try {
      if (!admitData.PatientID || !admitData.RoomID) {
        showNotification("Vui lòng điền đầy đủ thông tin", "error");
        return;
      }

      // Mở dialog tra cứu phiếu nhập viện
      setSearchPhieuData({
        PatientID: admitData.PatientID,
        LoaiPhieu: 'NhapVien',
        MaPhieu: ""
      });
      setCurrentAction('admit');
      setOpenPhieuSearchDialog(true);
    } catch (error) {
      console.error("Error admitting patient:", error);
      showNotification("Lỗi khi nhập viện", "error");
    }
  };

  const resetTransferData = () => {
    setTransferData({
      PatientID: "",
      ToRoomID: ""
    });
  };

  const resetAdmitData = () => {
    setAdmitData({
      PatientID: "",
      RoomID: ""
    });
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const getAvailableRooms = () => {
    return rooms.filter(room => room.SoBNHienTai < room.SoBNToiDa);
  };

  const getOutpatients = () => {
    return allPatients.filter(patient => !patient.MaPhongBenhId);
  };

  const totalInpatients = patients.length;
  const totalOutpatients = getOutpatients().length;
  const totalRooms = rooms.length;
  const availableRooms = getAvailableRooms().length;

  const paginatedPatients = filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Quản lý bệnh nhân nội trú
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Chuyển phòng, nhập viện và xuất viện bệnh nhân
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #3da9fc" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Person sx={{ fontSize: 40, color: "#3da9fc" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {totalInpatients}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Bệnh nhân nội trú
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #3b82f6" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Hotel sx={{ fontSize: 40, color: "#3b82f6" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {totalRooms}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng phòng bệnh
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
                    {availableRooms}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Phòng trống
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
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm..."
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
          <Grid item xs={12} md={9}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenAdmitDialog(true)}
                sx={{
                  bgcolor: "#28a745",
                  "&:hover": { bgcolor: "#1e7e34" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                Nhập viện
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Patients Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
            Danh sách bệnh nhân nội trú ({filteredPatients.length})
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Phòng hiện tại</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Số điện thoại</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Địa chỉ</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPatients.map((patient) => (
                  <TableRow key={patient.MaBN} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                        {patient.HoTen}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        ID: {patient.MaBN}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#5f6c7b">
                        {patient.MaPhongBenhId || 'Chưa phân phòng'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#5f6c7b">
                        {patient.SDT}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#5f6c7b" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {patient.DiaChi}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          startIcon={<SwapHoriz />}
                          onClick={() => {
                            setTransferData({ ...transferData, PatientID: patient.MaBN });
                            setOpenTransferDialog(true);
                          }}
                          sx={{ color: "#3da9fc" }}
                        >
                          Chuyển phòng
                        </Button>
                        <Button
                          size="small"
                          startIcon={<CheckCircle />}
                          onClick={() => {
                            setSelectedPatient(patient);
                            setOpenDischargeDialog(true);
                          }}
                          sx={{ color: "#28a745" }}
                        >
                          Xuất viện
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
            count={filteredPatients.length}
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

      {/* Transfer Dialog */}
      <Dialog open={openTransferDialog} onClose={() => setOpenTransferDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Chuyển phòng bệnh nhân
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                options={getAvailableRooms()}
                getOptionLabel={(option) => `${option.TenPhong} - ${option.LoaiPhong} (${option.SoBNHienTai}/${option.SoBNToiDa})`}
                value={rooms.find(r => r.MaPhong === transferData.ToRoomID) || null}
                onChange={(_, newValue) => {
                  setTransferData({ ...transferData, ToRoomID: newValue?.MaPhong || "" });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Phòng đích" required />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => {
              setOpenTransferDialog(false);
              resetTransferData();
            }} 
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleTransferPatient}
            sx={{
              bgcolor: "#3da9fc",
              "&:hover": { bgcolor: "#2b8fd1" }
            }}
          >
            Chuyển phòng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Admit Dialog */}
      <Dialog open={openAdmitDialog} onClose={() => setOpenAdmitDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Nhập viện bệnh nhân
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                options={getOutpatients()}
                getOptionLabel={(option) => `${option.HoTen} - ${option.SDT} (${option.MaBN})`}
                value={allPatients.find(p => p.MaBN === admitData.PatientID) || null}
                onChange={(_, newValue) => {
                  setAdmitData({ ...admitData, PatientID: newValue?.MaBN || "" });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Bệnh nhân" required />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={getAvailableRooms()}
                getOptionLabel={(option) => `${option.TenPhong} - ${option.LoaiPhong} (${option.SoBNHienTai}/${option.SoBNToiDa})`}
                value={rooms.find(r => r.MaPhong === admitData.RoomID) || null}
                onChange={(_, newValue) => {
                  setAdmitData({ ...admitData, RoomID: newValue?.MaPhong || "" });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Phòng bệnh" required />
                )}
                disabled={!admitData.PatientID}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => {
              setOpenAdmitDialog(false);
              resetAdmitData();
            }} 
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleAdmitPatient}
            sx={{
              bgcolor: "#28a745",
              "&:hover": { bgcolor: "#1e7e34" }
            }}
          >
            Nhập viện
          </Button>
        </DialogActions>
      </Dialog>

      {/* Discharge Dialog */}
      <Dialog open={openDischargeDialog} onClose={() => setOpenDischargeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Xuất viện bệnh nhân
        </DialogTitle>
        <DialogContent dividers>
          {selectedPatient && (
            <Box>
              <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 2, mb: 3 }}>
                <Typography variant="subtitle2" color="#5f6c7b">Thông tin bệnh nhân:</Typography>
                <Typography variant="body2"><strong>Họ tên:</strong> {selectedPatient.HoTen}</Typography>
                <Typography variant="body2"><strong>Mã BN:</strong> {selectedPatient.MaBN}</Typography>
                <Typography variant="body2"><strong>Phòng hiện tại:</strong> {selectedPatient.MaPhongBenhId}</Typography>
              </Box>
              
              <Typography variant="body2" color="#ef4565">
                <strong>Lưu ý:</strong> Hành động này sẽ xuất viện bệnh nhân và giải phóng giường bệnh.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => {
              setOpenDischargeDialog(false);
              setSelectedPatient(null);
            }} 
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleDischargePatient}
            sx={{
              bgcolor: "#ef4565",
              "&:hover": { bgcolor: "#d63447" }
            }}
          >
            Xác nhận xuất viện
          </Button>
        </DialogActions>
      </Dialog>

      {/* Phieu Search Dialog */}
      <Dialog open={openPhieuSearchDialog} onClose={() => setOpenPhieuSearchDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Tra cứu phiếu yêu cầu
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 2, mb: 3 }}>
                <Typography variant="subtitle2" color="#5f6c7b">Thông tin tra cứu:</Typography>
                <Typography variant="body2"><strong>Bệnh nhân:</strong> {searchPhieuData.PatientID}</Typography>
                <Typography variant="body2"><strong>Loại phiếu:</strong> {searchPhieuData.LoaiPhieu || 'Tất cả'}</Typography>
                <Typography variant="body2"><strong>Thao tác:</strong> {
                  currentAction === 'transfer' ? 'Chuyển phòng' :
                  currentAction === 'admit' ? 'Nhập viện' :
                  currentAction === 'discharge' ? 'Xuất viện' : ''
                }</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mã phiếu (tùy chọn)"
                placeholder="Nhập mã phiếu để tra cứu trực tiếp..."
                value={searchPhieuData.MaPhieu}
                onChange={(e) => setSearchPhieuData({ ...searchPhieuData, MaPhieu: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Button
                variant="outlined"
                onClick={searchPhieuForPatient}
                sx={{ mb: 2 }}
              >
                Tra cứu phiếu
              </Button>
            </Grid>

            {availablePhieus.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Danh sách phiếu ({availablePhieus.length}):
                </Typography>
                <RadioGroup
                  value={selectedPhieu?.MaPYC || ''}
                  onChange={(e) => {
                    const phieu = availablePhieus.find(p => p.MaPYC === e.target.value);
                    setSelectedPhieu(phieu);
                  }}
                >
                  {availablePhieus.map((phieu) => (
                    <Box key={phieu.MaPYC} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2, mb: 2 }}>
                      <FormControlLabel
                        value={phieu.MaPYC}
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="subtitle2">
                              Phiếu {phieu.Loai} - {phieu.MaPYC}
                            </Typography>
                            <Typography variant="body2" color="#5f6c7b">
                              Ngày tạo: {new Date(phieu.NgayYeuCau).toLocaleDateString('vi-VN')}
                            </Typography>
                            <Typography variant="body2" color="#5f6c7b">
                              Đơn giá: {phieu.DonGia?.toLocaleString('vi-VN')} VNĐ
                            </Typography>
                            <Chip 
                              label={phieu.TrangThai || phieu.MaDichVu || 'Chưa xác định'} 
                              color={(phieu.TrangThai === 'Payed' || phieu.MaDichVu === 'Payed') ? 'success' : 'default'}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </Box>
                        }
                      />
                    </Box>
                  ))}
                </RadioGroup>
              </Grid>
            )}

            {currentAction === 'transfer' && (
              <Grid item xs={12}>
                <Typography variant="body2" color="#f97316">
                  <strong>Lưu ý:</strong> Chuyển phòng không yêu cầu phiếu. Bạn có thể thực hiện trực tiếp.
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => {
              setOpenPhieuSearchDialog(false);
              setAvailablePhieus([]);
              setSelectedPhieu(null);
              setCurrentAction('');
              setSearchPhieuData({
                PatientID: "",
                LoaiPhieu: "",
                MaPhieu: ""
              });
            }} 
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={confirmActionWithPhieu}
            disabled={!selectedPhieu && currentAction !== 'transfer'}
            sx={{
              bgcolor: "#3da9fc",
              "&:hover": { bgcolor: "#2b8fd1" }
            }}
          >
            Xác nhận thực hiện
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

export default TransferManagement;
