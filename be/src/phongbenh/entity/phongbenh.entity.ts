export enum LoaiPhong{
    PhongDon = 'PhongDon',
    PhongDoi = 'PhongDoi',
    PhongBon = 'PhongBon'
}


export class PhongBenh {
    MaPhong: string;
    TenPhong: string;
    SoBNHienTai: number;
    SoBNToiDa: number;
    LoaiPhong: LoaiPhong;
    MaNV: string;

    constructor(
        MaPhong: string,
        TenPhong: string,
        SoBNHienTai: number,
        SoBNToiDa: number,
        LoaiPhong: LoaiPhong,
        MaNV: string
    ) {
        this.MaPhong = MaPhong;
        this.TenPhong = TenPhong;
        this.SoBNHienTai = SoBNHienTai;
        this.SoBNToiDa = SoBNToiDa;
        this.LoaiPhong = LoaiPhong;
        this.MaNV = MaNV;
    }
}