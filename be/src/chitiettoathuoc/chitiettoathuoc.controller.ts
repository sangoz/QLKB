import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ChitiettoathuocService } from './chitiettoathuoc.service';
import { ResponseMessage } from 'src/decorators/response.decorator';

import { LoaiNhanVien } from 'src/nhanvien/entity/nhanvien.entity';
import { Roles } from 'src/decorators/role.decorator';
import { CreateUpdateChiTietToaThuocDto } from './dto/create-update-chitiettoathuoc.dto';


@Controller('chitiettoathuoc')
export class ChitiettoathuocController {
  constructor(private readonly chitiettoathuocService: ChitiettoathuocService) {}


  
  @ResponseMessage("Lấy danh sách chi tiết toa thuốc theo mã toa thuốc thành công")
  @Roles(LoaiNhanVien.ThuNgan, LoaiNhanVien.BacSi)
  @Get('toathuoc/:MaToaThuoc')
  async getChiTietToaThuocByToaThuoc(@Param('MaToaThuoc') MaToaThuoc: string) {
    return await this.chitiettoathuocService.getChiTietToaThuocByToaThuoc(MaToaThuoc);
  }

  @ResponseMessage("Lấy danh sách chi tiết toa thuốc theo mã thuốc thành công")
  @Roles(LoaiNhanVien.ThuNgan, LoaiNhanVien.BacSi)
  @Get('thuoc/:MaThuoc')
  async getChiTietToaThuocByThuoc(@Param('MaThuoc') MaThuoc: string) {
    return await this.chitiettoathuocService.getChiTietToaThuocByThuoc(MaThuoc);
  }

  @ResponseMessage("Tạo chi tiết toa thuốc thành công")
  @Roles(LoaiNhanVien.BacSi)
  @Post()
  async createChiTietToaThuoc(@Body() createUpdateChiTietToaThuocDto: CreateUpdateChiTietToaThuocDto) {
    return await this.chitiettoathuocService.createChiTietToaThuoc(createUpdateChiTietToaThuocDto);
  }

  @ResponseMessage("Cập nhật chi tiết toa thuốc thành công")
  @Roles(LoaiNhanVien.BacSi)
  @Put(':MaThuoc/:MaToaThuoc')
  async updateChiTietToaThuoc(
    @Param('MaThuoc') MaThuoc: string, 
    @Param('MaToaThuoc') MaToaThuoc: string, 
    @Body() createUpdateChiTietToaThuocDto: CreateUpdateChiTietToaThuocDto
  ) {
    return await this.chitiettoathuocService.updateChiTietToaThuoc(MaThuoc, MaToaThuoc, createUpdateChiTietToaThuocDto);
  }

  @ResponseMessage("Xóa chi tiết toa thuốc thành công")
  @Roles(LoaiNhanVien.BacSi)
  @Delete(':MaThuoc/:MaToaThuoc')
  async deleteChiTietToaThuoc(@Param('MaThuoc') MaThuoc: string, @Param('MaToaThuoc') MaToaThuoc: string) {
    return await this.chitiettoathuocService.deleteChiTietToaThuoc(MaThuoc, MaToaThuoc);
  }

  @ResponseMessage("Lấy chi tiết toa thuốc theo mã thuốc và mã toa thuốc thành công")
  @Roles(LoaiNhanVien.ThuNgan, LoaiNhanVien.BacSi)
  @Get(':MaThuoc/:MaToaThuoc')
  async getChiTietToaThuocById(@Param('MaThuoc') MaThuoc: string, @Param('MaToaThuoc') MaToaThuoc: string) {
    return await this.chitiettoathuocService.getChiTietToaThuocById(MaThuoc, MaToaThuoc);
  }


}