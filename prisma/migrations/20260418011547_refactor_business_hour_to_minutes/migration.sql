/*
  Warnings:

  - You are about to drop the column `close_time` on the `business_hours` table. All the data in the column will be lost.
  - You are about to drop the column `open_time` on the `business_hours` table. All the data in the column will be lost.
  - Added the required column `close_time_min` to the `business_hours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `open_time_min` to the `business_hours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "business_hours" DROP COLUMN "close_time",
DROP COLUMN "open_time",
ADD COLUMN     "close_time_min" INTEGER NOT NULL,
ADD COLUMN     "open_time_min" INTEGER NOT NULL;
