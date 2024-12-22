-- AlterTable
ALTER TABLE `clearancerequest` ADD COLUMN `ReasonCafe` VARCHAR(191) NULL,
    ADD COLUMN `ReasonDepartment` VARCHAR(191) NULL,
    ADD COLUMN `ReasonLibrary` VARCHAR(191) NULL,
    ADD COLUMN `ReasonPolice` VARCHAR(191) NULL,
    ADD COLUMN `ReasonProctor` VARCHAR(191) NULL,
    ADD COLUMN `ReasonRegistrar` VARCHAR(191) NULL,
    ADD COLUMN `ReasonSuperproctor` VARCHAR(191) NULL;
