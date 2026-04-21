-- CreateEnum
CREATE TYPE "RestaurantStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "restaurants" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "cuisine_type" VARCHAR(80) NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DECIMAL(9,6) NOT NULL,
    "lng" DECIMAL(9,6) NOT NULL,
    "phone" VARCHAR(20),
    "capacity" INTEGER NOT NULL,
    "reservation_capacity_factor" DECIMAL(3,2) NOT NULL DEFAULT 0.70,
    "reservation_duration_min" INTEGER NOT NULL DEFAULT 90,
    "min_advance_hours" INTEGER NOT NULL DEFAULT 2,
    "max_advance_days" INTEGER NOT NULL DEFAULT 30,
    "timezone" VARCHAR(50) NOT NULL DEFAULT 'America/Mexico_City',
    "status" "RestaurantStatus" NOT NULL DEFAULT 'ACTIVE',
    "rating_avg" DECIMAL(2,1),
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_hours" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "day_of_week" "DayOfWeek" NOT NULL,
    "open_time" VARCHAR(5) NOT NULL,
    "close_time" VARCHAR(5) NOT NULL,
    "is_closed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "business_hours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_slug_key" ON "restaurants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "business_hours_restaurant_id_day_of_week_key" ON "business_hours"("restaurant_id", "day_of_week");

-- AddForeignKey
ALTER TABLE "user_restaurants" ADD CONSTRAINT "user_restaurants_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_hours" ADD CONSTRAINT "business_hours_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
