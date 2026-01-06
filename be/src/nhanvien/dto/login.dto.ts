import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class LoginDto {
    @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
    @IsPhoneNumber('VN')
    SDT: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @IsString({ message: 'Mật khẩu phải là chuỗi' })
    password: string;
}