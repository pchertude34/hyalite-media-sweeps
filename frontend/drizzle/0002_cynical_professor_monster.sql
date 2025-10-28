CREATE TABLE "question_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar NOT NULL,
	"question_index" integer NOT NULL,
	"client_id" varchar NOT NULL,
	"question_id" varchar NOT NULL,
	"question_text" varchar NOT NULL,
	"answer_text" varchar NOT NULL,
	"answer_status" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
