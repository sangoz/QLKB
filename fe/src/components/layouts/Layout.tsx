import { FC, ReactNode, useState, useEffect } from "react";
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import { 
  Menu as MenuIcon,
  Dashboard,
  CalendarMonth,
  Receipt,
  People,
  MedicalServices,
  LocalHospital,
  Settings,
  ExitToApp,
  Business,
  Hotel,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableInfo, setEditableInfo] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchUserData = async () => {
      const storedUserType = localStorage.getItem("user_type");
      setUserType(storedUserType);
      
      // Bypass authentication for development - comment out if you want strict auth
      if (!storedUserType) {
        // Set default user type for development - Change this to test different roles
        setUserType("employee");
        
        // TEST DIFFERENT ROLES HERE:
        // For Doctor:
        setUserInfo({ LoaiNV: "BacSi", HoTen: "Test Doctor" });
        
        // For Cashier:
        // setUserInfo({ LoaiNV: "ThuNgan", HoTen: "Test Cashier" });
        
        // For Director:
        // setUserInfo({ LoaiNV: "BanGiamDoc", HoTen: "Test Director" });
        
        return;
      }
      
      try {
        let response;
        if (storedUserType === "patient") {
          response = await authAPI.patientAccount();
        } else if (storedUserType === "employee") {
          response = await authAPI.employeeAccount();
        }
        if (response && response.data) {
          const data = response.data;
          setUserInfo(data);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Comment out the navigate to login for development
        navigate("/login");

      }
    };

    fetchUserData();
  }, []);

  const getMenuItems = () => {
    
    switch (userType) {
      case "patient":
        return [
          { text: "Dashboard", icon: <Dashboard />, path: "/patient/dashboard" },
          { text: "Đặt lịch khám", icon: <CalendarMonth />, path: "/patient/appointments" },
          { text: "Hóa đơn", icon: <Receipt />, path: "/patient/invoices" },
          { text: "Hồ sơ bệnh án", icon: <MedicalServices />, path: "/patient/medical-records" },
        ];
      case "employee":

        switch (userInfo?.LoaiNV) {

          case "BacSi":
            return [
              { text: "Dashboard", icon: <Dashboard />, path: "/doctor/dashboard" },
              { text: "Lập phiếu khám", icon: <MedicalServices />, path: "/doctor/medical-forms" },
              { text: "Kê toa thuốc", icon: <Receipt />, path: "/doctor/prescriptions" },
              { text: "Lịch làm việc", icon: <CalendarMonth />, path: "/doctor/schedules" },
            ];
          case "ThuNgan":
            return [
              { text: "Dashboard", icon: <Dashboard />, path: "/cashier/dashboard" },
              { text: "Quản lý hóa đơn", icon: <Receipt />, path: "/cashier/invoices" },
            ];
          case "TiepNhan":
            return [
              { text: "Dashboard", icon: <Dashboard />, path: "/reception/dashboard" },
            ];
          case "QuanLyNoiTru":
            return [
              { text: "Dashboard", icon: <Dashboard />, path: "/inpatient/dashboard" },
              { text: "Quản lý phòng bệnh", icon: <Hotel />, path: "/inpatient/rooms" },
              { text: "Quản lý bệnh nhân nội trú", icon: <People />, path: "/inpatient/patients" },
            ];
          case "BanGiamDoc":
            return [
              { text: "Dashboard", icon: <Dashboard />, path: "/director/dashboard" },
              { text: "Quản lý nhân sự", icon: <People />, path: "/admin/employees" },
              { text: "Quản lý chuyên khoa", icon: <Business />, path: "/admin/departments" },
              { text: "Quản lý dịch vụ", icon: <Settings />, path: "/admin/services" },
              { text: "Quản lý thuốc", icon: <MedicalServices />, path: "/admin/medicines" },
            ];
          case "HoTro":
            return[
              { text: "Dashboard", icon: <Dashboard />, path: "/support/dashboard" },
              { text: "Quản lý lịch hẹn", icon: <CalendarMonth />, path: "/support/appointment-management" },
            ];
          case "DichVu":
            return [
              { text: "Quản lý dịch vụ", icon: <Settings />, path: "/service/dashboard" },
            ]

          // default:
          //   return [
          //     { text: "Dashboard", icon: <Dashboard />, path: "/employee/dashboard" },
          //   ];

        }
      case "admin":
        return [
          { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
          { text: "Nhân viên", icon: <People />, path: "/admin/employees" },
          { text: "Khoa", icon: <Business />, path: "/admin/departments" },
          { text: "Thuốc", icon: <MedicalServices />, path: "/admin/medicines" },
          { text: "Dịch vụ", icon: <Settings />, path: "/admin/services" },
        ];
      default:
        return [];
    }
  };

  const handleLogout = async () => {
    try{
      let logOut : any;
      if (userType === "employee") {
        logOut = await authAPI.employeeLogout();
      } else if (userType === "patient") {
          logOut = await authAPI.patientLogout();
      }
      if (logOut && logOut.data) {
        toast.success("Đăng xuất thành công!");
      }
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_type");
      setTimeout(() => navigate("/login"), 2000);
    }
    catch (error) {
      console.error("Error during logout:", error);
      toast.error("Đã xảy ra lỗi khi đăng xuất.");
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(newPassword)) {
        toast.error("Mật khẩu mới phải có ít nhất 1 số, 1 ký tự in hoa, 1 ký tự đặc biệt và tối thiểu 6 ký tự.");
        return;
      }
      let changedPassword : any;
      if (userType === "employee") {
        changedPassword = await authAPI.employeeChangePassword(
          userInfo?.SDT,
          oldPassword,
          newPassword
        );
      } else if (userType === "patient") {
        changedPassword = await authAPI.patientChangePassword(
          userInfo?.SDT,
          oldPassword,
          newPassword
        );
      } else {
        toast.error("Loại người dùng không hợp lệ.");
        return;
      }

      if (changedPassword && changedPassword.error && changedPassword.message) {
        toast.error(changedPassword.message || changedPassword.error);
        return;
      }
      if (changedPassword && changedPassword.data) {
        toast.success("Đổi mật khẩu thành công!");
      }
      setOldPassword(""); // Clear old password
      setNewPassword(""); // Clear new password
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Đã xảy ra lỗi khi đổi mật khẩu.");
    } finally {
      setPasswordDialogOpen(false);
    }
  };

  const fetchAccountInfo = async () => {
    try {
      let accountInfo;
      if (userType === "employee") {
        accountInfo = await authAPI.employeeAccount();
      } else if (userType === "patient") {
        accountInfo = await authAPI.patientAccount();
      } else {
        toast.error("Loại người dùng không hợp lệ.");
        return;
      }
      if (accountInfo && accountInfo.data) {
        setEditableInfo(accountInfo.data);
      } else {
        toast.error("Không thể tải thông tin tài khoản.");
      }
    } catch (error) {
      console.error("Error fetching account information:", error);
      toast.error("Đã xảy ra lỗi khi tải thông tin tài khoản.");
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleChangeInfo();
    } else {
      setIsEditing(true);
    }
  };

  const handleChangeInfo = async () => {
    try {
      let updatedInfo;
      if (userType === "patient") {
        updatedInfo = await authAPI.patientUpdateAccount(
          editableInfo.MaBN,
          editableInfo.HoTen,
          editableInfo.DiaChi,
          editableInfo.SDT,
          editableInfo.CCCD,
          editableInfo.Matkhau,
          editableInfo.MaPhongBenhId
        );
      } else {
        toast.error("Loại người dùng không hợp lệ.");
        return;
      }

      if (updatedInfo && updatedInfo.data) {
        toast.success("Cập nhật thông tin thành công!");
        setIsEditing(false);
      } else {
        toast.error("Cập nhật thông tin thất bại.");
      }
    } catch (error) {
      console.error("Error updating account information:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin.");
    }
  };

  useEffect(() => {
    if (isProfileDialogOpen) {
      fetchAccountInfo();
    }
  }, [isProfileDialogOpen]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fffffe' }}>
      {/* App Bar */}
      <ToastContainer />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#094067',
          boxShadow: '0 2px 10px rgba(9, 64, 103, 0.15)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <LocalHospital sx={{ mr: 1, color: '#3da9fc' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Bệnh viện Đại học Y Dược TP.HCM
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="body2" sx={{ mr: 2 }}>
              {userType === "patient" ? "Bệnh nhân" : userType === "employee" ? "Nhân viên" : "Quản trị viên"}
            </Typography>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            bgcolor: '#094067',
            color: '#fffffe',
            borderRight: 'none',
            boxShadow: '2px 0 10px rgba(9, 64, 103, 0.15)'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 1 }}>
          {/* User Info */}
          <Box sx={{ 
            p: 2, 
            mb: 2, 
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 254, 0.1)',
            textAlign: 'center'
          }}>
            <Typography variant="subtitle1" sx={{ color: '#fffffe', fontWeight: 600 }}>
              {userType === "patient" ? "Bệnh nhân" : userType === "employee" ? "Nhân viên" : "Quản trị viên"}
            </Typography>
            <Typography variant="body2" sx={{ color: '#90b4ce' }}>
              Hệ thống bệnh viện
            </Typography>
          </Box>
          
          <List>
            {getMenuItems().map((item) => (
              <ListItem 
                component="div"
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(61, 169, 252, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#90b4ce', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      color: '#fffffe',
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: drawerOpen ? 0 : '-240px',
        }}
      >
        <Toolbar />
        {children}
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          setAnchorEl(null);
          setProfileDialogOpen(true);
        }}>
          <ListItemIcon><People /></ListItemIcon> {/* Changed icon to People */}
          Thông tin cá nhân
        </MenuItem>
        <MenuItem onClick={() => {
          setAnchorEl(null);
          setPasswordDialogOpen(true);
        }}>
          <ListItemIcon><Settings /></ListItemIcon>
          Đổi mật khẩu
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          setAnchorEl(null);
          handleLogout();
        }}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          <TextField 
            label="Mật khẩu cũ" 
            type={showOldPassword ? "text" : "password"} 
            fullWidth 
            margin="normal" 
            value={oldPassword} 
            onChange={(e) => setOldPassword(e.target.value)} 
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowOldPassword(!showOldPassword)}>
                  {!showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />
          <TextField 
            label="Mật khẩu mới" 
            type={showNewPassword ? "text" : "password"} 
            fullWidth 
            margin="normal" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                  {!showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Hủy</Button>
          <Button onClick={handlePasswordChange} variant="contained">Xác nhận</Button>
        </DialogActions>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onClose={() => setProfileDialogOpen(false)}>
        <DialogTitle>Thông tin cá nhân</DialogTitle>
        <DialogContent>
          <TextField
            label="Họ tên"
            value={editableInfo.HoTen || ""}
            fullWidth
            margin="normal"
            disabled={!isEditing || userType === "employee"}
            onChange={(e) => setEditableInfo({ ...editableInfo, HoTen: e.target.value })}
          />
          {userType === "patient" && (
            <>
              <TextField
                label="CCCD"
                value={editableInfo.CCCD || ""}
                fullWidth
                margin="normal"
                disabled={!isEditing}
                onChange={(e) => setEditableInfo({ ...editableInfo, CCCD: e.target.value })}
              />
              <TextField
                label="Số điện thoại"
                value={editableInfo.SDT || ""}
                fullWidth
                margin="normal"
                disabled={!isEditing}
                onChange={(e) => setEditableInfo({ ...editableInfo, SDT: e.target.value })}
              />
              <TextField
                label="Địa chỉ"
                value={editableInfo.DiaChi || ""}
                fullWidth
                margin="normal"
                disabled={!isEditing}
                onChange={(e) => setEditableInfo({ ...editableInfo, DiaChi: e.target.value })}
              />
            </>
          )}
          {userType === "employee" && (
            <>
              <TextField
                label="Ngày sinh"
                value={editableInfo.NgaySinh || ""}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Số điện thoại"
                value={editableInfo.SDT || ""}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Địa chỉ"
                value={editableInfo.DiaChi || ""}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Lương"
                value={editableInfo.Luong || ""}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Loại nhân viên"
                value={editableInfo.LoaiNV || ""}
                fullWidth
                margin="normal"
                disabled
              />
              {editableInfo.TrinhDo && (
                <TextField
                  label="Trình độ"
                  value={editableInfo.TrinhDo || ""}
                  fullWidth
                  margin="normal"
                  disabled
                />
              )}
              {editableInfo.TruongKhoa && (
                <TextField
                  label="Trưởng khoa"
                  value={editableInfo.TruongKhoa || ""}
                  fullWidth
                  margin="normal"
                  disabled
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialogOpen(false)}>Đóng</Button>
          <Button onClick={handleEditToggle} variant="contained">
            {isEditing ? "Xác nhận" : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Layout;
