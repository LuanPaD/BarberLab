-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'BARBER_ADMIN');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'COMPLETED', 'CANCELED', 'NO_SHOW');

-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "phone" TEXT,
    ADD COLUMN "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    ADD COLUMN "barbershopId" TEXT;

-- AlterTable
ALTER TABLE "BarbershopService"
    ADD COLUMN "durationMinutes" INTEGER NOT NULL DEFAULT 45,
    ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- O default acima existe apenas para preencher as linhas já gravadas.
-- O schema declara @updatedAt (gerenciado pelo Prisma), então removemos o default.
ALTER TABLE "BarbershopService" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Booking"
    ADD COLUMN "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED';

-- CreateTable
CREATE TABLE "ScheduleBlock" (
    "id" TEXT NOT NULL,
    "barbershopId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduleBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_barbershopId_idx" ON "User"("barbershopId");

-- CreateIndex
CREATE INDEX "BarbershopService_barbershopId_isActive_idx" ON "BarbershopService"("barbershopId", "isActive");

-- CreateIndex
CREATE INDEX "Booking_serviceId_date_idx" ON "Booking"("serviceId", "date");

-- CreateIndex
CREATE INDEX "Booking_userId_date_idx" ON "Booking"("userId", "date");

-- CreateIndex
CREATE INDEX "ScheduleBlock_barbershopId_startsAt_idx" ON "ScheduleBlock"("barbershopId", "startsAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleBlock" ADD CONSTRAINT "ScheduleBlock_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey / AddForeignKey (BarbershopService agora usa onDelete: Cascade)
ALTER TABLE "BarbershopService" DROP CONSTRAINT "BarbershopService_barbershopId_fkey";
ALTER TABLE "BarbershopService" ADD CONSTRAINT "BarbershopService_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
