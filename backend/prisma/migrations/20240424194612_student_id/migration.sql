/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `StudentProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentId` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `studentprofile` ADD COLUMN `studentId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `StudentProfile_studentId_key` ON `StudentProfile`(`studentId`);
