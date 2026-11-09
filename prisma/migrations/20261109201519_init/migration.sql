-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'EMPLOYEE', 'ADMIN');

-- CreateEnum
CREATE TYPE "ReleaseType" AS ENUM ('ALBUM', 'SINGLE', 'EP');

-- CreateEnum
CREATE TYPE "Format" AS ENUM ('CD', 'VINYL', 'CASSETTE');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('MINT', 'GOOD', 'WORN', 'DAMAGED');

-- CreateEnum
CREATE TYPE "CopyStatus" AS ENUM ('AVAILABLE', 'RENTED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('ACTIVE', 'RETURNED', 'OVERDUE');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artists" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Releases" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "release_type" "ReleaseType" NOT NULL,
    "release_year" INTEGER NOT NULL,
    "label" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Releases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Release_Artists" (
    "release_id" INTEGER NOT NULL,
    "artist_id" INTEGER NOT NULL,
    "role" TEXT,

    CONSTRAINT "Release_Artists_pkey" PRIMARY KEY ("release_id","artist_id")
);

-- CreateTable
CREATE TABLE "Genres" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Release_Genres" (
    "release_id" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "Release_Genres_pkey" PRIMARY KEY ("release_id","genre_id")
);

-- CreateTable
CREATE TABLE "Tracks" (
    "id" SERIAL NOT NULL,
    "release_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "track_number" INTEGER NOT NULL,
    "duration_seconds" INTEGER NOT NULL,

    CONSTRAINT "Tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Copies" (
    "id" SERIAL NOT NULL,
    "release_id" INTEGER NOT NULL,
    "barcode" TEXT NOT NULL,
    "format" "Format" NOT NULL,
    "condition" "Condition" NOT NULL DEFAULT 'GOOD',
    "status" "CopyStatus" NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Copies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rentals" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "rental_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "RentalStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rentals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rental_Items" (
    "id" SERIAL NOT NULL,
    "rental_id" INTEGER NOT NULL,
    "copy_id" INTEGER NOT NULL,
    "return_date" TIMESTAMP(3),
    "fine_amount" DECIMAL(8,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT "Rental_Items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Genres_name_key" ON "Genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Copies_barcode_key" ON "Copies"("barcode");

-- AddForeignKey
ALTER TABLE "Release_Artists" ADD CONSTRAINT "Release_Artists_release_id_fkey" FOREIGN KEY ("release_id") REFERENCES "Releases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Release_Artists" ADD CONSTRAINT "Release_Artists_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Release_Genres" ADD CONSTRAINT "Release_Genres_release_id_fkey" FOREIGN KEY ("release_id") REFERENCES "Releases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Release_Genres" ADD CONSTRAINT "Release_Genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "Genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tracks" ADD CONSTRAINT "Tracks_release_id_fkey" FOREIGN KEY ("release_id") REFERENCES "Releases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Copies" ADD CONSTRAINT "Copies_release_id_fkey" FOREIGN KEY ("release_id") REFERENCES "Releases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rentals" ADD CONSTRAINT "Rentals_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rentals" ADD CONSTRAINT "Rentals_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental_Items" ADD CONSTRAINT "Rental_Items_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "Rentals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental_Items" ADD CONSTRAINT "Rental_Items_copy_id_fkey" FOREIGN KEY ("copy_id") REFERENCES "Copies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
