import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { HoadonEntity } from './entity/hoadon.entity';
import * as path from 'path';

@Injectable()
export class PdfService {

  async generateHoadonPdf(hoadon: HoadonEntity, benhNhanInfo?: any, nhanVienInfo?: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, left: 50, right: 50, bottom: 50 },
          info: {
            Title: `Hóa đơn ${hoadon.MaHD}`,
            Subject: 'Hóa đơn thanh toán',
          }
        });

        const buffers: Buffer[] = [];
        
        // Try to register a font that supports Vietnamese
        // If this fails, it will fall back to default fonts
        try {
          // You can download and place a Vietnamese-supporting TTF font in assets/fonts/
          // doc.registerFont('VietnameseFont', path.join(__dirname, '../../assets/fonts/Roboto-Regular.ttf'));
        } catch (error) {
          // Fall back to default fonts if custom font is not available
          console.log('Custom font not found, using default fonts');
        }
        
        // Collect data chunks
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Header
        doc.fontSize(20)
           .font('Courier-Bold')
           .text('HOA DON THANH TOAN', { align: 'center' })
           .moveDown();

        // Hospital/Clinic Info
        doc.fontSize(12)
           .font('Courier')
           .text('BENH VIEN DAI HOC Y DUOC', { align: 'center' })
           .text('Dia chi: placeholder', { align: 'center' })
           .text('Dien thoai: 099 9999 9999', { align: 'center' })
           .moveDown(2);

        // Invoice Info
        doc.fontSize(14)
           .font('Courier-Bold')
           .text(`Ma hoa don: ${hoadon.MaHD}`)
           .font('Courier')
           .text(`Ngay tao: ${hoadon.NgayTao.toLocaleDateString('vi-VN')}`)
           .text(`Loai hoa don: ${hoadon.LoaiHoaDon}`)

           .text(`Phuong thuc thanh toan: ${hoadon.PhuongThucThanhToan}`)
           .moveDown();

        // Hàm chuyển tiếng Việt có dấu sang không dấu
        function removeVietnameseTones(str: string) {
          str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
          str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
          str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
          str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
          str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
          str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
          str = str.replace(/đ/g, "d");
          str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
          str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
          str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
          str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
          str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
          str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
          str = str.replace(/Đ/g, "D");
          str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
          str = str.replace(/\u02C6|\u0306|\u031B/g, "");
          str = str.replace(/ +/g, " ");
          str = str.trim();
          return str;
        }

        // Patient Info
        if (benhNhanInfo) {
          doc.fontSize(14)
             .font('Courier-Bold')
             .text('THONG TIN BENH NHAN:')
             .font('Courier')

             .text(`Ho ten benh nhan: ${benhNhanInfo.HoTen ? removeVietnameseTones(benhNhanInfo.HoTen) : 'N/A'}`)
             .text(`So dien thoai: ${benhNhanInfo.SDT || 'N/A'}`)
             .moveDown();
        }

        // Staff Info

        if (nhanVienInfo) {
          doc.fontSize(14)
            .font('Courier-Bold')
            .text('THONG TIN NHAN VIEN:')
            .font('Courier')
            .text(`Ho ten: ${nhanVienInfo.HoTen ? removeVietnameseTones(nhanVienInfo.HoTen) : 'N/A'}`)
            .text(`So dien thoai: ${nhanVienInfo.SDT || 'N/A'}`)

            .moveDown();
        }
        // Line separator
        doc.moveTo(50, doc.y)
           .lineTo(545, doc.y)
           .stroke()
           .moveDown();

        // Amount section
        doc.fontSize(16)
           .font('Courier-Bold')
           .text('CHI TIET THANH TOAN:', { align: 'left' })
           .moveDown();

        // Total amount
        doc.fontSize(18)
           .font('Courier-Bold')
           .text(`Tong tien: ${Number(hoadon.TongTien).toLocaleString('vi-VN')} VND`, { align: 'right' })
           .moveDown(2);

        // Footer
        doc.fontSize(10)
           .font('Courier')
           .text('Cam on quy khach da su dung dich vu!', { align: 'center' })
           .moveDown()
           .text(`Hoa don duoc tao tu dong vao ${new Date().toLocaleString('vi-VN')}`, { align: 'center' });

        // Finalize the PDF
        doc.end();

      } catch (error) {
        reject(error);
      }
    });
  }

}