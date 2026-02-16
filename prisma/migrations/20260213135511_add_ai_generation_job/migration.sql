-- CreateEnum
CREATE TYPE "ai_job_status" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "ai_generation_job" (
    "id" TEXT NOT NULL,
    "inngestEventId" TEXT,
    "status" "ai_job_status" NOT NULL DEFAULT 'PENDING',
    "prompt" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'auto',
    "pageId" TEXT NOT NULL,
    "originX" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "originY" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "resultNodes" JSONB,
    "explanation" TEXT,
    "error" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ai_generation_job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_generation_job_userId_status_idx" ON "ai_generation_job"("userId", "status");
