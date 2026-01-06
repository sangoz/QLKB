import { FC, useState, useEffect } from "react";
import { 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Tab, 
  Tabs
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login: FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [patientLogin, setPatientLogin] = useState({
    SDT: "",
    password: ""
  });
  const [employeeLogin, setEmployeeLogin] = useState({
    SDT: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleError = (message: string | undefined) => {
    if (typeof message === "string") {
      toast.error(message); // Hiển thị lỗi đơn lẻ từ backend
    } else if (Array.isArray(message)) {
      (message as string[]).forEach((msg: string) => toast.error(msg)); // Hiển thị từng lỗi trong mảng message
    } else {
      toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  const saveUserSession = (userType: string, accessToken: string) => {
    localStorage.setItem("user_type", userType);
    localStorage.setItem("access_token", accessToken);
  };

  const handlePatientLogin = async () => {
    if (!/^\d{10}$/.test(patientLogin.SDT)) {
      toast.error("Số điện thoại phải có đúng 10 số.");
      return;
    }
    try {
      const res: any = await authAPI.patientLogin(patientLogin.SDT, patientLogin.password);

      if (res && res.error && res.message) {
        handleError(res.message || res.error);
        return;
      }
      if (res.data && res.data.access_token) {
        toast.success("Đăng nhập thành công!");
        saveUserSession("patient", res.data.access_token); // Bỏ qua refreshToken
        setTimeout(() => navigate("/patient/dashboard"), 2000);
      } else {
        toast.error("Đăng nhập thất bại. Tài khoản không có trong hệ thống.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response && err.response.data) {
        handleError(err.response.data.message);
      } else {
        toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleEmployeeLogin = async () => {
    try {
      const res: any = await authAPI.employeeLogin(employeeLogin.SDT, employeeLogin.password);

      if (res && res.error && res.message) {
        handleError(res.message || res.error);
        return;
      }

      if (res.data && res.data.access_token) {
        toast.success("Đăng nhập thành công!");
        saveUserSession("employee", res.data.access_token);

        // Map LoaiNV to the correct path
        const roleMapping: { [key: string]: string } = {
          BacSi: "doctor",
          ThuNgan: "cashier",
          TiepNhan: "reception",
          QuanLyNoiTru: "inpatient",
          BanGiamDoc: "director",
          Admin: "admin",
          HoTro: "support",
          DichVu: "service"
        };

        const role = res.data.user.LoaiNV;
        const path = roleMapping[role] || "employee"; // Default to "employee" if role is not found

        setTimeout(() => navigate(`/${path}/dashboard`), 2000);
      } else {

        toast.error(res.message || "Đăng nhập thất bại. Không tìm thấy tài khoản.");

      }
    } catch (err) {
      const errorMessage =
        typeof err === "object" && err !== null && "message" in err
          ? (err as { message?: string }).message
          : undefined;
      toast.error(errorMessage || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <ToastContainer />
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Đăng nhập hệ thống
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Bệnh nhân" />
            <Tab label="Nhân viên" />
          </Tabs>
        </Box>

        {/* Patient Login */}
        {tabValue === 0 && (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handlePatientLogin(); }}>
            <TextField
              fullWidth
              label="Số điện thoại"
              value={patientLogin.SDT}
              onChange={(e) => setPatientLogin({...patientLogin, SDT: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              value={patientLogin.password}
              onChange={(e) => setPatientLogin({...patientLogin, password: e.target.value})}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <Button onClick={togglePasswordVisibility} size="small">
                    {!showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Đăng nhập
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/register")}
            >
              Đăng ký tài khoản mới
            </Button>
          </Box>
        )}

        {/* Employee Login */}
        {tabValue === 1 && (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleEmployeeLogin(); }}>
            <TextField
              fullWidth
              label="Số điện thoại"
              value={employeeLogin.SDT}
              onChange={(e) => setEmployeeLogin({...employeeLogin, SDT: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              value={employeeLogin.password}
              onChange={(e) => setEmployeeLogin({...employeeLogin, password: e.target.value})}
              margin="normal"
              required
              InputProps={{
              endAdornment: (
                <Button onClick={togglePasswordVisibility} size="small">
                  {!showPassword ? <VisibilityOff /> : <Visibility />}
                </Button>
              ),
            }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Đăng nhập
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Login;
