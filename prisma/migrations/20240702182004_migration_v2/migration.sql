/*
  Warnings:

  - Added the required column `file` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filename` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "file" BYTEA NOT NULL,
ADD COLUMN     "filename" TEXT NOT NULL;
