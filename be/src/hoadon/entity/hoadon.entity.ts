import { Decimal } from "@prisma/client/runtime/library";

export enum LoaiHoadon {
    NhapVien = 'NhapVien',
    XuatVien = 'XuatVien',
    DichVu = 'DichVu',
    KhamBenh = 'KhamBenh',
    ToaThuoc = 'ToaThuoc'
}

export enum TrangThaiHoadon {
    Pending = 'Pending',
    Done = 'Done',
}

export enum PhuongThucThanhToan {
    TienMat = 'TienMat',
    MoMo = 'MoMo',
}

export class HoadonEntity {
    MaHD: string;
    NgayTao: Date;
    TongTien: Decimal;
    TrangThai: TrangThaiHoadon;
    PhuongThucThanhToan: PhuongThucThanhToan;
    LoaiHoaDon: LoaiHoadon;
    MaBN: string;
    MaNV: string | null;
    constructor(
            maHD: string,
            ngayTao: Date,
            tongTien: Decimal,
            trangThai: TrangThaiHoadon,
            phuongThucThanhToan: PhuongThucThanhToan,
            loaiHoaDon: LoaiHoadon,
            maBN: string,
            maNV: string
        ) {
            this.MaHD = maHD;
            this.NgayTao = ngayTao;
            this.TongTien = tongTien;
            this.TrangThai = trangThai;
            this.PhuongThucThanhToan = phuongThucThanhToan;
            this.LoaiHoaDon = loaiHoaDon;
            this.MaBN = maBN;
            this.MaNV = maNV;
        }
s}