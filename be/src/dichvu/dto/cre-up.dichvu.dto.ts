import { IsNumberString, IsString, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class CreateUpdateDichVuDto {
    @IsString()
    TenDichVu: string;

    @IsNumberString({}, { message: 'GiaDichVu must be a valid number string' })
    @Transform(({ value }) => {
        console.log('Transforming GiaDichVu:', value, typeof value);
        return String(value);
    })
    GiaDichVu: string;
}