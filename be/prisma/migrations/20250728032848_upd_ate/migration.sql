/*
  Warnings:

  - A unique constraint covering the columns `[TenKhoa]` on the table `Khoa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Khoa_TenKhoa_key" ON "Khoa"("TenKhoa");
