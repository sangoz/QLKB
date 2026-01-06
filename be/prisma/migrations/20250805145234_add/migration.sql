-- CreateEnum
CREATE TYPE "TrangThaiThanhToanMoMo" AS ENUM ('Pending', 'Success', 'Failed', 'Cancelled', 'Expired');

-- CreateTable
CREATE TABLE "ThanhToanMoMo" (
    "MaGiaoDich" TEXT NOT NULL,
    "OrderId" TEXT NOT NULL,
    "RequestId" TEXT NOT NULL,
    "PartnerCode" TEXT NOT NULL,
    "Amount" DECIMAL(65,30) NOT NULL,
    "OrderInfo" TEXT NOT NULL,
    "RedirectUrl" TEXT,
    "IpnUrl" TEXT,
    "ExtraData" TEXT,
    "Signature" TEXT NOT NULL,
    "TrangThai" "TrangThaiThanhToanMoMo" NOT NULL DEFAULT 'Pending',
    "NgayTao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "NgayCapNhat" TIMESTAMP(3) NOT NULL,
    "MoMoTransId" TEXT,
    "PayType" TEXT,
    "ResponseTime" TIMESTAMP(3),
    "Message" TEXT,
    "ResultCode" TEXT,
    "MaHD" TEXT,

    CONSTRAINT "ThanhToanMoMo_pkey" PRIMARY KEY ("MaGiaoDich")
);

-- CreateIndex
CREATE UNIQUE INDEX "ThanhToanMoMo_OrderId_key" ON "ThanhToanMoMo"("OrderId");

-- CreateIndex
CREATE UNIQUE INDEX "ThanhToanMoMo_RequestId_key" ON "ThanhToanMoMo"("RequestId");

-- AddForeignKey
ALTER TABLE "ThanhToanMoMo" ADD CONSTRAINT "ThanhToanMoMo_MaHD_fkey" FOREIGN KEY ("MaHD") REFERENCES "HoaDon"("MaHD") ON DELETE SET NULL ON UPDATE CASCADE;
