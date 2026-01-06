import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ThanhtoanmomoService } from './thanhtoanmomo.service';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { CreateThanhToanMoMoDto, UpdateThanhToanMoMoDto, MoMoCallbackDto } from './dto/thanhtoanmomo.dto';
import { TrangThaiThanhToanMoMo } from './entity/thanhtoanmomo.entity';
import { Public } from 'src/decorators/public.decorator';

@Controller('thanhtoanmomo')
export class ThanhtoanmomoController {
    constructor(private readonly thanhtoanmomoService: ThanhtoanmomoService) {}

    @Public()
    @ResponseMessage("Tạo payment link MoMo thành công")
    @Post('create-payment')
    async createPaymentRequest(
        @Body() body: { amount: number; orderInfo: string; extraData?: string; maHD?: string }
    ) {
        return await this.thanhtoanmomoService.createPaymentLink(
            body.amount,
            body.orderInfo,
            body.extraData,
            body.maHD
        );
    }

    @ResponseMessage("Tạo URL thanh toán MoMo thành công")
    @Post('generate-url')
    async generatePaymentUrl(
        @Body() body: { orderId: string; amount: number; orderInfo: string; extraData?: string }
    ) {
        const paymentUrl = this.thanhtoanmomoService.generatePaymentUrl(
            body.orderId,
            body.amount,
            body.orderInfo,
            body.extraData
        );
        return { paymentUrl };
    }

    @Public()
    @ResponseMessage("Lấy tất cả giao dịch MoMo thành công")
    @Get()
    async getAllPayments() {
        return await this.thanhtoanmomoService.getAllPayments();
    }

    @ResponseMessage("Lấy giao dịch theo ID thành công")
    @Get(':id')
    async getPaymentById(@Param('id') id: string) {
        return await this.thanhtoanmomoService.getPaymentById(id);
    }

    @ResponseMessage("Lấy giao dịch theo Order ID thành công")
    @Get('order/:orderId')
    async getPaymentByOrderId(@Param('orderId') orderId: string) {
        return await this.thanhtoanmomoService.getPaymentByOrderId(orderId);
    }

    @Public()
    @ResponseMessage("Kiểm tra trạng thái giao dịch thành công")
    @Get('check-status/:orderId')
    async checkTransactionStatus(@Param('orderId') orderId: string) {
        return await this.thanhtoanmomoService.checkTransactionStatus(orderId);
    }

    @ResponseMessage("Lấy giao dịch theo hóa đơn thành công")
    @Get('hoadon/:maHD')
    async getPaymentsByHoaDon(@Param('maHD') maHD: string) {
        return await this.thanhtoanmomoService.getPaymentsByHoaDon(maHD);
    }

    @ResponseMessage("Lấy giao dịch theo trạng thái thành công")
    @Get('by-status/:status')
    async getPaymentsByStatus(@Param('status') status: TrangThaiThanhToanMoMo) {
        return await this.thanhtoanmomoService.getPaymentsByStatus(status);
    }

    @ResponseMessage("Cập nhật trạng thái giao dịch thành công")
    @Put(':id')
    async updatePaymentStatus(
        @Param('id') id: string,
        @Body() updateDto: UpdateThanhToanMoMoDto
    ) {
        return await this.thanhtoanmomoService.updatePaymentStatus(id, updateDto);
    }

    @ResponseMessage("Xóa giao dịch thành công")
    @Delete(':id')
    async deletePayment(@Param('id') id: string) {
        return await this.thanhtoanmomoService.deletePayment(id);
    }

    @ResponseMessage("Xử lý callback MoMo thành công")
    @Public()
    @Post('callback')
    async handleMoMoCallback(@Body() callbackData: MoMoCallbackDto) {
        return await this.thanhtoanmomoService.handleMoMoCallback(callbackData);
    }

    @ResponseMessage("Webhook MoMo IPN")
    @Public()
    @Post('ipn')
    async handleMoMoIPN(@Body() callbackData: MoMoCallbackDto) {
        // Same as callback for now, can be customized later
        return await this.thanhtoanmomoService.handleMoMoCallback(callbackData);
    }
}
