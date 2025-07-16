/*
  Warnings:

  - A unique constraint covering the columns `[preview_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "_ProductPictures" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductPictures_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductPictures_B_index" ON "_ProductPictures"("B");

-- CreateIndex
CREATE UNIQUE INDEX "products_preview_id_key" ON "products"("preview_id");

-- AddForeignKey
ALTER TABLE "_ProductPictures" ADD CONSTRAINT "_ProductPictures_A_fkey" FOREIGN KEY ("A") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductPictures" ADD CONSTRAINT "_ProductPictures_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
