import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { callGetAccount } from '../services/api';

interface User {
  MaNV: string;
  HoTen: string;
  LoaiNV: string;
  LaTruongKhoa?: boolean;
  MaKhoaId?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector((state: any) => state.account.isAuthenticated);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isAuthenticated) {
        try {
          const res = await callGetAccount();
          if (res?.data) {
            setUser(res.data);
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, [isAuthenticated]);

  const isDepartmentHead = () => {
    return user?.LaTruongKhoa === true;
  };

  const isDoctor = () => {
    return user?.LoaiNV === 'BacSi';
  };

  return {
    user,
    loading,
    isAuthenticated,
    isDepartmentHead,
    isDoctor
  };
};
