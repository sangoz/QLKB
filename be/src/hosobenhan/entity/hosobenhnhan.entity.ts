export class HoSoBenhAnEntity {
    MaHSBA:     string   ;
    TrieuChung: string   ;
    ChanDoan:   string   ;
    MaBN:       string   ;
    MaNV:      string   ;
    NgayKham?:   Date     ;

  constructor(
    MaHSBA: string,
    TrieuChung: string,
    ChanDoan: string,
    MaBN: string,
    MaNV: string,
    NgayKham?: Date,
  ) {
    this.MaHSBA = MaHSBA;
    this.TrieuChung = TrieuChung;
    this.ChanDoan = ChanDoan;
    this.MaBN = MaBN;
    this.MaNV = MaNV;
    this.NgayKham = NgayKham;
  }
}