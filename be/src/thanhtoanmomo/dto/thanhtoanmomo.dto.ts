import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { TrangThaiThanhToanMoMo } from '../entity/thanhtoanmomo.entity';

export class CreateThanhToanMoMoDto {
    @IsString()
    OrderId: string;

    @IsString()
    RequestId: string;

    @IsString()
    PartnerCode: string;

    @IsNumber()
    Amount: number;

    @IsString()
    OrderInfo: string;

    @IsOptional()
    @IsString()
    RedirectUrl?: string;

    @IsOptional()
    @IsString()
    IpnUrl?: string;

    @IsOptional()
    @IsString()
    ExtraData?: string;

    @IsString()
    Signature: string;

    @IsOptional()
    @IsString()
    PayUrl?: string;

    @IsOptional()
    @IsString()
    DeepLink?: string;

    @IsOptional()
    @IsString()
    QrCodeUrl?: string;

    @IsEnum(TrangThaiThanhToanMoMo)
    TrangThai: TrangThaiThanhToanMoMo;

    @IsOptional()
    @IsString()
    MaHD?: string;
}

export class UpdateThanhToanMoMoDto {
    @IsOptional()
    @IsEnum(TrangThaiThanhToanMoMo)
    TrangThai?: TrangThaiThanhToanMoMo;

    @IsOptional()
    @IsString()
    MoMoTransId?: string;

    @IsOptional()
    @IsString()
    PayType?: string;

    @IsOptional()
    @IsString()
    Message?: string;

    @IsOptional()
    @IsString()
    ResultCode?: string;

    @IsOptional()
    @IsString()
    MaHD?: string;
}

export class MoMoCallbackDto {
    @IsString()
    orderId: string;

    @IsString()
    requestId: string;

    @IsNumber()
    amount: number;

    @IsString()
    orderInfo: string;

    @IsString()
    orderType: string;

    @IsString()
    transId: string;

    @IsString()
    payType: string;

    @IsNumber()
    resultCode: number;

    @IsString()
    message: string;

    @IsString()
    responseTime: string;

    @IsString()
    signature: string;

    @IsOptional()
    @IsString()
    extraData?: string;
}
