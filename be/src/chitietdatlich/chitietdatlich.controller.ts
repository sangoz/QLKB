
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ChitietdatlichService } from './chitietdatlich.service';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { ChitietdatlichDTO } from './dto/cre-upchitietdatlich.dto';

@Controller('chitietdatlich')
export class ChitietdatlichController {
  constructor(private readonly chitietdatlichService: ChitietdatlichService) {}

  @ResponseMessage("Lấy tất cả chi tiết đặt lịch")
  @Get("all")
  async getAllChitietdatlich() {
    return this.chitietdatlichService.getAllChitietdatlich();
  }

  @ResponseMessage("Lấy danh sách chi tiết đặt lịch cho bệnh nhân")
  @Get("benhnhan/:MaBN")
  async getChitietdatlichByBenhNhan(@Param("MaBN") MaBN: string) {
    return this.chitietdatlichService.getChitietdatlichByBenhNhan(MaBN);
  }

  @ResponseMessage("Thêm chi tiết đặt lịch thành công")
  @Post()
  async createChitietdatlich(@Body() createDTO: ChitietdatlichDTO) {
    return this.chitietdatlichService.createChitietdatlich(createDTO);
  }

  @ResponseMessage("Xóa chi tiết đặt lịch thành công")
  @Delete(":MaBN/:MaLich")
  async deleteChitietdatlich(@Param("MaBN") MaBN: string, @Param("MaLich") MaLich: string) {
    return this.chitietdatlichService.deleteChitietdatlich(MaBN, MaLich);
  }

  //Cập nhật chi tiết đặt lịch
  @ResponseMessage("Cập nhật chi tiết đặt lịch thành công")
  @Put(":MaBN/:MaLich")
  async updateChitietdatlich(@Param("MaBN") MaBN: string, @Param("MaLich") MaLich: string, @Body() updateDTO: ChitietdatlichDTO) {
    return this.chitietdatlichService.updateChitietdatlich(MaBN, MaLich, updateDTO);
  }
}
