-- Marca quando o barbeiro concluiu o guia de primeiros passos, para o guia não
-- reaparecer a cada login nem a cada aparelho. Nulo = ainda não viu.
ALTER TABLE "User" ADD COLUMN "onboardingDoneAt" TIMESTAMP(3);
