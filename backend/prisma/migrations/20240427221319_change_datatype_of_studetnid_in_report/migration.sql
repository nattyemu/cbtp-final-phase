-- DropForeignKey
ALTER TABLE `reports` DROP FOREIGN KEY `Reports_studentId_fkey`;

-- AlterTable
ALTER TABLE `reports` MODIFY `studentId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Reports` ADD CONSTRAINT `Reports_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `StudentProfile`(`studentId`) ON DELETE RESTRICT ON UPDATE CASCADE;
