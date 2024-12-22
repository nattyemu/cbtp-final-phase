-- AlterTable
ALTER TABLE `reports` ADD COLUMN `CafeReason` VARCHAR(191) NULL,
    ADD COLUMN `DepartmentReason` VARCHAR(191) NULL,
    ADD COLUMN `GardReason` VARCHAR(191) NULL,
    ADD COLUMN `LibraryReason` VARCHAR(191) NULL,
    ADD COLUMN `PoliceReason` VARCHAR(191) NULL,
    ADD COLUMN `ProctorReason` VARCHAR(191) NULL,
    ADD COLUMN `RegistrarReason` VARCHAR(191) NULL,
    ADD COLUMN `SuperProctorReason` VARCHAR(191) NULL;
