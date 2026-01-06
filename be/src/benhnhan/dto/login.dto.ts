import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class LoginBenhNhanDto {
  @IsString()
  @IsPhoneNumber('VN')
  @IsNotEmpty()
  SDT: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}