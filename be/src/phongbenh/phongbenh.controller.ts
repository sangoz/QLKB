import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PhongbenhService } from './phongbenh.service';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { LoaiNhanVien } from 'src/nhanvien/entity/nhanvien.entity';
import { Public } from 'src/decorators/public.decorator';
import { CreateUpdatePhongBenhDto } from './dto/cre-upphongbenh.dto';

@Controller('phongbenh')
export class PhongbenhController {
  constructor(private readonly phongbenhService: PhongbenhService) {}

  @ResponseMessage("Thêm phòng bệnh thành công")
  @Roles(LoaiNhanVien.QuanLyNoiTru)
  @Post()
  async createPhongBenh(@Body() createUpdatePhongBenhDto: CreateUpdatePhongBenhDto) {
    return this.phongbenhService.createPhongBenh(createUpdatePhongBenhDto);
  }

  @ResponseMessage("Cập nhật phòng bệnh thành công")
  @Roles(LoaiNhanVien.QuanLyNoiTru)
  @Put(":id")
  async updatePhongBenh(@Param("id") id: string, @Body() createUpdatePhongBenhDto: CreateUpdatePhongBenhDto) {
    return this.phongbenhService.updatePhongBenh(id, createUpdatePhongBenhDto);
  }

  @ResponseMessage("Xóa phòng bệnh thành công")
  @Roles(LoaiNhanVien.QuanLyNoiTru)
  @Delete(":id")
  async deletePhongBenh(@Param("id") id: string) {
    return this.phongbenhService.deletePhongBenh(id);
  }

  @ResponseMessage("Lấy danh sách phòng bệnh thành công")
  @Public()
  @Get()
  async getAllPhongBenh() {
    return this.phongbenhService.getAllPhongBenh();
  }


}
