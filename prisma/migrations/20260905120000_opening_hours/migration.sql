-- CreateTable
CREATE TABLE "OpeningHour" (
    "id" TEXT NOT NULL,
    "barbershopId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "opensAt" TEXT NOT NULL,
    "closesAt" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpeningHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OpeningHour_barbershopId_idx" ON "OpeningHour"("barbershopId");

-- CreateIndex
CREATE UNIQUE INDEX "OpeningHour_barbershopId_weekday_key" ON "OpeningHour"("barbershopId", "weekday");

-- AddForeignKey
ALTER TABLE "OpeningHour" ADD CONSTRAINT "OpeningHour_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Semeia o horario que estava fixo no codigo, para nenhuma barbearia ficar sem grade.
INSERT INTO "OpeningHour" ("id", "barbershopId", "weekday", "opensAt", "closesAt", "isClosed", "updatedAt")
SELECT gen_random_uuid(), b.id, d.weekday, d."opensAt", d."closesAt", d."isClosed", CURRENT_TIMESTAMP
FROM "Barbershop" b
CROSS JOIN (VALUES
    (0, '08:00', '18:00', true),
    (1, '08:00', '18:00', false),
    (2, '08:00', '18:00', false),
    (3, '08:00', '18:00', false),
    (4, '08:00', '18:00', false),
    (5, '08:00', '20:00', false),
    (6, '09:00', '16:00', false)
) AS d(weekday, "opensAt", "closesAt", "isClosed");
