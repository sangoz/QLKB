import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { KhoaService } from './khoa.service';
import { AddKhoaDto } from './dto/add-upkhoa.dto';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { Public } from 'src/decorators/public.decorator';
import { LoaiNhanVien } from 'src/nhanvien/entity/nhanvien.entity';

@Controller('khoa')
export class KhoaController {
  constructor(private readonly khoaService: KhoaService) {}

  @Get()
  @Public()
  @ResponseMessage('Lấy danh sách khoa thành công')
  getAllKhoa() {
    return this.khoaService.getAllKhoa();
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Lấy thông tin khoa thành công')
  getKhoaById(@Param('id') id: string) {
    return this.khoaService.getKhoaById(id);
  }

  @Post()
  @ResponseMessage('Thêm khoa thành công')
  @Roles(LoaiNhanVien.BanGiamDoc)  
  addKhoa(@Body() newKhoa: AddKhoaDto) {
    return this.khoaService.addKhoa(newKhoa);
  }

  @Put(':id')
  @ResponseMessage('Cập nhật thông tin khoa thành công')
  @Roles(LoaiNhanVien.BanGiamDoc)
  updateKhoa(@Param('id') id: string, @Body() updatedKhoa: AddKhoaDto) {
    return this.khoaService.updateKhoa(id, updatedKhoa);
  }

  @Delete(':id')
  @ResponseMessage('Xóa khoa thành công')
  @Roles(LoaiNhanVien.BanGiamDoc)
  deleteKhoa(@Param('id') id: string) {
    return this.khoaService.deleteKhoa(id);
  }
  //tra cứu khoa theo tên /api/v1/khoa/search?TenKhoa=${encodeURIComponent(tenKhoa)}
  @Get('search')
  @Public()
  @ResponseMessage('Tìm kiếm khoa theo tên thành công')
  searchKhoaByName(@Query('TenKhoa') tenKhoa: string) {
    return this.khoaService.searchKhoaByName(tenKhoa);
  }
}
