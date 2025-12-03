/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `sales` table. All the data in the column will be lost.
  - Added the required column `amountDue` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentStatus` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSaleAmount` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `sale_items` DROP FOREIGN KEY `sale_items_saleId_fkey`;

-- DropIndex
DROP INDEX `sale_items_saleId_fkey` ON `sale_items`;

-- AlterTable
ALTER TABLE `sales` DROP COLUMN `paymentMethod`,
    DROP COLUMN `totalAmount`,
    ADD COLUMN `amountDue` DOUBLE NOT NULL,
    ADD COLUMN `amountPaid` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `dueDate` DATETIME(3) NULL,
    ADD COLUMN `paymentStatus` VARCHAR(191) NOT NULL,
    ADD COLUMN `totalSaleAmount` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amountPaid` DOUBLE NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `paymentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `saleId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `sales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `sales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
