-- CreateTable
CREATE TABLE "Kennel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "cp" TEXT NOT NULL,

    CONSTRAINT "Kennel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "kennelId" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_kennelId_fkey" FOREIGN KEY ("kennelId") REFERENCES "Kennel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
