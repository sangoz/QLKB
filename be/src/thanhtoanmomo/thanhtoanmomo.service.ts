import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThanhtoanmomoRepository } from './thanhtoanmomo.repository';
import { CreateThanhToanMoMoDto, UpdateThanhToanMoMoDto, MoMoCallbackDto } from './dto/thanhtoanmomo.dto';
import { TrangThaiThanhToanMoMo } from './entity/thanhtoanmomo.entity';
import { HoadonService } from 'src/hoadon/hoadon.service';
import { ChitietdatlichService } from 'src/chitietdatlich/chitietdatlich.service';
import { TrangThaiHoadon, LoaiHoadon, PhuongThucThanhToan } from 'src/hoadon/entity/hoadon.entity';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class ThanhtoanmomoService {
    constructor(
        private readonly thanhtoanmomoRepository: ThanhtoanmomoRepository,
        private readonly configService: ConfigService,
        @Inject(forwardRef(() => HoadonService))
        private readonly hoadonService: HoadonService,
        @Inject(forwardRef(() => ChitietdatlichService))
        private readonly chitietdatlichService: ChitietdatlichService
    ) {}

    // Tạo payment link MoMo
    async createPaymentLink(amount: number, orderInfo: string, extraData?: string, maHD?: string) {
        try {
            const orderId = this.generateOrderId();
            const requestId = this.generateRequestId();
            
            const requestBody = {
                partnerCode: this.configService.get('MOMO_PARTNER_CODE'),
                partnerName: "Test",
                storeId: "MomoTestStore",
                requestId: requestId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                redirectUrl: this.configService.get('MOMO_REDIRECTURL'),
                ipnUrl: this.configService.get('MOMO_IPNURL'),
                lang: 'vi',
                extraData: extraData || '',
                requestType: "payWithATM",
                signature: ''
            };

            // Tạo signature
            const rawSignature = this.createRawSignature(requestBody);
            requestBody.signature = this.createSignature(rawSignature);

            // Gọi API MoMo
            const response = await axios.post(this.configService.get('MOMO_ENDPOINT'), requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.resultCode === 0) {
                // Lưu thông tin giao dịch vào database
                const createDto: CreateThanhToanMoMoDto = {
                    OrderId: orderId,
                    RequestId: requestId,
                    PartnerCode: this.configService.get('MOMO_PARTNER_CODE'),
                    Amount: amount,
                    OrderInfo: orderInfo,
                    RedirectUrl: this.configService.get('MOMO_REDIRECTURL'),
                    IpnUrl: this.configService.get('MOMO_IPNURL'),
                    ExtraData: extraData || '',
                    Signature: requestBody.signature,
                    PayUrl: response.data.payUrl,
                    DeepLink: response.data.deeplink,
                    QrCodeUrl: response.data.qrCodeUrl,
                    TrangThai: TrangThaiThanhToanMoMo.Pending,
                    MaHD: maHD || null
                };

                const savedTransaction = await this.thanhtoanmomoRepository.create(createDto);

                return {
                    success: true,
                    message: 'Tạo payment link thành công',
                    data: {
                        payUrl: response.data.payUrl,
                        deeplink: response.data.deeplink,
                        qrCodeUrl: response.data.qrCodeUrl,
                        orderId: orderId,
                        requestId: requestId,
                        transactionId: savedTransaction.MaGiaoDich
                    }
                };
            } else {
                throw new BadRequestException(`MoMo API Error: ${response.data.message}`);
            }
        } catch (error) {
            if (error.response) {
                throw new BadRequestException(`MoMo API Error: ${error.response.data.message || error.message}`);
            }
            throw new InternalServerErrorException(`Error creating payment link: ${error.message}`);
        }
    }

    // Kiểm tra trạng thái giao dịch
    async checkTransactionStatus(orderId: string) {
        try {
            const transaction = await this.thanhtoanmomoRepository.findByOrderId(orderId);
            if (!transaction) {
                throw new BadRequestException('Transaction not found');
            }

            return {
                success: true,
                data: transaction
            };
        } catch (error) {
            throw new InternalServerErrorException(`Error checking transaction status: ${error.message}`);
        }
    }

    async getAllPayments() {
        return await this.thanhtoanmomoRepository.findAll();
    }

    async getPaymentById(MaGiaoDich: string) {
        const result = await this.thanhtoanmomoRepository.findById(MaGiaoDich);
        if (!result) {
            throw new NotFoundException('Giao dịch không tồn tại');
        }
        return result;
    }

    async getPaymentByOrderId(OrderId: string) {
        const result = await this.thanhtoanmomoRepository.findByOrderId(OrderId);
        if (!result) {
            throw new NotFoundException('Giao dịch không tồn tại');
        }
        return result;
    }

    async getPaymentsByHoaDon(MaHD: string) {
        return await this.thanhtoanmomoRepository.findByHoaDon(MaHD);
    }

    async getPaymentsByStatus(status: TrangThaiThanhToanMoMo) {
        return await this.thanhtoanmomoRepository.findByTrangThai(status);
    }

    async updatePaymentStatus(MaGiaoDich: string, updateDto: UpdateThanhToanMoMoDto) {
        const existing = await this.thanhtoanmomoRepository.findById(MaGiaoDich);
        if (!existing) {
            throw new NotFoundException('Giao dịch không tồn tại');
        }
        return await this.thanhtoanmomoRepository.update(MaGiaoDich, updateDto);
    }

    async handleMoMoCallback(callbackData: MoMoCallbackDto) {
        try {
            // Verify signature
            const isValidSignature = this.verifySignature(callbackData);
            if (!isValidSignature) {
                throw new BadRequestException('Invalid signature');
            }

            // Find payment by orderId
            const payment = await this.thanhtoanmomoRepository.findByOrderId(callbackData.orderId);
            if (!payment) {
                throw new NotFoundException('Payment not found');
            }

            // Update payment status
            let status: TrangThaiThanhToanMoMo;
            switch (callbackData.resultCode) {
                case 0:
                    status = TrangThaiThanhToanMoMo.Success;
                    break;
                case 1006:
                    status = TrangThaiThanhToanMoMo.Cancelled;
                    break;
                case 1001:
                case 1002:
                case 1003:
                case 1004:
                case 1005:
                    status = TrangThaiThanhToanMoMo.Failed;
                    break;
                default:
                    status = TrangThaiThanhToanMoMo.Failed;
            }

            const updateDto: UpdateThanhToanMoMoDto = {
                TrangThai: status,
                MoMoTransId: callbackData.transId,
                PayType: callbackData.payType,
                Message: callbackData.message,
                ResultCode: callbackData.resultCode.toString()
            };

            const updatedPayment = await this.thanhtoanmomoRepository.updateByOrderId(callbackData.orderId, updateDto);

            // Nếu thanh toán thành công, tạo hóa đơn và cập nhật trạng thái appointment
            if (status === TrangThaiThanhToanMoMo.Success && payment.ExtraData) {
                try {
                    // Parse extraData để lấy thông tin MaLich và MaBN
                    const extraDataParams = new URLSearchParams(payment.ExtraData);
                    const maLich = extraDataParams.get('MaLich');
                    const maBN = extraDataParams.get('MaBN');

                    if (maLich && maBN) {
                        // Tạo hóa đơn tự động
                        const hoadonData = {
                            NgayTao: new Date(),
                            TongTien: payment.Amount,
                            TrangThai: TrangThaiHoadon.Done,
                            LoaiHoaDon: LoaiHoadon.KhamBenh,
                            PhuongThucThanhToan: PhuongThucThanhToan.MoMo,
                            MaBN: maBN
                        };

                        const hoadon = await this.hoadonService.createHoadonWithoutNV(hoadonData);
                        
                        // Cập nhật trạng thái appointment thành Done
                        await this.chitietdatlichService.updateAppointmentStatus(maLich, maBN, 'Done');

                        console.log('Đã tạo hóa đơn và cập nhật trạng thái appointment thành công:', {
                            hoadon: hoadon.MaHD,
                            maLich,
                            maBN
                        });
                    }
                } catch (error) {
                    console.error('Lỗi khi tạo hóa đơn hoặc cập nhật appointment:', error);
                    // Không throw error để không ảnh hưởng đến callback response
                }
            }

            return updatedPayment;
        } catch (error) {
            throw new BadRequestException('Error processing MoMo callback: ' + error.message);
        }
    }

    async deletePayment(MaGiaoDich: string) {
        const existing = await this.thanhtoanmomoRepository.findById(MaGiaoDich);
        if (!existing) {
            throw new NotFoundException('Giao dịch không tồn tại');
        }
        return await this.thanhtoanmomoRepository.delete(MaGiaoDich);
    }

    // Generate MoMo payment URL for frontend
    generatePaymentUrl(orderId: string, amount: number, orderInfo: string, extraData?: string): string {
        const requestId = `REQ_${Date.now()}`;
        const rawSignature = this.createRawSignature({
            amount,
            extraData: extraData || '',
            orderId,
            orderInfo,
            requestId,
            redirectUrl: this.configService.get('MOMO_REDIRECTURL'),
            ipnUrl: this.configService.get('MOMO_IPNURL')
        });
        const signature = this.createSignature(rawSignature);

        const momoEndpoint = this.configService.get('MOMO_ENDPOINT');
        
        // Return object with payment data for frontend to make the request
        return JSON.stringify({
            endpoint: momoEndpoint,
            data: {
                partnerCode: this.configService.get('MOMO_PARTNER_CODE'),
                accessKey: this.configService.get('MOMO_ACCESS_KEY'),
                requestId: requestId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                redirectUrl: this.configService.get('MOMO_REDIRECTURL'),
                ipnUrl: this.configService.get('MOMO_IPNURL'),
                requestType: 'payWithATM',
                extraData: extraData || '',
                signature: signature,
                lang: 'vi'
            }
        });
    }

    // Helper methods
    private generateOrderId(): string {
        return `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateRequestId(): string {
        return `REQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private createRawSignature(requestBody: any): string {
        return `accessKey=${this.configService.get('MOMO_ACCESS_KEY')}&amount=${requestBody.amount}&extraData=${requestBody.extraData}&ipnUrl=${requestBody.ipnUrl}&orderId=${requestBody.orderId}&orderInfo=${requestBody.orderInfo}&partnerCode=${requestBody.partnerCode}&redirectUrl=${requestBody.redirectUrl}&requestId=${requestBody.requestId}&requestType=${requestBody.requestType}`;
    }

    private createSignature(rawSignature: string): string {
        const secretKey = this.configService.get('MOMO_SECRET_KEY');
        return crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
    }

    private verifySignature(ipnData: any): boolean {
        const rawSignature = `accessKey=${this.configService.get('MOMO_ACCESS_KEY')}&amount=${ipnData.amount}&extraData=${ipnData.extraData}&message=${ipnData.message}&orderId=${ipnData.orderId}&orderInfo=${ipnData.orderInfo}&orderType=${ipnData.orderType}&partnerCode=${this.configService.get('MOMO_PARTNER_CODE')}&payType=${ipnData.payType}&requestId=${ipnData.requestId}&responseTime=${ipnData.responseTime}&resultCode=${ipnData.resultCode}&transId=${ipnData.transId}`;
        
        const expectedSignature = this.createSignature(rawSignature);
        return expectedSignature === ipnData.signature;
    }

    // Liên kết giao dịch với hóa đơn
    async linkTransactionToHoaDon(orderId: string, maHD: string) {
        try {
            const updateDto: UpdateThanhToanMoMoDto = {
                MaHD: maHD
            };

            const updatedTransaction = await this.thanhtoanmomoRepository.updateByOrderId(orderId, updateDto);
            
            return {
                success: true,
                message: 'Liên kết giao dịch với hóa đơn thành công',
                data: updatedTransaction
            };
        } catch (error) {
            throw new InternalServerErrorException(`Error linking transaction to invoice: ${error.message}`);
        }
    }
}
