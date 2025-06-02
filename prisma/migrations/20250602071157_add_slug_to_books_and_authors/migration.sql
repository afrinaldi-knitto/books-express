/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Authors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Books` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `authors` ADD COLUMN `slug` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `books` ADD COLUMN `slug` VARCHAR(150) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Authors_slug_key` ON `Authors`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Books_slug_key` ON `Books`(`slug`);
