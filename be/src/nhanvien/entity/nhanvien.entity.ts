import { Decimal } from "@prisma/client/runtime/library";

export enum LoaiNhanVien {
  TiepNhan = 'TiepNhan',
  ThuNgan = 'ThuNgan',
  HoTro = 'HoTro',
  QuanLyNoiTru = 'QuanLyNoiTru',
  BacSi = 'BacSi',
  BanGiamDoc = 'BanGiamDoc',
  DichVu = 'DichVu',
}

export enum TrinhDo {
  ChuyenKhoaI = 'ChuyenKhoaI',
  ChuyenKhoaII = 'ChuyenKhoaII',
  ThacSi = 'ThacSi',
  TienSi = 'TienSi',
  PhoGiaoSu = 'PhoGiaoSu',
  GiaoSu = 'GiaoSu',
}

export class NhanVien {
  MaNV: string;
  HoTen: string;
  NgaySinh: Date;
  SDT: string;
  DiaChi: string;
  Luong: Decimal;
  LoaiNV: LoaiNhanVien;
  TrinhDo?: TrinhDo;
  LaTruongKhoa?: boolean;
  MaKhoaId?: string;
  RefreshToken?: string;
  Matkhau?: string;

  constructor(
    MaNV: string,
    HoTen: string,
    NgaySinh: Date,
    SDT: string,
    DiaChi: string,
    Luong: Decimal,
    LoaiNV: LoaiNhanVien,
    TrinhDo?: TrinhDo,
    LaTruongKhoa?: boolean,
    MaKhoaId?: string,
  ) {
    this.MaNV = MaNV;
    this.HoTen = HoTen;
    this.NgaySinh = NgaySinh;
    this.SDT = SDT;
    this.DiaChi = DiaChi;
    this.Luong = Luong;
    this.LoaiNV = LoaiNV;
    this.TrinhDo = TrinhDo;
    this.LaTruongKhoa = LaTruongKhoa;
    this.MaKhoaId = MaKhoaId;
  }

  static withPassword(
    MaNV: string,
    HoTen: string,
    NgaySinh: Date,
    SDT: string,
    DiaChi: string,
    Luong: Decimal,
    LoaiNV: LoaiNhanVien,
    Matkhau: string,
    TrinhDo?: TrinhDo,
    LaTruongKhoa?: boolean,
    MaKhoaId?: string
  ): NhanVien {
    const entity = new NhanVien(MaNV, HoTen, NgaySinh, SDT, DiaChi, Luong, LoaiNV, TrinhDo, LaTruongKhoa, MaKhoaId);
    entity.Matkhau = Matkhau;
    return entity;
  }

  public clearPassword(): void {
    this.Matkhau = undefined;
  }
}
