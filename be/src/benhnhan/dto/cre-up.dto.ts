import {  IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreaUpDto {
  @IsString()
  @IsNotEmpty()
  HoTen: string;

  @IsString()
  @IsNotEmpty()
  DiaChi: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN')
  SDT: string;

  @IsString()
  @IsNotEmpty()
  CCCD: string;

  @IsString()
  @IsOptional()
  Matkhau?: string;

  @IsString()
  @IsOptional()
  MaPhongBenhId?: string;
}