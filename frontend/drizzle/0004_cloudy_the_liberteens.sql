CREATE TABLE "question_impressions" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar NOT NULL,
	"question_index" integer NOT NULL,
	"client_id" varchar NOT NULL,
	"question_id" varchar NOT NULL,
	"question_text" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "client_question_impression_idx" ON "question_impressions" USING btree ("client_id","question_id");--> statement-breakpoint
CREATE INDEX "client_question_analytics_idx" ON "question_analytics" USING btree ("client_id","question_id");