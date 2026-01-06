import { IsBoolean, IsEnum, IsInt, IsNumberString,  IsString,  } from "class-validator";
import { DangBaoChe, DonViDongGoi, DonViTinh } from "../entity/thuoc.entity";
import { Transform } from "class-transformer";

export class CreateUpdateThuocDto {

    @IsString()
    TenThuoc: string;

    @Transform(({ value }) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return value;
        })
    @IsBoolean({ message: 'BHYT phải là "true" hoặc "false"' })
    BHYT: boolean;

    @IsString()
    @IsNumberString()
    Gia: string;

    @IsEnum(DonViTinh)
    DonViTinh: DonViTinh;

    @IsEnum(DonViDongGoi)
    DonViDongGoi: DonViDongGoi;

    @IsEnum(DangBaoChe)
    DangBaoChe: DangBaoChe;

    @IsString()
    HamLuong: string;

    @IsInt()
    SoLuongDongGoi: number;
}
