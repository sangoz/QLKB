import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DichvuService } from './dichvu.service';
import { LoaiNhanVien } from 'src/nhanvien/entity/nhanvien.entity';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { CreateUpdateDichVuDto } from './dto/cre-up.dichvu.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('dichvu')
export class DichvuController {
  constructor(private readonly dichvuService: DichvuService) {}

  @ResponseMessage("Tạo dịch vụ thành công")
  @Roles(LoaiNhanVien.BanGiamDoc)
  @Post()
  async createDichVu(@Body() createUpdateDichVuDto: CreateUpdateDichVuDto) {
    console.log('Received create data:', createUpdateDichVuDto);
    console.log('GiaDichVu type:', typeof createUpdateDichVuDto.GiaDichVu);
    console.log('GiaDichVu value:', createUpdateDichVuDto.GiaDichVu);
    return this.dichvuService.createDichVu(createUpdateDichVuDto);
  }

  @ResponseMessage("Cập nhật dịch vụ thành công")
  @Roles(LoaiNhanVien.BanGiamDoc, LoaiNhanVien.DichVu)
  @Put(":id")
  async updateDichVu(@Param("id") id: string, @Body() createUpdateDichVuDto: CreateUpdateDichVuDto) {
    console.log('Received update data:', createUpdateDichVuDto);
    console.log('GiaDichVu type:', typeof createUpdateDichVuDto.GiaDichVu);
    console.log('GiaDichVu value:', createUpdateDichVuDto.GiaDichVu);
    return this.dichvuService.updateDichVu(id, createUpdateDichVuDto);
  }

  @ResponseMessage("Xóa dịch vụ thành công")
  @Roles(LoaiNhanVien.BanGiamDoc)
  @Delete(":id")
  async deleteDichVu(@Param("id") id: string) {
    return this.dichvuService.deleteDichVu(id);
  }

  @ResponseMessage("Lấy danh sách dịch vụ thành công")
  @Public()
  @Get()
  async getAllDichVu() {
    return this.dichvuService.getAllDichVu();
  }



}
