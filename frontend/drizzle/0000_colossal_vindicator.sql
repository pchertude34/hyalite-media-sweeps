CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar NOT NULL,
	"page" integer,
	CONSTRAINT "users_external_id_unique" UNIQUE("external_id")
);
