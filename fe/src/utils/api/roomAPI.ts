import axiosInstance from '../axiosCustomize';
export enum LoaiPhong {
  PhongDon = 'PhongDon',
  PhongDoi = 'PhongDoi', 
  PhongBon = 'PhongBon'
}

export interface Room {
  MaPhong: string;
  TenPhong: string;
  SoBNHienTai: number;
  SoBNToiDa: number;
  LoaiPhong: LoaiPhong;
  MaNV?: string;
}

export interface Employee {
  MaNV: string;
  HoTen: string;
}

class RoomAPI {
  async getAll(): Promise<Room[]> {
    try {
      const response = await axiosInstance.get(`/api/v1/phongbenh`);
      console.log('API Response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  }

  async create(roomData: Omit<Room, 'MaPhong'>): Promise<Room> {
    try {
      const response = await axiosInstance.post(`/api/v1/phongbenh`, roomData);
      console.log('Create room response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  async update(maPhong: string, roomData: Partial<Room>): Promise<Room> {
    try {
      const response = await axiosInstance.put(`/api/v1/phongbenh/${maPhong}`, roomData);
      console.log('Update room response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  }

  async delete(maPhong: string): Promise<void> {
    try {
      const response = await axiosInstance.delete(`/api/v1/phongbenh/${maPhong}`);
      console.log('Delete room response:', response.data);
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }
}

export const roomAPI = new RoomAPI();
