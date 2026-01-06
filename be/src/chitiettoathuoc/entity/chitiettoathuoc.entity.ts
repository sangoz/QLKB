export class ChiTietToaThuoc {
    MaThuoc: string;
    MaToaThuoc: string;
    SoLuong: number;
    LieuLuong: string;
    DonGia: number;

    constructor(
        MaThuoc: string,
        MaToaThuoc: string,
        SoLuong: number,
        LieuLuong: string,
        DonGia: number
    ) {
        this.MaThuoc = MaThuoc;
        this.MaToaThuoc = MaToaThuoc;
        this.SoLuong = SoLuong;
        this.LieuLuong = LieuLuong;
        this.DonGia = DonGia;
    }
}
