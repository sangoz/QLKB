export interface CreateChiTietToaThuocDto {
  MaThuoc: string;
  MaToaThuoc: string;
  SoLuong: number;
  LieuLuong: string;
  DonGia: number;
}

export interface UpdateChiTietToaThuocDto {
  SoLuong?: number;
  LieuLuong?: string;
  DonGia?: number;
}
