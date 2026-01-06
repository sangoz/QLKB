export class KhoaEntity {
    MaKhoa: string;
    TenKhoa: string;
    MoTa: string;

    constructor(
        MaKhoa: string,
        TenKhoa: string,
        MoTa: string
    ) {
        this.MaKhoa = MaKhoa;
        this.TenKhoa = TenKhoa;
        this.MoTa = MoTa;
    }
}