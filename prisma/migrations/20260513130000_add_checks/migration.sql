ALTER TABLE "reservations"
ADD CONSTRAINT "reservations_num_persons_check"
CHECK ("num_persons" >= 1);

ALTER TABLE "reviews"
ADD CONSTRAINT "reviews_rating_check"
CHECK ("rating" BETWEEN 1 AND 5);
