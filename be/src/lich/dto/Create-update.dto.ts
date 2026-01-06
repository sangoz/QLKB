import {
  IsInt,
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  Min,
  IsDate,
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BuoiKham } from '../entity/lich.entity';
import { IsFutureOrToday } from 'src/decorators/is-afterortoday.decorator';
import { IsSoBenhNhanHopLe } from 'src/decorators/is-sobenhnhanhientai.decorator';

export class CreateLichDto {
    @Type(() => Number)
    @IsNumber({}, { message: 'SoBNHienTai phải là số' })
    @Min(0, { message: 'SoBNHienTai phải >= 0' })
    @IsSoBenhNhanHopLe({ message: 'SoBNHienTai không được lớn hơn số bênh nhân tối đa' })
    SoBNHienTai: number;

    @Type(() => Number)
    @IsNumber({}, { message: 'SoBNToiDa phải là số' })
    @Min(1, { message: 'SoBNToiDa phải >= 1' })
    SoBNToiDa: number;

    @IsFutureOrToday({ message: 'Ngày phải là hôm nay hoặc tương lai' })
    @Transform(({ value }) => {
        const date = new Date(value);
        return new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
        ));
    })
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty({ message: 'Ngày không được để trống' })
    Ngay: Date;

    @IsEnum(BuoiKham)
    @IsNotEmpty({ message: 'Buổi khám không được để trống' })
    Buoi: BuoiKham;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    Gia: number;

    @IsString()
    @IsNotEmpty()
    MaNV: string;

    
}
