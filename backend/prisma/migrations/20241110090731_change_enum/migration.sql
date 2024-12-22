/*
  Warnings:

  - The values [SUPER_PROCTOR] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('ADMIN', 'DEPARTMENT', 'CAFE', 'POLICE', 'LIBRARY', 'GARD', 'PROCTOR', 'SUPERPROCTOR', 'REGISTRAR', 'STUDENT') NOT NULL DEFAULT 'STUDENT';
