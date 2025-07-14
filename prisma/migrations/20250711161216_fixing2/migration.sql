/*
  Warnings:

  - You are about to drop the column `access_Token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_Token` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "access_Token",
DROP COLUMN "refresh_Token",
ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "refresh_token" TEXT;
