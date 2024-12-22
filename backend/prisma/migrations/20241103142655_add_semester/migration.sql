/*
  Warnings:

  - Made the column `userId` on table `clearancerequest` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `clearancerequest` DROP FOREIGN KEY `ClearanceRequest_userId_fkey`;

-- AlterTable
ALTER TABLE `clearancerequest` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ClearanceRequest` ADD CONSTRAINT `ClearanceRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
