/*
  Warnings:

  - Added the required column `semester` to the `ClearanceRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `clearancerequest` ADD COLUMN `isCafe` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isDepartment` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isGard` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isLibrary` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isPolice` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isProctor` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isRegistrar` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isSuperProctor` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `semester` VARCHAR(191) NOT NULL;
