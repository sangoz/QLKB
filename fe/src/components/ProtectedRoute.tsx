import { FC, ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userType = localStorage.getItem('user_type');

        if (userType === 'employee') {
          const response = await authAPI.employeeAccount();
          if (response?.data) {
            setIsAuthenticated(true);
            setUserRole(response.data.LoaiNV);
            console.log('Employee role detected:', response.data.LoaiNV);
          } else {
            setIsAuthenticated(false);
          }
        } else if (userType === 'patient') {
          const patientResponse = await authAPI.patientAccount();
          if (patientResponse?.data) {
            setIsAuthenticated(true);
            setUserRole('Patient');
            // console.log('Patient role detected');
          } else {
            setIsAuthenticated(false);
          }
        } else {
          console.log('Invalid user type in localStorage');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error during authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    console.log(`Access denied. User role: ${userRole}, Allowed roles: ${allowedRoles.join(', ')}`);
    
    // Redirect to appropriate dashboard based on user role
    const roleRoutes: { [key: string]: string } = {
      'BacSi': '/doctor/dashboard',
      'ThuNgan': '/cashier/dashboard', 
      'TiepNhan': '/reception/dashboard',
      'QuanLyNoiTru': '/inpatient/dashboard',
      'BanGiamDoc': '/director/dashboard',
      'Patient': '/patient/dashboard',
      'DichVu': '/service/dashboard',
      'HoTro': '/support/dashboard'
    };

    const redirectPath = roleRoutes[userRole] || '/login';
    return <Navigate to={redirectPath} replace />;
  }

  // console.log(`Access granted. User role: ${userRole}`);
  return <>{children}</>;
};

export default ProtectedRoute;
