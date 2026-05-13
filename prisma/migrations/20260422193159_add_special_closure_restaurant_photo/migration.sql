-- CreateTable
CREATE TABLE "special_closures" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "is_closed" BOOLEAN NOT NULL DEFAULT true,
    "open_time_min" INTEGER,
    "close_time_min" INTEGER,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "special_closures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_photos" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "restaurant_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "special_closures_restaurant_id_date_key" ON "special_closures"("restaurant_id", "date");

-- AddForeignKey
ALTER TABLE "special_closures" ADD CONSTRAINT "special_closures_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_photos" ADD CONSTRAINT "restaurant_photos_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
