-- AlterTable
ALTER TABLE "Movement" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "MovementLog" ADD COLUMN     "notes" TEXT;
