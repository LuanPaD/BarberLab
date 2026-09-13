CREATE TABLE "RateLimit" (
    "key" VARCHAR(255) NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "expire" BIGINT,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);
