ALTER TABLE "users" DROP CONSTRAINT "users_external_id_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "client_user_pkey" PRIMARY KEY("client_id","external_id");--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "client_id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "id";