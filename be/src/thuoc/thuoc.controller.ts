import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ThuocService } from './thuoc.service';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { LoaiNhanVien } from 'src/nhanvien/entity/nhanvien.entity';
import { CreateUpdateThuocDto } from './dto/cre-upthuoc.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('thuoc')
export class ThuocController {
  constructor(private readonly thuocService: ThuocService) {}

  @ResponseMessage("Lấy danh sách thuốc thành công")
  @Roles(LoaiNhanVien.BanGiamDoc, LoaiNhanVien.BacSi)
  @Get()
  async getAllThuoc() {
    return await this.thuocService.getAllThuoc();
  }

  @ResponseMessage("Thêm thuốc thành công")
  @Roles(LoaiNhanVien.BanGiamDoc)
  @Post()
  async createThuoc(@Body() thuocdto: CreateUpdateThuocDto) {
    return await this.thuocService.createThuoc(thuocdto);
  }

  @ResponseMessage("Cập nhật thuốc thành công")
  @Roles(LoaiNhanVien.BanGiamDoc)
  @Put(':id')
  async updateThuoc(@Param('id') id: string, @Body() thuocdto: CreateUpdateThuocDto) {
    return await this.thuocService.updateThuoc(id, thuocdto);
  }

  @ResponseMessage("Xoá thuốc thành công")
  @Roles(LoaiNhanVien.BanGiamDoc)
  @Delete(':id')
  async deleteThuoc(@Param('id') id: string) {
    return await this.thuocService.deleteThuoc(id);
  }

  @ResponseMessage("Lấy thông tin thuốc thành công")
  @Roles(LoaiNhanVien.BanGiamDoc, LoaiNhanVien.BacSi, LoaiNhanVien.ThuNgan)
  @Get(':id')
  async getThuocById(@Param('id') id: string) {
    return await this.thuocService.getThuocById(id);
  }
  
}
