-- Nulo = o barbeiro ainda não viu o guia de primeiros passos.
ALTER TABLE "User" ADD COLUMN "onboardingDoneAt" TIMESTAMP(3);
