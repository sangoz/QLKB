import { IsNotEmpty, IsString } from "class-validator";

export class AddKhoaDto {
    @IsString()
    @IsNotEmpty()
    TenKhoa: string;

    @IsString()
    @IsNotEmpty()
    MoTa: string;
}
