import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { LichService } from './lich.service';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { LoaiNhanVien } from 'src/nhanvien/entity/nhanvien.entity';
import { CreateLichDto } from './dto/Create-update.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('lich')
export class LichController {
  constructor(private readonly lichService: LichService) {}

    @ResponseMessage("Lấy danh sách lịch khám thành công")
    @Public()
    @Get()
    async getAllLich() {
        return this.lichService.getAllLich();
    }

    @ResponseMessage("Lấy lịch khám theo ID thành công")
    @Public()
    @Get(':id')
    async getLichById(@Param('id') id: string) {
        return await this.lichService.getLichById(id);
    }

    @ResponseMessage("Tạo lịch thành công")
    @Roles(LoaiNhanVien.BacSi)
    @Post()
    async createLich(@Body() createLichDto: CreateLichDto) {
        return await this.lichService.createLich(createLichDto);
    }

    @ResponseMessage("Update lịch thành công")
    @Roles(LoaiNhanVien.BacSi)
    @Put(':id')
    async updateLich(@Param('id') id: string, @Body() updateLichDto: CreateLichDto) {
        return await this.lichService.updateLich(id, updateLichDto);
    }

    @ResponseMessage("Xóa lịch thành công")
    @Roles(LoaiNhanVien.BacSi)
    @Delete(':id')
    async deleteLich(@Param('id') id: string) {
        return await this.lichService.xoaLich(id);
    }


    @ResponseMessage("Lấy lịch khám của bác sĩ thành công")
    @Public()
    @Get('bacsi/:id')
    async getLichByBacSi(@Param('id') id: string) {
        return await this.lichService.getLichByBacSi(id);
    }

    @ResponseMessage("Lấy thống kê bệnh nhân đã đặt lịch, chưa đặt lịch, đã khám và chưa khám thành công")
    @Public()
    @Get('stats')
    async getLichStats() {
        return await this.lichService.getLichStats();
    }

    @ResponseMessage("Kiểm tra hóa đơn và chi tiết đặt lịch")
    @Public()
    @Post('check-invoice-appointment')
    async checkInvoiceAndAppointment(@Body() body: { maHD: string }) {
        return await this.lichService.checkInvoiceAndAppointment(body.maHD);
    }

    @ResponseMessage("Lấy thống kê dashboard bác sĩ hôm nay")
    @Public()
    @Get('bacsi/:id/stats/today')
    async getDoctorTodayStats(@Param('id') id: string) {
        return await this.lichService.getDoctorTodayStats(id);
    }

    @ResponseMessage("Lấy lịch hẹn hôm nay của bác sĩ")
    @Public()
    @Get('bacsi/:id/appointments/today')
    async getDoctorTodayAppointments(@Param('id') id: string) {
        return await this.lichService.getDoctorTodayAppointments(id);
    }

}
