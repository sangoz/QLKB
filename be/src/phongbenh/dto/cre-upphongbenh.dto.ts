import { IsEnum, IsInt, IsNotEmpty, IsString, Min, IsNumber } from "class-validator";
import { IsSoBenhNhanHopLe } from "src/decorators/is-sobenhnhanhientai.decorator";
import { LoaiPhong } from "../entity/phongbenh.entity";

export class CreateUpdatePhongBenhDto {
    @IsString()
    @IsNotEmpty()
    TenPhong: string;

    @IsInt()
    @IsNotEmpty()
    @Min(0, { message: 'Số bệnh nhân hiện tại phải >= 0' })
    @IsSoBenhNhanHopLe({ message: 'Số bệnh nhân hiện tại không được lớn hơn số bênh nhân tối đa' })
    SoBNHienTai: number;

    @IsInt()
    @IsNotEmpty()
    @Min(1, { message: 'Số bệnh nhân tối đa phải >= 1' })
    SoBNToiDa: number;

    @IsEnum(LoaiPhong)
    @IsNotEmpty()
    LoaiPhong: LoaiPhong;

    @IsString()
    @IsNotEmpty()
    MaNV: string;

}
