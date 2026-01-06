import { ThanhToanMoMo, TrangThaiThanhToanMoMo } from './thanhtoanmomo.entity';

export class ThanhToanMoMoMapper {
    static toEntity(data: any): ThanhToanMoMo {
        return new ThanhToanMoMo(
            data.MaGiaoDich,
            data.OrderId,
            data.RequestId,
            data.PartnerCode,
            Number(data.Amount),
            data.OrderInfo,
            data.Signature,
            data.TrangThai as TrangThaiThanhToanMoMo,
            data.NgayTao,
            data.NgayCapNhat,
            data.MaHD,
            data.RedirectUrl,
            data.IpnUrl,
            data.ExtraData,
            data.MoMoTransId,
            data.PayType,
            data.ResponseTime,
            data.Message,
            data.ResultCode
        );
    }

    static toEntityList(dataList: any[]): ThanhToanMoMo[] {
        return dataList.map(data => this.toEntity(data));
    }
}
