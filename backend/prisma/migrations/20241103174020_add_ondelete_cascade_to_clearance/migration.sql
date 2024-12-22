-- DropForeignKey
ALTER TABLE `clearance` DROP FOREIGN KEY `Clearance_requestId_fkey`;

-- AddForeignKey
ALTER TABLE `Clearance` ADD CONSTRAINT `Clearance_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `ClearanceRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
