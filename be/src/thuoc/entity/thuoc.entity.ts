import { Decimal } from "@prisma/client/runtime/library";

export enum DonViTinh {
  VIEN = 'VIEN',
  ONG = 'ONG',
  CHAI = 'CHAI',
  LO = 'LO',
  TUYP = 'TUYP',
  ML = 'ML',
  G = 'G',
  MCG = 'MCG',
  VY = 'VY'
}

export enum DonViDongGoi {
  HOP = 'HOP',
  HOP_VI = 'HOP_VI',
  HOP_ONG = 'HOP_ONG',
  THUNG = 'THUNG',
  CHAI_LO = 'CHAI_LO',
  GOI = 'GOI'
}

export enum DangBaoChe {
  VIEN_NEN = 'VIEN_NEN',
  VIEN_NANG = 'VIEN_NANG',
  DUNG_DICH = 'DUNG_DICH',
  BOT_PHA_TIEM = 'BOT_PHA_TIEM',
  THUOC_TIEU_KHONG = 'THUOC_TIEU_KHONG',
  DICH_TRUYEN = 'DICH_TRUYEN',
  SIRUP = 'SIRUP',
  DUNG_DICH_SAT_TRUNG = 'DUNG_DICH_SAT_TRUNG',
  THUOC_BOI = 'THUOC_BOI',
  XI_DANG = 'XI_DANG',
  VIEN_NGAM = 'VIEN_NGAM'
}
export class ThuocEntity {
   MaThuoc: string;
   TenThuoc: string;
   BHYT: boolean;
   Gia: Decimal;
   DonViTinh: DonViTinh;
   DonViDongGoi: DonViDongGoi;
   DangBaoChe: DangBaoChe;
   HamLuong: string;
   SoLuongDongGoi: number;

   constructor(
     MaThuoc: string,
     TenThuoc: string,
     BHYT: boolean,
     Gia: Decimal,
     DonViTinh: DonViTinh,
     DonViDongGoi: DonViDongGoi,
     DangBaoChe: DangBaoChe,
     HamLuong: string,
     SoLuongDongGoi: number
   ) {
     this.MaThuoc = MaThuoc;
     this.TenThuoc = TenThuoc;
     this.BHYT = BHYT;
     this.Gia = Gia;
     this.DonViTinh = DonViTinh;
     this.DonViDongGoi = DonViDongGoi;
     this.DangBaoChe = DangBaoChe;
     this.HamLuong = HamLuong;
     this.SoLuongDongGoi = SoLuongDongGoi;
   }
}