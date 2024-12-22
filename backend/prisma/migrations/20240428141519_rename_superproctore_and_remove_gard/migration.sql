/*
  Warnings:

  - You are about to drop the column `isGard` on the `clearancerequest` table. All the data in the column will be lost.
  - You are about to drop the column `isSuperProctor` on the `clearancerequest` table. All the data in the column will be lost.
  - You are about to drop the column `Gard` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `GardReason` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `SuperProctor` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `SuperProctorReason` on the `reports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `clearancerequest` DROP COLUMN `isGard`,
    DROP COLUMN `isSuperProctor`,
    ADD COLUMN `isSuperproctor` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `reports` DROP COLUMN `Gard`,
    DROP COLUMN `GardReason`,
    DROP COLUMN `SuperProctor`,
    DROP COLUMN `SuperProctorReason`,
    ADD COLUMN `Superproctor` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `SuperproctorReason` VARCHAR(191) NULL;
