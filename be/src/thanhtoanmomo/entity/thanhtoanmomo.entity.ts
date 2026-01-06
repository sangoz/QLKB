export enum TrangThaiThanhToanMoMo {
    Pending = 'Pending',
    Success = 'Success',
    Failed = 'Failed',
    Cancelled = 'Cancelled',
    Expired = 'Expired',
}

export class ThanhToanMoMo {
    MaGiaoDich: string;
    OrderId: string;
    RequestId: string;
    PartnerCode: string;
    Amount: number;
    OrderInfo: string;
    RedirectUrl?: string;
    IpnUrl?: string;
    ExtraData?: string;
    Signature: string;
    TrangThai: TrangThaiThanhToanMoMo;
    NgayTao: Date;
    NgayCapNhat: Date;
    MoMoTransId?: string;
    PayType?: string;
    ResponseTime?: Date;
    Message?: string;
    ResultCode?: string;
    MaHD?: string;

    constructor(
        MaGiaoDich: string,
        OrderId: string,
        RequestId: string,
        PartnerCode: string,
        Amount: number,
        OrderInfo: string,
        Signature: string,
        TrangThai: TrangThaiThanhToanMoMo,
        NgayTao: Date,
        NgayCapNhat: Date,
        MaHD?: string,
        RedirectUrl?: string,
        IpnUrl?: string,
        ExtraData?: string,
        MoMoTransId?: string,
        PayType?: string,
        ResponseTime?: Date,
        Message?: string,
        ResultCode?: string
    ) {
        this.MaGiaoDich = MaGiaoDich;
        this.OrderId = OrderId;
        this.RequestId = RequestId;
        this.PartnerCode = PartnerCode;
        this.Amount = Amount;
        this.OrderInfo = OrderInfo;
        this.Signature = Signature;
        this.TrangThai = TrangThai;
        this.NgayTao = NgayTao;
        this.NgayCapNhat = NgayCapNhat;
        this.MaHD = MaHD;
        this.RedirectUrl = RedirectUrl;
        this.IpnUrl = IpnUrl;
        this.ExtraData = ExtraData;
        this.MoMoTransId = MoMoTransId;
        this.PayType = PayType;
        this.ResponseTime = ResponseTime;
        this.Message = Message;
        this.ResultCode = ResultCode;
    }
}
