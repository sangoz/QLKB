export enum BuoiKham {
    SANG = 'Sang',
    CHIEU = 'Chieu',
}

export class LichEntity {
  MaLich: string;
  SoBNHienTai: number;
  SoBNToiDa: number;
  Ngay: Date;
  Buoi: BuoiKham;
  Gia: number;
  MaNV: string;
  constructor(
    MaLich: string,
    SoBNHienTai: number,
    SoBNToiDa: number,
    Ngay: Date,
    Buoi: BuoiKham,
    Gia: number,
    MaNV: string,
  ) {
    this.MaLich = MaLich;
    this.SoBNHienTai = SoBNHienTai;
    this.SoBNToiDa = SoBNToiDa;
    this.Ngay = Ngay;
    this.Buoi = Buoi;
    this.Gia = Gia;
    this.MaNV = MaNV;
  }
}