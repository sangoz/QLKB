import { FC, useState } from "react";
import {authAPI} from "../../services/api";
import { 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register: FC = () => {
  const [formData, setFormData] = useState({
    HoTen: "",
    CCCD: "",
    SDT: "",
    DiaChi: "",
    Matkhau: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleError = (message: string | undefined) => {
    if (typeof message === "string") {
      toast.error(message); // Hiển thị trực tiếp lỗi từ backend
    } else {
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const trimmedData = {
      HoTen: formData.HoTen.trim(),
      CCCD: formData.CCCD.trim(),
      SDT: formData.SDT.trim(),
      DiaChi: formData.DiaChi.trim(),
      Matkhau: formData.Matkhau.trim(),
      confirmPassword: formData.confirmPassword.trim(),
    };

    if (!/^\d{10}$/.test(trimmedData.SDT)) {
      toast.error("Số điện thoại phải có đúng 10 số.");
      return;
    }

    if (!/^\d{12}$/.test(trimmedData.CCCD)) {
      toast.error("CCCD phải có đúng 12 số.");
      return;
    }

    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(trimmedData.Matkhau)) {
      toast.error("Mật khẩu phải có ít nhất 1 số, 1 ký tự in hoa, 1 ký tự đặc biệt và tối thiểu 6 ký tự.");
      return;
    }

    if (trimmedData.Matkhau !== trimmedData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    setFormData(trimmedData);
    setIsLoading(true); // Bật trạng thái loading

    try {
      const res: any = await authAPI.patientRegister(
        trimmedData.HoTen,
        trimmedData.DiaChi,
        trimmedData.SDT,
        trimmedData.CCCD,
        trimmedData.Matkhau
      );

      if (res && res.error && res.message) {
        handleError(res.message);
        return;
      }

      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      const errorMessage =
      typeof err === "object" && err !== null && "message" in err
        ? (err as { message?: string }).message
        : undefined;
      toast.error(errorMessage || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsLoading(false); // Tắt trạng thái loading
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <ToastContainer />
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Đăng ký bệnh nhân
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Họ tên"
            value={formData.HoTen}
            onChange={handleChange("HoTen")}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Số CCCD"
            value={formData.CCCD}
            onChange={handleChange("CCCD")}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Số điện thoại"
            value={formData.SDT}
            onChange={handleChange("SDT")}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Địa chỉ"
            value={formData.DiaChi}
            onChange={handleChange("DiaChi")}
            margin="normal"
            multiline
            rows={2}
            required
          />
          <TextField
            fullWidth
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            value={formData.Matkhau}
            onChange={handleChange("Matkhau")}
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
          <TextField
            fullWidth
            label="Xác nhận mật khẩu"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange("confirmPassword")}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <Button onClick={toggleConfirmPasswordVisibility} size="small">
                  {!showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </Button>
              ),
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isLoading} // Vô hiệu hóa nút khi đang loading
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null} // Hiển thị spinner
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
          
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate("/login")}
          >
            Quay lại đăng nhập
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
