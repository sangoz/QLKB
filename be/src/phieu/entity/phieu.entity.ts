import { Decimal } from "@prisma/client/runtime/library"

export enum LoaiPhieu {
    NhapVien = 'NhapVien',
    XuatVien = 'XuatVien',
    DichVu = 'DichVu',
    KhamBenh = 'KhamBenh',
}

export enum TrangThaiPhieu {
  Pending = 'Pending',
  Payed = 'Payed',
  Done = 'Done',
}

export class PhieuEntity {
    MaPYC:     String   
    NgayYeuCau:  Date
    DonGia:     Decimal
    Loai:       LoaiPhieu
    MaNV:       String
    MaBN:       String
    TrangThai:  TrangThaiPhieu
    MaDichVu?:   String

    constructor(
        MaPYC: String,
        NgayYeuCau: Date,
        DonGia: Decimal,
        Loai: LoaiPhieu,
        MaNV: String,
        MaBN: String,
        TrangThai: TrangThaiPhieu,
        MaDichVu?: String,
    ) {
        this.MaPYC = MaPYC;
        this.NgayYeuCau = NgayYeuCau;
        this.DonGia = DonGia;
        this.Loai = Loai;
        this.MaNV = MaNV;
        this.MaBN = MaBN;
        this.TrangThai = TrangThai;
        this.MaDichVu = MaDichVu;
    }
}