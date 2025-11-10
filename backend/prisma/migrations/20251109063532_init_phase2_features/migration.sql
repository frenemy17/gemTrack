/*
  Warnings:

  - You are about to drop the column `weight` on the `items` table. All the data in the column will be lost.
  - You are about to alter the column `cost` on the `items` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `price` on the `items` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - A unique constraint covering the columns `[sku]` on the table `items` will be added. If there are existing duplicate values, this will fail.
  - Made the column `sku` on table `items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `items` DROP COLUMN `weight`,
    ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `cgstPct` DOUBLE NULL,
    ADD COLUMN `grossWeight` DOUBLE NULL,
    ADD COLUMN `hallmarkingCharges` INTEGER NULL,
    ADD COLUMN `huid` VARCHAR(191) NULL,
    ADD COLUMN `makingPerGm` DOUBLE NULL,
    ADD COLUMN `netWeight` DOUBLE NULL,
    ADD COLUMN `otherCharges` INTEGER NULL,
    ADD COLUMN `purity` VARCHAR(191) NULL,
    ADD COLUMN `sgstPct` DOUBLE NULL,
    ADD COLUMN `stoneCharges` INTEGER NULL,
    ADD COLUMN `wastagePct` DOUBLE NULL,
    MODIFY `sku` VARCHAR(191) NOT NULL,
    MODIFY `cost` DOUBLE NULL,
    MODIFY `price` DOUBLE NULL;

-- CreateTable
CREATE TABLE `customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `pincode` VARCHAR(191) NULL,
    `pancard` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `customers_phone_key`(`phone`),
    UNIQUE INDEX `customers_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `totalAmount` DOUBLE NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `customerId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sale_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `soldPrice` DOUBLE NOT NULL,
    `soldMakingCharge` DOUBLE NULL,
    `soldWastage` DOUBLE NULL,
    `soldHallmarking` INTEGER NULL,
    `soldStoneCharges` INTEGER NULL,
    `soldOtherCharges` INTEGER NULL,
    `soldCgstPct` DOUBLE NULL,
    `soldSgstPct` DOUBLE NULL,
    `saleId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `items_sku_key` ON `items`(`sku`);

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `sales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
