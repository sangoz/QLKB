/*
  Warnings:

  - A unique constraint covering the columns `[SDT]` on the table `BenhNhan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BenhNhan_SDT_key" ON "BenhNhan"("SDT");
