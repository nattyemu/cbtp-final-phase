/*
  Warnings:

  - Added the required column `academicYear` to the `Clearance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `clearance` ADD COLUMN `academicYear` VARCHAR(191) NOT NULL;
